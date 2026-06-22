# 🔬 AQCOS — AI Quarantine Content Operating System

**Script Generator v2.0 Enterprise**

Platform AI untuk membuat script video konten karantina yang ilmiah, menarik, dan siap publish — untuk Tim Humas, Laboratorium, dan Pejabat Karantina Indonesia.

---

## ✨ Fitur

- **7 Gaya Penyampaian** — Humas Kekinian, Lucu & Ceria, Host YouTube, Reporter, Nat Geo, Documentary, Cinematic
- **4 Platform** — Instagram Reels, TikTok, YouTube Shorts, YouTube
- **4 Formula Konten** — Hook→Problem→CTA, Mitos→Fakta, POV, Storytelling
- **Script per Scene** — Visual, Shot, Kamera, Narasi, Voice Over, Talent, Mood
- **AI Image & Video Prompt** — siap paste ke Midjourney, DALL·E, Veo 3, Google Flow, Opal
- **Quick Copy** — copy Hook, Caption, Prompt, atau Full Output satu klik
- **Topik bebas** — tulis topik apapun secara manual

---

## 🚀 Setup Lokal

### 1. Clone repository

```bash
git clone https://github.com/USERNAME/aqcos.git
cd aqcos
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi API key Anda:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Dapatkan API key di:** https://console.anthropic.com/

### 4. Jalankan development server

```bash
npm run dev
```

Buka http://localhost:3000

---

## ☁️ Deploy ke Vercel

### Cara 1 — Via GitHub (Direkomendasikan)

1. **Push ke GitHub:**

```bash
git init
git add .
git commit -m "Initial commit — AQCOS v2.0"
git remote add origin https://github.com/USERNAME/aqcos.git
git push -u origin main
```

2. **Import di Vercel:**
   - Buka https://vercel.com/new
   - Klik **"Import Git Repository"**
   - Pilih repo `aqcos`
   - Klik **Deploy**

3. **Tambahkan Environment Variable di Vercel:**
   - Masuk ke dashboard project
   - Buka **Settings → Environment Variables**
   - Tambahkan:
     - **Name:** `ANTHROPIC_API_KEY`
     - **Value:** `sk-ant-xxxxxxxx...`
     - **Environment:** Production, Preview, Development ✓
   - Klik **Save**
   - Klik **Redeploy** agar perubahan aktif

### Cara 2 — Via Vercel CLI

```bash
npm i -g vercel
vercel
# Ikuti prompt, lalu set env variable:
vercel env add ANTHROPIC_API_KEY
```

---

## 📁 Struktur Project

```
aqcos/
├── pages/
│   ├── _app.js          # App wrapper + global CSS
│   ├── _document.js     # HTML head + meta tags
│   ├── index.js         # Halaman utama
│   └── api/
│       └── generate.js  # API route — proxy aman ke Anthropic
├── components/
│   ├── constants.js     # Semua data konfigurasi
│   ├── prompt.js        # Prompt builder + parser
│   ├── ui.js            # Komponen UI primitif
│   ├── SceneCard.js     # Kartu scene script
│   ├── InputPanel.js    # Panel form kiri
│   ├── SidePanel.js     # Panel sidebar kanan
│   └── ResultArea.js    # Area hasil + tabs
├── styles/
│   └── globals.css      # Global styles
├── .env.example         # Template env variable
├── .gitignore           # Pastikan .env.local tidak ter-commit
├── next.config.js
├── package.json
└── README.md
```

---

## 🔒 Keamanan API Key

- API key **tidak pernah** dikirim ke browser
- Semua request ke Anthropic melalui `/api/generate` (server-side)
- File `.env.local` sudah masuk `.gitignore` — aman dari GitHub
- Di Vercel, key disimpan sebagai encrypted environment variable

---

## 🛠️ Teknologi

- **Next.js 14** — framework React dengan API routes
- **Anthropic Claude Sonnet 4.6** — AI engine
- **Vercel** — hosting & deployment

---

## 📌 Catatan

- Biaya API Anthropic ditanggung pemilik key (bukan per-user)
- Untuk production publik, pertimbangkan rate limiting di `pages/api/generate.js`
- Model dapat diganti di `pages/index.js` → `model: "claude-sonnet-4-6"`

---

*AQCOS — AI Quarantine Content Operating System v2.0 Enterprise*
