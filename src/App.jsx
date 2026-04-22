import { useState, useRef } from "react";

const TGP_LOGO = "data:image/webp;base64,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";

// ─── Configuración ────────────────────────────────────────────────────────────
// PIN maestro del superadmin — cámbialo en producción
const SUPER_PIN = "tgp-super-2024";

// ─── Storage ──────────────────────────────────────────────────────────────────
const KEYS = {
  kb:      "tgp-hr-kb",
  history: "tgp-hr-history",
  emails:  "tgp-hr-emails",   // lista de correos admin autorizados [{email, name, addedAt}]
};

const store = {
  get: (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } },
  set: (k, v)  => localStorage.setItem(k, JSON.stringify(v)),
};

// ─── Claude API ───────────────────────────────────────────────────────────────
async function askClaude(question, knowledge, history) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const kb = knowledge.map((e, i) =>
    `[${i+1}] ${e.title}\nCategoría: ${e.category}\nFecha: ${e.date}\n${e.content}`
  ).join("\n\n---\n\n");

  const system = `Eres el Agente de RRHH de TGP (The Growth Partners). Tienes acceso a la documentación oficial de onboarding y procesos internos.
Tu misión es ayudar a los SDRs a resolver sus dudas de forma clara y profesional.

BASE DE CONOCIMIENTO:
${kb || "⚠️ Aún no hay documentación cargada. El equipo de RRHH debe cargar documentos en el panel Admin."}

INSTRUCCIONES:
- Responde siempre en español
- Usa únicamente la información de la base de conocimiento
- Si no tienes la respuesta, recomienda contactar a RRHH de TGP
- Usa listas cuando ayude a la claridad
- Tono profesional, directo y cercano`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 1000, system,
      messages: [...history.slice(-8).map(m => ({ role: m.role, content: m.content })), { role: "user", content: question }]
    })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || "No pude procesar tu consulta.";
}

// ─── Utilidades ───────────────────────────────────────────────────────────────
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim().toLowerCase());
const normalizeEmail = (e) => e.trim().toLowerCase();

// ─── Estilos compartidos ──────────────────────────────────────────────────────
const S = {
  page:   { fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "#e8e8e8", display: "flex", flexDirection: "column" },
  header: { background: "#111", borderBottom: "1px solid #1e1e1e", padding: "0 24px", display: "flex", alignItems: "center", gap: 14, height: 64, flexShrink: 0 },
  wrap:   { flex: 1, overflowY: "auto", padding: "28px 24px", maxWidth: 820, margin: "0 auto", width: "100%" },
  card:   { background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 22, marginBottom: 20 },
  inp:    (err) => ({ background: "#0a0a0a", border: `1px solid ${err ? "#e53e3e" : "#222"}`, borderRadius: 7, padding: "10px 14px", color: "#ddd", fontSize: 13.5, outline: "none", fontFamily: "inherit", width: "100%", transition: "border-color .15s" }),
  btn:    (on, extra={}) => ({ background: on ? "#D4AF37" : "#1a1a1a", color: on ? "#000" : "#444", border: "none", borderRadius: 7, cursor: on ? "pointer" : "default", fontWeight: 700, fontSize: 13, fontFamily: "inherit", padding: "10px 22px", transition: "all .15s", ...extra }),
  navBtn: (on) => ({ padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", border: on ? "1px solid #D4AF37" : "1px solid #2a2a2a", background: on ? "#D4AF3712" : "transparent", color: on ? "#D4AF37" : "#555", transition: "all .15s" }),
  label:  { fontSize: 11, color: "#444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 },
  tag:    (color="#D4AF37") => ({ background: color+"12", color, border: `1px solid ${color}30`, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }),
};

// ─── EmailGate — pide correo y valida contra whitelist ───────────────────────
function EmailGate({ authorizedEmails, onSuccess }) {
  const [email, setEmail] = useState("");
  const [err, setErr]     = useState("");

  function submit(e) {
    e.preventDefault();
    const norm = normalizeEmail(email);
    if (!isValidEmail(norm)) { setErr("Ingresa un correo válido"); return; }
    const found = authorizedEmails.find(a => normalizeEmail(a.email) === norm);
    if (found) { onSuccess(found); }
    else { setErr("Este correo no tiene acceso al panel Admin. Contacta a RRHH de TGP."); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: "70vh", padding: 24 }}>
      <img src={TGP_LOGO} alt="TGP" style={{ height: 40, marginBottom: 28, opacity: 0.85 }} />
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Acceso Admin</div>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 28, textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
        Ingresa tu correo corporativo para verificar tu acceso
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", width: "100%", maxWidth: 320 }}>
        <input
          type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }}
          placeholder="tu@tgp.com"
          style={{ ...S.inp(!!err), textAlign: "center", fontSize: 14, letterSpacing: 0.3 }}
          autoFocus
        />
        {err && (
          <div style={{ color: "#e53e3e", fontSize: 12, textAlign: "center", lineHeight: 1.5, maxWidth: 280 }}>{err}</div>
        )}
        <button type="submit" style={{ ...S.btn(true), padding: "11px 0", width: "100%", marginTop: 4, fontSize: 14 }}>
          Verificar acceso
        </button>
      </form>
      <div style={{ marginTop: 20, fontSize: 12, color: "#333" }}>
        ¿No tienes acceso? Contacta a RRHH para ser autorizado.
      </div>
    </div>
  );
}

