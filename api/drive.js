// api/drive.js — Google Drive reader, exports as PDF then extracts text via Claude

import { createSign } from 'crypto';

function extractFileId(url) {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/document\/d\/([a-zA-Z0-9_-]+)/,
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    /\/presentation\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString('base64url');
  const claim  = Buffer.from(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600, iat: now
  })).toString('base64url');

  const signingInput = `${header}.${claim}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const jwt = `${signingInput}.${sign.sign(privateKey, 'base64url')}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  const data = await res.json();
  if (data.error) throw new Error(`Auth: ${data.error_description || data.error}`);
  return data.access_token;
}

async function extractTextWithClaude(pdfBase64, fileName) {
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
          { type: "text", text: "Extrae todo el texto de este documento de forma ordenada. Incluye todos los títulos, párrafos, tablas y listas. Solo el texto, sin comentarios adicionales." }
        ]
      }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL requerida" });

  const fileId = extractFileId(url);
  if (!fileId) return res.status(400).json({ error: "No se pudo extraer el ID del archivo" });

  try {
    const token = await getAccessToken();

    // Get metadata
    const metaRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const meta = await metaRes.json();
    if (meta.error) throw new Error(`Drive: ${meta.error.message}`);

    const { name, mimeType } = meta;
    let pdfBuffer;

    // Export Google Docs/Sheets/Slides as PDF
    if (mimeType.includes("google-apps")) {
      const exportRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!exportRes.ok) throw new Error(`Export failed: ${exportRes.status}`);
      pdfBuffer = await exportRes.arrayBuffer();
    } else {
      // Download file directly (PDF, DOCX, etc)
      const fileRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!fileRes.ok) throw new Error(`Download failed: ${fileRes.status}`);
      pdfBuffer = await fileRes.arrayBuffer();
    }

    // Convert to base64 and extract text with Claude
    const base64 = Buffer.from(pdfBuffer).toString('base64');
    const content = await extractTextWithClaude(base64, name);

    if (!content || content.trim().length < 20) {
      throw new Error("No se pudo extraer contenido del archivo");
    }

    return res.status(200).json({ name, content });
  } catch (e) {
    console.error("Drive error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
