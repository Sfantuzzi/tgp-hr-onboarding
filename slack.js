

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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body;

  // 1. Slack URL verification challenge — responder inmediatamente sin verificar firma
  if (body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  // 2. Procesar eventos de mensajes
  if (body.type === "event_callback") {
    const event = body.event;

    // Solo DMs que no sean del bot
    if (
      event.type === "message" &&
      event.channel_type === "im" &&
      !event.bot_id &&
      !event.subtype
    ) {
      // Responder 200 inmediatamente para evitar timeout de Slack
      res.status(200).json({ ok: true });

      // Procesar en background
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
