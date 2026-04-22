# 🤖 TGP · Agente RRHH

Agente de RRHH para onboarding y soporte a SDRs de TGP.

---

## 🚀 Deploy en Vercel (paso a paso)

### 1. Sube el código a GitHub

1. Ve a [github.com](https://github.com) e inicia sesión (o crea cuenta gratis)
2. Crea un **New repository** → llámalo `tgp-hr-onboarding` → Public → **Create**
3. En tu computador, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "TGP HR Agent inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tgp-hr-onboarding.git
git push -u origin main
```

---

### 2. Despliega en Vercel

1. Ve a [vercel.com](https://vercel.com) → **Sign up with GitHub**
2. Click en **Add New Project**
3. Importa el repo `tgp-hr-onboarding`
4. En **Environment Variables** agrega:
   - **Name:** `VITE_ANTHROPIC_API_KEY`
   - **Value:** tu API key de Anthropic (la encuentras en [console.anthropic.com](https://console.anthropic.com))
5. Click **Deploy** ✅

Tu app quedará en: `https://tgp-hr-onboarding.vercel.app`

---

### 3. PIN de Admin

El panel Admin está protegido con PIN. El PIN por defecto es:

```
tgp2024
```

Para cambiarlo, edita la línea en `src/App.jsx`:
```js
const ADMIN_PIN = "tgp2024"; // ← cambia esto
```

---

## 🔑 Obtener API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** → **Create Key**
4. Copia la key y pégala en Vercel como `VITE_ANTHROPIC_API_KEY`

---

## 📋 Uso

- **⚙️ Admin (RRHH):** Carga documentos de onboarding, políticas, beneficios y procesos
- **💬 Consultar (SDRs):** Chat con el agente para resolver dudas en tiempo real

---

*TGP · The Growth Partners*
