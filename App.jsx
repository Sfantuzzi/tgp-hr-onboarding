import { useState, useEffect, useRef } from "react";

const TGP_LOGO = "data:image/webp;base64,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";

// Storage helpers (localStorage for standalone Vercel app)
const STORAGE_KEY = "tgp-hr-knowledge";
const HISTORY_KEY = "tgp-hr-history";
const ADMIN_PIN = "tgp2024"; // Change this PIN as needed

function loadKB() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveKB(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-40))); }

// ─── Claude API ──────────────────────────────────────────────────────────────
async function askClaude(question, knowledge, history) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const kb = knowledge.map((e, i) =>
    `[${i + 1}] ${e.title}\nCategoría: ${e.category}\nFecha: ${e.date}\n${e.content}`
  ).join("\n\n---\n\n");

  const system = `Eres el Agente de RRHH de TGP (The Growth Partners). Tienes acceso a toda la documentación oficial de onboarding y procesos internos.
Tu misión es ayudar a los SDRs y colaboradores a resolver sus dudas de forma clara, directa y profesional.

BASE DE CONOCIMIENTO:
${kb || "⚠️ Aún no hay documentación cargada. El equipo de RRHH debe cargar los documentos en el panel Admin."}

INSTRUCCIONES:
- Responde siempre en español
- Usa únicamente la información disponible en la base de conocimiento
- Si no tienes la respuesta, dilo claramente y recomienda contactar a RRHH de TGP
- Usa listas cuando ayude a la claridad
- Tono profesional, directo y cercano — así es TGP`;

  const msgs = [
    ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: question }
  ];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages: msgs })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || "No pude procesar tu consulta.";
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const Ico = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("chat");
  const [knowledge, setKnowledge] = useState(() => loadKB());
  const [history, setHistory] = useState(() => loadHistory());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Onboarding", content: "" });
  const [saved, setSaved] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    const userMsg = { role: "user", content: q, ts: Date.now() };
    const next = [...history, userMsg];
    setHistory(next);
    saveHistory(next);
    setLoading(true);
    try {
      const answer = await askClaude(q, knowledge, history);
      const botMsg = { role: "assistant", content: answer, ts: Date.now() };
      const final = [...next, botMsg];
      setHistory(final);
      saveHistory(final);
    } catch (e) {
      const errMsg = { role: "assistant", content: `❌ Error: ${e.message}. Verifica que la API key esté configurada.`, ts: Date.now() };
      const final = [...next, errMsg];
      setHistory(final);
      saveHistory(final);
    }
    setLoading(false);
  }

  function handleSaveDoc() {
    if (!form.title.trim() || !form.content.trim()) return;
    const entry = { ...form, date: new Date().toLocaleDateString("es-CL"), id: Date.now() };
    const updated = [...knowledge, entry];
    setKnowledge(updated);
    saveKB(updated);
    setForm({ title: "", category: "Onboarding", content: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDelete(id) {
    const updated = knowledge.filter(k => k.id !== id);
    setKnowledge(updated);
    saveKB(updated);
  }

  function handlePin(e) {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) { setAdminAuth(true); setPinError(false); }
    else { setPinError(true); setPinInput(""); }
  }

  const categories = ["Onboarding", "Beneficios", "Políticas", "Herramientas", "Procesos", "Cultura", "Otros"];
  const catColor = { Onboarding: "#fff", Beneficios: "#D4AF37", Políticas: "#aaa", Herramientas: "#c8a52e", Procesos: "#ddd", Cultura: "#e0c060", Otros: "#666" };
  const quickQ = ["¿Cuál es el proceso de onboarding?", "¿Qué herramientas debo usar?", "¿Cuáles son mis beneficios?", "¿Cuál es la política de vacaciones?"];

  // Styles
  const S = {
    page: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "#e8e8e8", display: "flex", flexDirection: "column" },
    header: { background: "#111", borderBottom: "1px solid #1e1e1e", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 64, flexShrink: 0 },
    divider: { width: 1, height: 28, background: "#2a2a2a" },
    navBtn: (active) => ({ padding: "7px 18px", borderRadius: 6, border: active ? "1px solid #D4AF37" : "1px solid #2a2a2a", cursor: "pointer", fontSize: 12, fontWeight: 600, background: active ? "#D4AF3712" : "transparent", color: active ? "#D4AF37" : "#555", transition: "all .15s", fontFamily: "inherit" }),
    chatWrap: { flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" },
    messages: { flex: 1, overflowY: "auto", padding: "28px 20px 12px", display: "flex", flexDirection: "column", gap: 20 },
    inputBar: { padding: "14px 20px 20px", borderTop: "1px solid #181818", background: "#0a0a0a", flexShrink: 0 },
    inputWrap: { display: "flex", gap: 10, maxWidth: 760, margin: "0 auto", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "8px 8px 8px 16px", alignItems: "flex-end" },
    sendBtn: (active) => ({ width: 36, height: 36, borderRadius: 7, border: "none", cursor: active ? "pointer" : "default", background: active ? "#D4AF37" : "#1a1a1a", color: active ? "#000" : "#333", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }),
    adminWrap: { flex: 1, overflowY: "auto", padding: "28px 24px", maxWidth: 860, margin: "0 auto", width: "100%" },
    card: { background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 22, marginBottom: 24 },
    input: { background: "#0a0a0a", border: "1px solid #222", borderRadius: 7, padding: "10px 14px", color: "#ddd", fontSize: 13.5, outline: "none", fontFamily: "inherit", width: "100%" },
    saveBtn: (active) => ({ background: active ? "#D4AF37" : "#1a1a1a", color: active ? "#000" : "#333", border: "none", padding: "10px 22px", borderRadius: 7, cursor: active ? "pointer" : "default", fontWeight: 700, fontSize: 13, fontFamily: "inherit", transition: "all .15s" }),
  };

  return (
    <div style={S.page}>
      {/* HEADER */}
      <header style={S.header}>
        <img src={TGP_LOGO} alt="TGP" style={{ height: 34, objectFit: "contain" }} />
        <div style={S.divider} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.8, color: "#fff", textTransform: "uppercase" }}>Agente RRHH</div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 1 }}>{knowledge.length} doc{knowledge.length !== 1 ? "s" : ""} cargados</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button style={S.navBtn(view === "chat")} onClick={() => setView("chat")}>💬 Consultar</button>
          <button style={S.navBtn(view === "admin")} onClick={() => setView("admin")}>⚙️ Admin</button>
        </div>
      </header>

      {/* ══ CHAT ══ */}
      {view === "chat" && (
        <div style={S.chatWrap}>
          <div style={S.messages}>
            {history.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: 40 }}>
                <img src={TGP_LOGO} alt="TGP" style={{ height: 48, marginBottom: 28, opacity: 0.85 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Bienvenido al Agente RRHH de TGP</div>
                <div style={{ color: "#444", fontSize: 14, maxWidth: 400, lineHeight: 1.7, marginBottom: 32 }}>
                  Resuelve tus dudas sobre onboarding, beneficios, políticas y procesos internos.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 520 }}>
                  {quickQ.map(q => (
                    <button key={q} onClick={() => setInput(q)} style={{ background: "#111", border: "1px solid #222", color: "#666", padding: "9px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{q}</button>
                  ))}
                </div>
              </div>
            )}

            {history.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start", maxWidth: 760, margin: "0 auto", width: "100%" }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0, background: "#161616", border: `1px solid ${msg.role === "user" ? "#2a2a2a" : "#D4AF3730"}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {msg.role === "user" ? <span style={{ fontSize: 14 }}>👤</span> : <img src={TGP_LOGO} alt="TGP" style={{ width: 22, objectFit: "contain" }} />}
                </div>
                <div style={{ maxWidth: "78%", background: msg.role === "user" ? "#161616" : "#111", border: `1px solid ${msg.role === "user" ? "#2a2a2a" : "#1e1e1e"}`, borderRadius: msg.role === "user" ? "12px 2px 12px 12px" : "2px 12px 12px 12px", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.7, color: msg.role === "user" ? "#ccc" : "#ddd", whiteSpace: "pre-wrap" }}>
                  {msg.role === "assistant" && <div style={{ fontSize: 10, fontWeight: 700, color: "#D4AF37", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, opacity: 0.8 }}>⭐ Agente TGP</div>}
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", maxWidth: 760, margin: "0 auto", width: "100%" }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: "#161616", border: "1px solid #D4AF3730", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={TGP_LOGO} alt="TGP" style={{ width: 22, objectFit: "contain" }} />
                </div>
                <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "2px 12px 12px 12px", padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", animation: "tgpPulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={S.inputBar}>
            <div style={S.inputWrap}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Escribe tu consulta... (Enter para enviar)" rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#ddd", fontSize: 13.5, resize: "none", lineHeight: 1.6, maxHeight: 120, overflowY: "auto", fontFamily: "inherit", padding: "4px 0" }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()} style={S.sendBtn(input.trim() && !loading)}>
                <Ico d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" s={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADMIN ══ */}
      {view === "admin" && (
        <div style={S.adminWrap}>
          {/* PIN gate */}
          {!adminAuth ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
              <img src={TGP_LOGO} alt="TGP" style={{ height: 44, marginBottom: 32, opacity: 0.85 }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Acceso Admin</div>
              <div style={{ color: "#444", fontSize: 13, marginBottom: 28 }}>Ingresa el PIN para acceder al panel de RRHH</div>
              <form onSubmit={handlePin} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)} placeholder="PIN de acceso"
                  style={{ ...S.input, width: 220, textAlign: "center", letterSpacing: 4, fontSize: 16, border: pinError ? "1px solid #e53e3e" : "1px solid #222" }} autoFocus />
                {pinError && <div style={{ color: "#e53e3e", fontSize: 12 }}>PIN incorrecto. Intenta nuevamente.</div>}
                <button type="submit" style={{ ...S.saveBtn(true), padding: "11px 32px", marginTop: 4 }}>Ingresar</button>
              </form>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Base de Conocimiento TGP</h2>
                  <p style={{ color: "#444", fontSize: 13 }}>Carga documentos de onboarding que los SDRs podrán consultar desde el chat.</p>
                </div>
                <button onClick={() => setAdminAuth(false)} style={{ background: "transparent", border: "1px solid #222", color: "#444", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Cerrar sesión</button>
              </div>

              {/* Form */}
              <div style={S.card}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#555", marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>+ Agregar documento</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 190px", gap: 10, marginBottom: 10 }}>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título del documento..." style={S.input} />
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...S.input, width: "auto" }}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Contenido: políticas, pasos del proceso, beneficios, herramientas, información relevante..." rows={6}
                  style={{ ...S.input, resize: "vertical", lineHeight: 1.65 }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, gap: 12, alignItems: "center" }}>
                  {saved && <span style={{ color: "#D4AF37", fontSize: 12, fontWeight: 600 }}>✓ Guardado</span>}
                  <button onClick={handleSaveDoc} disabled={!form.title.trim() || !form.content.trim()} style={S.saveBtn(form.title.trim() && form.content.trim())}>Guardar documento</button>
                </div>
              </div>

              {/* Doc list */}
              <div style={{ fontSize: 11, color: "#333", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>{knowledge.length} documentos</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {knowledge.length === 0 && (
                  <div style={{ textAlign: "center", padding: 52, color: "#333", background: "#111", borderRadius: 10, border: "1px dashed #1e1e1e", fontSize: 13 }}>
                    Sin documentos. Agrega el primero arriba.
                  </div>
                )}
                {knowledge.map(doc => (
                  <div key={doc.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 9, overflow: "hidden" }}>
                    <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}>
                      <span style={{ background: "#ffffff08", color: catColor[doc.category] || "#888", border: "1px solid #ffffff15", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.4, textTransform: "uppercase" }}>{doc.category}</span>
                      <span style={{ fontWeight: 600, fontSize: 13.5, flex: 1, color: "#ddd" }}>{doc.title}</span>
                      <span style={{ color: "#333", fontSize: 11 }}>{doc.date}</span>
                      <button onClick={e => { e.stopPropagation(); handleDelete(doc.id); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333", padding: 4, fontSize: 13 }}
                        onMouseEnter={e => e.currentTarget.style.color = "#e53e3e"} onMouseLeave={e => e.currentTarget.style.color = "#333"}>✕</button>
                    </div>
                    {expandedDoc === doc.id && (
                      <div style={{ borderTop: "1px solid #1a1a1a", padding: "14px 16px", color: "#555", fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{doc.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes tgpPulse { 0%,80%,100%{opacity:.2;transform:scale(.75)} 40%{opacity:1;transform:scale(1)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#1e1e1e;border-radius:3px}
        textarea:focus,input:focus,select:focus{border-color:#D4AF3750!important}
        body{background:#0a0a0a}
      `}</style>
    </div>
  );
}