// ─── SuperPin Gate ────────────────────────────────────────────────────────────
function SuperPinGate({ children }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [ok, setOk]   = useState(false);

  function submit(e) {
    e.preventDefault();
    if (pin === SUPER_PIN) { setOk(true); }
    else { setErr(true); setPin(""); setTimeout(() => setErr(false), 2000); }
  }

  if (ok) return children({ logout: () => { setOk(false); setPin(""); } });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: "70vh", padding: 24 }}>
      <img src={TGP_LOGO} alt="TGP" style={{ height: 40, marginBottom: 28, opacity: 0.85 }} />
      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Superadmin · Gestión de Accesos</div>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 28, textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>
        Ingresa el PIN maestro para administrar quién puede acceder al panel Admin
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN maestro"
          style={{ ...S.inp(err), width: 220, textAlign: "center", letterSpacing: 4, fontSize: 15 }} autoFocus />
        {err && <div style={{ color: "#e53e3e", fontSize: 12 }}>PIN incorrecto</div>}
        <button type="submit" style={{ ...S.btn(true), padding: "11px 36px", marginTop: 4 }}>Ingresar</button>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView]           = useState("chat");
  const [knowledge, setKnowledge] = useState(() => store.get(KEYS.kb, []));
  const [history, setHistory]     = useState(() => store.get(KEYS.history, []));
  const [emails, setEmails]       = useState(() => store.get(KEYS.emails, [])); // whitelist
  const [adminUser, setAdminUser] = useState(null); // usuario admin logueado {email, name}

  // Chat
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Admin – form docs
  const [docForm, setDocForm]   = useState({ title: "", category: "Onboarding", content: "" });
  const [docSaved, setDocSaved] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState(null);

  // Super – form emails
  const [emailForm, setEmailForm]   = useState({ email: "", name: "" });
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailErr, setEmailErr]     = useState("");

  const scrollEnd = () => setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  // ── Chat ────────────────────────────────────────────────────────────────────
  async function sendMessage() {
    if (!input.trim() || loading) return;
    const q = input.trim(); setInput("");
    const next = [...history, { role: "user", content: q, ts: Date.now() }];
    setHistory(next); store.set(KEYS.history, next.slice(-40)); scrollEnd();
    setLoading(true);
    try {
      const answer = await askClaude(q, knowledge, history);
      const final = [...next, { role: "assistant", content: answer, ts: Date.now() }];
      setHistory(final); store.set(KEYS.history, final.slice(-40));
    } catch (e) {
      const final = [...next, { role: "assistant", content: `❌ Error: ${e.message}`, ts: Date.now() }];
      setHistory(final); store.set(KEYS.history, final.slice(-40));
    }
    setLoading(false); scrollEnd();
  }

  // ── Docs ────────────────────────────────────────────────────────────────────
  function saveDoc() {
    if (!docForm.title.trim() || !docForm.content.trim()) return;
    const updated = [...knowledge, { ...docForm, date: new Date().toLocaleDateString("es-CL"), id: Date.now() }];
    setKnowledge(updated); store.set(KEYS.kb, updated);
    setDocForm({ title: "", category: "Onboarding", content: "" });
    setDocSaved(true); setTimeout(() => setDocSaved(false), 2500);
  }
  function deleteDoc(id) { const u = knowledge.filter(k => k.id !== id); setKnowledge(u); store.set(KEYS.kb, u); }

  // ── Email whitelist ─────────────────────────────────────────────────────────
  function addEmail() {
    const norm = normalizeEmail(emailForm.email);
    if (!isValidEmail(norm)) { setEmailErr("Correo inválido"); return; }
    if (emails.find(e => normalizeEmail(e.email) === norm)) { setEmailErr("Este correo ya está en la lista"); return; }
    const updated = [...emails, { email: norm, name: emailForm.name.trim() || norm.split("@")[0], addedAt: new Date().toLocaleDateString("es-CL"), id: Date.now() }];
    setEmails(updated); store.set(KEYS.emails, updated);
    setEmailForm({ email: "", name: "" }); setEmailErr("");
    setEmailSaved(true); setTimeout(() => setEmailSaved(false), 2000);
  }
  function removeEmail(id) { const u = emails.filter(e => e.id !== id); setEmails(u); store.set(KEYS.emails, u); }

  const categories = ["Onboarding", "Beneficios", "Políticas", "Herramientas", "Procesos", "Cultura", "Otros"];
  const catColor = { Onboarding: "#fff", Beneficios: "#D4AF37", Políticas: "#aaa", Herramientas: "#c8a52e", Procesos: "#ddd", Cultura: "#e0c060", Otros: "#666" };
  const quickQ = ["¿Cuál es el proceso de onboarding?", "¿Qué herramientas debo usar?", "¿Cuáles son mis beneficios?", "¿Cuál es la política de vacaciones?"];

  // ── Nav: el tab Admin solo aparece si ya estás autenticado o si vas a entrar ─
  const navItems = [
    { id: "chat",  label: "💬 Consultar",  always: true },
    { id: "admin", label: "⚙️ Admin",      always: true },
    { id: "super", label: "🔑 Accesos",    always: true },
  ];

  return (
    <div style={S.page}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header style={S.header}>
        <img src={TGP_LOGO} alt="TGP" style={{ height: 34, objectFit: "contain" }} />
        <div style={{ width: 1, height: 26, background: "#2a2a2a" }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.8, color: "#fff", textTransform: "uppercase" }}>Agente RRHH</div>
          <div style={{ fontSize: 10, color: "#333", marginTop: 1 }}>{knowledge.length} docs · {emails.length} admins autorizados</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          {adminUser && view === "admin" && (
            <span style={{ fontSize: 12, color: "#555", marginRight: 8 }}>
              <span style={{ color: "#D4AF37" }}>●</span> {adminUser.email}
            </span>
          )}
          {navItems.map(v => (
            <button key={v.id} style={S.navBtn(view === v.id)} onClick={() => {
              if (v.id !== "admin") setAdminUser(null);
              setView(v.id);
            }}>{v.label}</button>
          ))}
        </div>
      </header>

      {/* ══ CHAT ════════════════════════════════════════════════════════════════ */}
      {view === "chat" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 12px", display: "flex", flexDirection: "column", gap: 20 }}>
            {history.length === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: 40 }}>
                <img src={TGP_LOGO} alt="TGP" style={{ height: 46, marginBottom: 24, opacity: 0.85 }} />
                <div style={{ fontSize: 21, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Bienvenido al Agente RRHH de TGP</div>
                <div style={{ color: "#444", fontSize: 14, maxWidth: 400, lineHeight: 1.7, marginBottom: 28 }}>
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
                <div style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0, background: "#161616", border: `1px solid ${msg.role === "user" ? "#2a2a2a" : "#D4AF3730"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {msg.role === "user" ? <span style={{ fontSize: 14 }}>👤</span> : <img src={TGP_LOGO} alt="TGP" style={{ width: 22, objectFit: "contain" }} />}
                </div>
                <div style={{ maxWidth: "78%", background: msg.role === "user" ? "#161616" : "#111", border: `1px solid ${msg.role === "user" ? "#2a2a2a" : "#1e1e1e"}`, borderRadius: msg.role === "user" ? "12px 2px 12px 12px" : "2px 12px 12px 12px", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.7, color: msg.role === "user" ? "#ccc" : "#ddd", whiteSpace: "pre-wrap" }}>
                  {msg.role === "assistant" && <div style={{ fontSize: 10, fontWeight: 700, color: "#D4AF37", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, opacity: 0.7 }}>⭐ Agente TGP</div>}
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
                    {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", animation: "tgpPulse 1.2s ease-in-out infinite", animationDelay: `${i*0.18}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div style={{ padding: "14px 20px 20px", borderTop: "1px solid #181818", background: "#0a0a0a", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 10, maxWidth: 760, margin: "0 auto", background: "#111", border: "1px solid #222", borderRadius: 10, padding: "8px 8px 8px 16px", alignItems: "flex-end" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Escribe tu consulta... (Enter para enviar)" rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#ddd", fontSize: 13.5, resize: "none", lineHeight: 1.6, maxHeight: 120, overflowY: "auto", fontFamily: "inherit", padding: "4px 0" }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ width: 36, height: 36, borderRadius: 7, border: "none", cursor: input.trim() && !loading ? "pointer" : "default", background: input.trim() && !loading ? "#D4AF37" : "#1a1a1a", color: input.trim() && !loading ? "#000" : "#333", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADMIN — documentos (requiere correo autorizado) ══════════════════════ */}
      {view === "admin" && !adminUser && (
        <EmailGate authorizedEmails={emails} onSuccess={(user) => setAdminUser(user)} />
      )}

      {view === "admin" && adminUser && (
        <div style={S.wrap}>
          {/* Header sección */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Base de Conocimiento TGP</h2>
              <p style={{ color: "#444", fontSize: 13 }}>Carga documentos que los SDRs podrán consultar desde el chat.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#111", border: "1px solid #1e1e1e", borderRadius: 8, padding: "8px 14px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34c78a" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#ddd", fontWeight: 600 }}>{adminUser.name}</div>
                  <div style={{ fontSize: 10, color: "#444" }}>{adminUser.email}</div>
                </div>
              </div>
              <button onClick={() => setAdminUser(null)} style={{ background: "transparent", border: "1px solid #1e1e1e", color: "#444", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Form nuevo doc */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 16 }}>+ Agregar documento</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 190px", gap: 10, marginBottom: 10 }}>
              <input value={docForm.title} onChange={e => setDocForm({ ...docForm, title: e.target.value })} placeholder="Título del documento..." style={S.inp(false)} />
              <select value={docForm.category} onChange={e => setDocForm({ ...docForm, category: e.target.value })} style={{ ...S.inp(false), width: "auto" }}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <textarea value={docForm.content} onChange={e => setDocForm({ ...docForm, content: e.target.value })}
              placeholder="Contenido: políticas, pasos del proceso, beneficios, herramientas..." rows={6}
              style={{ ...S.inp(false), resize: "vertical", lineHeight: 1.65 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, gap: 12, alignItems: "center" }}>
              {docSaved && <span style={{ color: "#D4AF37", fontSize: 12, fontWeight: 600 }}>✓ Guardado</span>}
              <button onClick={saveDoc} disabled={!docForm.title.trim() || !docForm.content.trim()} style={S.btn(docForm.title.trim() && docForm.content.trim())}>
                Guardar documento
              </button>
            </div>
          </div>

          {/* Lista docs */}
          <div style={{ ...S.label, marginBottom: 12 }}>{knowledge.length} documento{knowledge.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {knowledge.length === 0 && (
              <div style={{ textAlign: "center", padding: 52, color: "#2a2a2a", background: "#111", borderRadius: 10, border: "1px dashed #1e1e1e", fontSize: 13 }}>
                Sin documentos. Agrega el primero arriba.
              </div>
            )}
            {knowledge.map(doc => (
              <div key={doc.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 9, overflow: "hidden" }}>
                <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}>
                  <span style={S.tag(catColor[doc.category]||"#888")}>{doc.category}</span>
                  <span style={{ fontWeight: 600, fontSize: 13.5, flex: 1, color: "#ddd" }}>{doc.title}</span>
                  <span style={{ color: "#333", fontSize: 11 }}>{doc.date}</span>
                  <button onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#2a2a2a", padding: 4, fontSize: 14 }}
                    onMouseEnter={e => e.currentTarget.style.color="#e53e3e"}
                    onMouseLeave={e => e.currentTarget.style.color="#2a2a2a"}>✕</button>
                </div>
                {expandedDoc === doc.id && (
                  <div style={{ borderTop: "1px solid #1a1a1a", padding: "14px 16px", color: "#555", fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{doc.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ SUPER ADMIN — gestión de correos autorizados ════════════════════════ */}
      {view === "super" && (
        <SuperPinGate>
          {({ logout }) => (
            <div style={S.wrap}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Gestión de Accesos Admin</h2>
                  <p style={{ color: "#444", fontSize: 13 }}>Los correos que agregues podrán ingresar al panel ⚙️ Admin para cargar documentos.</p>
                </div>
                <button onClick={logout} style={{ background: "transparent", border: "1px solid #1e1e1e", color: "#444", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Cerrar sesión</button>
              </div>

              {/* Info box */}
              <div style={{ background: "#111", border: "1px solid #D4AF3718", borderRadius: 10, padding: "14px 18px", marginBottom: 24, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                <span style={{ color: "#D4AF37", fontWeight: 700 }}>¿Cómo funciona?</span> Agrega los correos del equipo de RRHH. Cuando intenten entrar a <strong style={{ color: "#888" }}>⚙️ Admin</strong>, se les pedirá su correo — si está en esta lista, acceden automáticamente. Si no está, verán un mensaje de acceso denegado.
              </div>

              {/* Form agregar correo */}
              <div style={S.card}>
                <div style={{ ...S.label, marginBottom: 16 }}>+ Agregar correo autorizado</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <div>
                    <div style={{ ...S.label, fontSize: 10, marginBottom: 6 }}>Correo electrónico</div>
                    <input
                      type="email" value={emailForm.email}
                      onChange={e => { setEmailForm({ ...emailForm, email: e.target.value }); setEmailErr(""); }}
                      placeholder="persona@tgp.com"
                      style={S.inp(!!emailErr)}
                    />
                  </div>
                  <div>
                    <div style={{ ...S.label, fontSize: 10, marginBottom: 6 }}>Nombre (opcional)</div>
                    <input value={emailForm.name} onChange={e => setEmailForm({ ...emailForm, name: e.target.value })}
                      placeholder="Ej: María González" style={S.inp(false)} />
                  </div>
                </div>
                {emailErr && <div style={{ color: "#e53e3e", fontSize: 12, marginBottom: 10 }}>{emailErr}</div>}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center" }}>
                  {emailSaved && <span style={{ color: "#D4AF37", fontSize: 12, fontWeight: 600 }}>✓ Correo autorizado</span>}
                  <button onClick={addEmail} disabled={!emailForm.email.trim()} style={S.btn(!!emailForm.email.trim())}>
                    Autorizar correo
                  </button>
                </div>
              </div>

              {/* Lista correos autorizados */}
              <div style={{ ...S.label, marginBottom: 12 }}>
                {emails.length} correo{emails.length !== 1 ? "s" : ""} autorizado{emails.length !== 1 ? "s" : ""}
              </div>

              {emails.length === 0 && (
                <div style={{ textAlign: "center", padding: 44, color: "#2a2a2a", background: "#111", borderRadius: 10, border: "1px dashed #1e1e1e", fontSize: 13, lineHeight: 1.6 }}>
                  Sin correos autorizados aún.<br/>Agrega el primero arriba.
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {emails.map((u) => (
                  <div key={u.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 9, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Avatar inicial */}
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#D4AF3712", border: "1px solid #D4AF3725", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#D4AF37", flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#ddd" }}>{u.name || u.email.split("@")[0]}</div>
                      <div style={{ fontSize: 11, color: "#444", marginTop: 2, fontFamily: "monospace" }}>{u.email}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={S.tag()}>Admin</span>
                      <span style={{ fontSize: 10, color: "#2a2a2a" }}>Desde {u.addedAt}</span>
                    </div>
                    <button onClick={() => removeEmail(u.id)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "#2a2a2a", padding: 6, fontSize: 16, flexShrink: 0 }}
                      onMouseEnter={e => e.currentTarget.style.color="#e53e3e"}
                      onMouseLeave={e => e.currentTarget.style.color="#2a2a2a"}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SuperPinGate>
      )}

      <style>{`
        @keyframes tgpPulse{0%,80%,100%{opacity:.2;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#1e1e1e;border-radius:3px}
        textarea:focus,input:focus,select:focus{border-color:#D4AF3750!important}
        body{background:#0a0a0a}
        input[type="email"]:focus{border-color:#D4AF3750!important}
      `}</style>
    </div>
  );
}
