// api/drive.js — Vercel Serverless Function para leer archivos de Google Drive

async function getGoogleAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const encode = (obj) => btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const headerB64 = encode(header);
  const claimB64 = encode(claim);
  const signingInput = `${headerB64}.${claimB64}`;

  // Import private key and sign
  const keyData = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"]
  );

  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", cryptoKey, encoder.encode(signingInput)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signingInput}.${sigB64}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

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

async function readDriveFile(fileId, accessToken) {
  // Get file metadata first
  const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType`, {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });
  const meta = await metaRes.json();
  const { name, mimeType } = meta;

  let content = "";

  // Google Docs → export as text
  if (mimeType === "application/vnd.google-apps.document") {
    const exportRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    content = await exportRes.text();
  }
  // Google Sheets → export as CSV
  else if (mimeType === "application/vnd.google-apps.spreadsheet") {
    const exportRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    content = await exportRes.text();
  }
  // Google Slides → export as text
  else if (mimeType === "application/vnd.google-apps.presentation") {
    const exportRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    content = await exportRes.text();
  }
  // PDF, DOCX, etc → download directly
  else {
    const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    // For binary files, return placeholder
    content = `[Archivo: ${name} — tipo: ${mimeType}. Para mejor extracción, convierte a Google Docs.]`;
  }

  return { name, content: content.substring(0, 15000) }; // Limit content size
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL requerida" });

  const fileId = extractFileId(url);
  if (!fileId) return res.status(400).json({ error: "No se pudo extraer el ID del archivo de Drive" });

  try {
    const accessToken = await getGoogleAccessToken();
    const { name, content } = await readDriveFile(fileId, accessToken);
    return res.status(200).json({ name, content });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
