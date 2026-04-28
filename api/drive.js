// api/drive.js — Google Drive reader usando Node.js crypto nativo

import { createSign } from 'crypto';

function extractFileId(url) {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/document\/d\/([a-zA-Z0-9_-]+)/,
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
    /\/presentation\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
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
    exp: now + 3600,
    iat: now
  })).toString('base64url');

  const signingInput = `${header}.${claim}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const sig = sign.sign(privateKey, 'base64url');
  const jwt = `${signingInput}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await res.json();
  if (data.error) throw new Error(`Auth error: ${data.error_description || data.error}`);
  return data.access_token;
}

async function readFile(fileId, token) {
  // Get metadata
  const metaRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const meta = await metaRes.json();

  if (meta.error) throw new Error(`Drive error: ${meta.error.message}`);

  const { name, mimeType } = meta;
  let content = "";

  if (mimeType === "application/vnd.google-apps.document") {
    const r = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    content = await r.text();
  } else if (mimeType === "application/vnd.google-apps.spreadsheet") {
    const r = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    content = await r.text();
  } else if (mimeType === "application/vnd.google-apps.presentation") {
    const r = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    content = await r.text();
  } else {
    content = `[Archivo: ${name} — Tipo: ${mimeType}. Para mejor extracción, usa Google Docs.]`;
  }

  return { name, content: content.substring(0, 20000) };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL requerida" });

  const fileId = extractFileId(url);
  if (!fileId) return res.status(400).json({ error: "No se pudo extraer el ID del archivo" });

  try {
    const token = await getAccessToken();
    const { name, content } = await readFile(fileId, token);

    if (!content || content.trim().length < 10) {
      return res.status(200).json({
        name,
        content: `[Archivo "${name}" no tiene contenido legible. Asegúrate de que esté compartido con tgp-rrhh-agent@tgp-rrhh-agent.iam.gserviceaccount.com]`
      });
    }

    return res.status(200).json({ name, content });
  } catch (e) {
    console.error("Drive error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
