# 🚀 Nexus AI — Complete Setup Guide

## Project Structure
```
nexusai/
├── index.html          ← Landing page
├── dashboard.html      ← Main dashboard
├── analytics.html      ← Analytics (Marketing, Product, Funnel)
├── reports.html        ← AI Report generator
├── upload.html         ← File upload center
├── chat.html           ← AI business assistant
├── contact.html        ← Contact form
├── login.html          ← Login / Register
├── style.css           ← Global pastel blue design system
├── main.js             ← Global JS utilities
├── backend/            ← Node.js + Express API
│   ├── server.js
│   ├── routes/         ← upload, analyze, chat, report, contact, auth, dashboard, analytics
│   ├── models/         ← User, Upload, Contact
│   ├── package.json
│   └── .env.example
└── automation/
    └── google-apps-script.js
```

---

## STEP 1 — GitHub Pages (Frontend)

1. Go to [github.com](https://github.com) → New repository → Name: `nexusai`
2. Upload all frontend files (index.html, dashboard.html, analytics.html, reports.html, upload.html, chat.html, contact.html, login.html, style.css, main.js)
3. Go to **Settings → Pages → Source → GitHub Actions**
4. The `.github/workflows/deploy.yml` will auto-deploy on push
5. Your site: `https://Smart123-12.github.io/nexusai/`

---

## STEP 2 — MongoDB Atlas (Free Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) → Create free account
2. Create a **Free M0 cluster** (512MB free)
3. **Database Access** → Add user → Set username & password
4. **Network Access** → Add IP → `0.0.0.0/0` (allow all)
5. **Connect** → Drivers → Copy connection string
6. Replace `<username>` and `<password>` in the string

---

## STEP 3 — Google Gemini API (Free)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google → **Get API Key** → Create API Key
3. Copy the key (starts with `AIza...`)
4. Free tier: 60 requests/minute, 1500 requests/day

---

## STEP 4 — Render.com Backend (Free Hosting)

1. Go to [render.com](https://render.com) → Sign in with smitparmar280@gmail.com
2. **New → Web Service** → Connect GitHub → Select your repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
4. **Environment Variables** → Add:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `GEMINI_API_KEY` = your Gemini API key
   - `JWT_SECRET` = any random 32-char string
5. Deploy → Copy your Render URL (e.g., `https://nexusai.onrender.com`)

---

## STEP 5 — Google Apps Script (Automation)

1. Go to [script.google.com](https://script.google.com) → New Project
2. Paste the code from `automation/google-apps-script.js`
3. Replace in CONFIG:
   - `SHEET_ID`: Create a Google Sheet → copy ID from URL
   - `ADMIN_EMAIL`: `smitparmar280@gmail.com`
4. Set Gemini key in **Project Settings → Script Properties**:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini key
5. Run `setup()` function once (authorize permissions)
6. **Deploy → New Deployment → Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy Web App URL → Add to Render env: `GOOGLE_SCRIPT_URL`

---

## STEP 6 — Connect Frontend to Backend

Update the API URL in your HTML files. Add this in each page's `<script>`:
```js
const API_BASE = 'https://nexusai.onrender.com'; // Your Render URL
```

Then in contact.html, replace the comment with:
```js
fetch(API_BASE + '/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

---

## STEP 7 — Looker Studio Dashboard

1. Go to [lookerstudio.google.com](https://lookerstudio.google.com)
2. **Create → Data Source → Google Sheets** → Select your sheet
3. **Create Report** → Add charts:
   - Scorecard: Total leads (count)
   - Bar chart: Leads by inquiry type
   - Time series: Daily submissions
   - Table: Recent contacts
4. Use **Theme → Custom** → Set colors to `#A7C7E7`, `#6B8FB3`, `#D6EAF8`

---

## Demo Credentials

- **Email**: demo@nexusai.in
- **Password**: demo1234

---

## Tech Stack Summary

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | HTML5 + Tailwind CDN + Chart.js | Free |
| Backend | Node.js + Express | Free |
| Database | MongoDB Atlas M0 | Free |
| AI | Google Gemini API | Free tier |
| Hosting (FE) | GitHub Pages | Free |
| Hosting (BE) | Render.com | Free |
| Automation | Google Apps Script | Free |
| Analytics | Looker Studio | Free |

**Total Cost: ₹0/month** 🎉
