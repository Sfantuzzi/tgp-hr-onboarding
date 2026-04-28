// api/slack.js — Vercel Serverless Function para el bot de Slack

const SUPABASE_URL = "https://tvattznxqmpdplgydgnb.supabase.co";

// Cache simple para evitar procesar el mismo evento dos veces
const processedEvents = new Set();

async function getKnowledge() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge?order=id.asc&select=title,category,content`, {
    headers: {
      "apikey": process.env.SUPABASE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_KEY}`,
    }
  });
  if (!res.ok) return [];
  return await res.json();
}

async function askClaude(question, knowledge) {
  const kb = knowledge.length > 0
    ? knowledge.map((e, i) => `[${i+1}] ${e.title}\n${e.content}`).join("\n\n---\n\n")
    : "No hay documentación cargada aún.";

  const system = `Eres el Agente de RRHH de TGP. Responde dudas sobre onboarding y procesos internos.
BASE DE CONOCIMIENTO: ${kb}
REGLAS: Responde en español, sé conciso (máx 3 párrafos), usa la info disponible, tono profesional y cercano.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", // Modelo más rápido
      max_tokens: 500,
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body;

  // Slack URL verification
  if (body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  // Eventos de mensajes
  if (body.type === "event_callback") {
    const event = body.event;
    const eventId = body.event_id;

    // Evitar procesar el mismo evento dos veces (Slack reintenta si no responde rápido)
    if (processedEvents.has(eventId)) {
      return res.status(200).json({ ok: true });
    }
    processedEvents.add(eventId);
    // Limpiar cache después de 1 minuto
    setTimeout(() => processedEvents.delete(eventId), 60000);

    // Solo DMs que no sean del bot
    if (
      event.type === "message" &&
      event.channel_type === "im" &&
      !event.bot_id &&
      !event.subtype
    ) {
      // Responder 200 inmediatamente
      res.status(200).json({ ok: true });

      try {
        const question = event.text?.trim();
        if (!question) return;

        // Obtener knowledge y preguntar a Claude en paralelo con timeout
        const [knowledge] = await Promise.all([
          getKnowledge()
        ]);

        const answer = await Promise.race([
          askClaude(question, knowledge),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000))
        ]);

        await sendSlackMessage(event.channel, `*Agente RRHH TGP* 🤖\n\n${answer}`);
      } catch (e) {
        const msg = e.message === "timeout"
          ? "⏱️ La consulta tardó demasiado. Intenta de nuevo con una pregunta más específica."
          : `❌ Error: ${e.message}`;
        await sendSlackMessage(event?.channel, msg);
      }
      return;
    }
  }

  return res.status(200).json({ ok: true });
}
