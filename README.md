# Agri-Pivot AI 🌾

**Smart Mandi Price Prediction & Logistics Optimization System**

An industry-grade agricultural dashboard featuring price forecasting, profit calculators, weather advisories, logistics tools, and real-time market insights — built for Indian farmers and traders.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS, Framer Motion, Recharts, Zustand, React Router |
| **Backend** | Python (HTTP server), SQLite |
| **Deployment** | Vercel (frontend) |

---

## Project Structure

```
agri-pivot-2026/
├── backend/              # Python API server + SQLite database
│   ├── main.py           # HTTP server with /api/predict endpoint
│   ├── seed_database.py  # CSV → SQLite seeder
│   └── sample_onion_data.csv
├── frontend/             # Legacy React (JS) frontend
├── frontend_ts/          # Primary React (TS) frontend ← deploy this
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/         # Login + mock auth (Zustand)
│   │   │   ├── dashboard/    # Main dashboard with charts & widgets
│   │   │   ├── prediction/   # Price forecast chart + data hooks
│   │   │   ├── market/       # Mandi price listings
│   │   │   └── tools/        # Calculator, Weather, Logistics
│   │   ├── components/ui/    # Reusable Button component
│   │   └── lib/              # Utilities (cn helper)
│   └── vercel.json           # SPA rewrite rules
```

---

## Features

- **Price Forecasting** — 30-day historical + 14-day AI prediction with confidence intervals
- **AI Trade Signal** — BUY / SELL / HOLD recommendations per crop
- **Profit Calculator** — Transport costs, labor, margins with animated receipt
- **Weather Advisory** — Agricultural alerts with disease risk warnings
- **Logistics Hub** — Transporter discovery with load pooling discounts
- **Market Pulse** — Live mandi prices across commodities
- **Auth System** — Role-based login (Farmer / Trader) with persistent sessions

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20.19 (required by Vite 7)
- **Python** 3.10+ (for backend, optional)

### Frontend (Primary)

```bash
cd frontend_ts
npm install
npm run dev
```

Open **http://localhost:5173** and login with:
- **Email:** `farmer@agri.com`
- **Password:** `demo`

### Backend (Optional)

The frontend runs standalone with mock data. To use the backend API:

```bash
cd backend
pip install -r requirements.txt
python seed_database.py    # Seed SQLite from CSV
python main.py             # Starts on http://localhost:8000
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set **Root Directory** to `frontend_ts`
4. Framework preset: **Vite** (auto-detected)
5. Deploy

The `vercel.json` SPA rewrite is already configured.

---

## Demo Credentials

| Field | Value |
|---|---|
| Email | `farmer@agri.com` |
| Password | `demo` |

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Role toggle (Farmer/Trader), email/password auth |
| `/` | Dashboard | Forecast chart, AI signal, market pulse, quick actions |
| `/calculator` | Profit Calculator | Revenue, transport, labor cost engine |
| `/weather` | Weather | 5-day forecast + agri-advisory alerts |
| `/markets` | Markets | Commodity prices across mandis |
| `/logistics` | Logistics | Transporter listings with pooling |
