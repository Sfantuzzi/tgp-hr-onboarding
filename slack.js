// api/slack.js — Vercel Serverless Function para el bot de Slack

const SUPABASE_URL = "https://tvattznxqmpdplgydgnb.supabase.co";

async function getKnowledge() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge?order=id.asc`, {
    headers: {
      "apikey": process.env.SUPABASE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_KEY}`,
    }
  });
  if (!res.ok) return [];
  return await res.json();
}

async function askClaude(question, knowledge) {
  const kb = knowledge.map((e, i) =>
    `[${i+1}] ${e.title}\nCategoría: ${e.category}\n${e.content}`
  ).join("\n\n---\n\n");

  const system = `Eres el Agente de RRHH de TGP. Tienes acceso a la documentación oficial de onboarding y procesos internos.
Tu misión es ayudar a los SDRs a resolver sus dudas de forma clara y profesional.

BASE DE CONOCIMIENTO:
${kb || "Aún no hay documentación cargada. Contacta a RRHH de TGP."}

INSTRUCCIONES:
- Responde siempre en español
- Usa únicamente la información de la base de conocimiento
- Si no tienes la respuesta, recomienda contactar a RRHH de TGP
- Respuestas concisas — estás en Slack
- Usa listas cuando ayude a la claridad
- Tono profesional, directo y cercano`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system,
      messages: [{ role: "user", content: question }]
    })
  });

  const data = await res.json();
  return data.content?.[0]?.text || "No pude procesar tu consulta.";
}

async function sendSlackMessage(channel, text) {
  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SLACK_BOT_TOKEN}`
    },
    body: JSON.stringify({ channel, text })
  });
}

async function verifySlackSignature(reqHeaders, rawBody) {
  const timestamp = reqHeaders["x-slack-request-timestamp"];
  const signature = reqHeaders["x-slack-signature"];
  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(process.env.SLACK_SIGNING_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(sigBasestring));
  const hex = "v0=" + Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  return hex === signature;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const rawBody = JSON.stringify(req.body);
  const isValid = await verifySlackSignature(req.headers, rawBody);
  if (!isValid) return res.status(401).json({ error: "Invalid signature" });

  const body = req.body;

  // Slack URL verification
  if (body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  // Eventos de mensajes
  if (body.type === "event_callback") {
    const event = body.event;

    // Solo DMs que no sean del bot
    if (event.type === "message" && event.channel_type === "im" && !event.bot_id && !event.subtype) {
      res.status(200).json({ ok: true });

      try {
        const question = event.text?.trim();
        if (!question) return;

        await sendSlackMessage(event.channel, "⏳ Consultando la base de conocimiento de TGP...");

        const knowledge = await getKnowledge();
        const answer = await askClaude(question, knowledge);

        await sendSlackMessage(event.channel, `*Agente RRHH TGP* 🤖\n\n${answer}`);
      } catch (e) {
        await sendSlackMessage(event?.channel, `❌ Error: ${e.message}`);
      }
      return;
    }
  }

  return res.status(200).json({ ok: true });
}
