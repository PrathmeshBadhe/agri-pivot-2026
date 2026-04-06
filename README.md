# Agri-Pivot AI

**Smart Mandi Price Prediction & Logistics System for Indian Farmers**

> Powered by Random Forest ML trained on 220,000+ real mandi records — with macro-economic intelligence (weather, export bans, global supply disruption).

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![ML Model](https://img.shields.io/badge/R%C2%B2%20Accuracy-84.4%25-brightgreen)](#ml-model)
[![License](https://img.shields.io/badge/License-MIT-blue)](#)

---

## Features

| Feature | Description |
|---|---|
| **Price Forecast** | 14-day AI prediction with confidence bands for Onion, Tomato, Potato |
| **Grade Pricing** | Standard / A-Grade / Premium category prices per forecast |
| **Model Accuracy Card** | Live R² score, RMSE error, and feature list displayed on dashboard |
| **AI Signal** | BUY / SELL / HOLD recommendation per commodity |
| **Profit Calculator** | Revenue, transport, labour cost engine |
| **Logistics Hub** | Transporter listings with load-pooling discounts |
| **Weather Advisory** | 5-day forecast with disease risk alerts |
| **Market Pulse** | Live mandi prices across Maharashtra mandis |
| **Auth System** | Role-based login (Farmer / Trader) with persistent sessions |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS, Framer Motion, Recharts, Zustand |
| **Backend** | Python (Flask), Vercel Serverless Functions |
| **ML Model** | scikit-learn RandomForestRegressor, joblib |
| **Deployment** | Vercel (frontend + serverless API, zero-config) |

---

## ML Model

The prediction engine is trained on **223,000+ rows** of historical APMC mandi data (2019–2026).

### Features Used

| Category | Features |
|---|---|
| **Location** | State, Market (Label Encoded) |
| **Time** | Month, Year, Day of Week, Day of Year |
| **Agriculture** | Producing State flag, Harvest Season flag, Drought Risk flag |
| **Macro-Economic** | Weather Shock, Tariff/Export Ban Active, War Supply Disruption |

### Performance

| Metric | Value |
|---|---|
| **R² Score** | 0.8436 **(84.4% variance explained)** |
| **RMSE** | Rs.486 / Quintal (~Rs.4.86 / Kg) |
| **Dataset** | 223,212 rows from 2019–2026 |
| **Algorithm** | Random Forest (50 trees, max depth 12) |

---

## Project Structure

```
agri-pivot-2026/
├── api/                    # Vercel Serverless Functions (Python)
│   ├── index.py            # /api/predict and /api/metrics endpoints
│   ├── model.pkl           # Trained ML model + accuracy metrics
│   └── requirements.txt    # Python dependencies
│
├── ml/                     # ML training pipeline (run locally)
│   ├── train_model.py      # Full training script with macro features
│   └── fetch_live_data.py  # Live price scraper / bridge data generator
│
├── ml_data/                # Raw datasets (gitignored large XMLs)
│   └── Live_Scraped_Prices.csv
│
├── src/                    # React TypeScript frontend
│   ├── features/
│   │   ├── auth/           # Login + role-based auth (Zustand)
│   │   ├── dashboard/      # Main dashboard (chart, signal, accuracy card)
│   │   ├── prediction/     # ForecastChart, usePrediction hook
│   │   ├── market/         # Mandi price listings
│   │   └── tools/          # Calculator, Weather, Logistics pages
│   └── components/ui/
│       ├── Button.tsx
│       └── ModelAccuracyCard.tsx   # AI accuracy gauge widget
│
├── index.html
├── package.json
├── vite.config.ts          # Vite + /api proxy for local dev
└── vercel.json             # SPA rewrites
```

---

## Quick Start

### Prerequisites
- Node.js >= 20
- Python 3.10+

### Frontend

```bash
npm install
npm run dev
```
Open **http://localhost:5173** and log in with:
- Email: `farmer@agri.com`
- Password: `demo`

### Backend (local dev)

```bash
pip install -r api/requirements.txt
python api/index.py        # Starts Flask on http://localhost:8000
```

Vite will automatically proxy `/api` requests to the Flask server during `npm run dev`.

### ML Training Pipeline

```bash
pip install pandas scikit-learn numpy joblib requests beautifulsoup4
python ml/fetch_live_data.py   # Generate live bridge data (2024-2026)
python ml/train_model.py       # Train model, saves api/model.pkl
```

---

## Deploy to Vercel

1. Push to GitHub (this repo)
2. Import project in [Vercel](https://vercel.com)
3. **Root Directory:** `/` (project root)
4. **Framework:** Vite (auto-detected)
5. Deploy — Vercel automatically handles both the React frontend and Python serverless functions in `api/`

The existing `vercel.json` handles SPA routing automatically.

---

## Demo Credentials

| Field | Value |
|---|---|
| Email | `farmer@agri.com` |
| Password | `demo` |

---

## Data Sources

- APMC mandi historical records 2019–2020 (government open data)
- Live market anchoring via KisanDeals / CommodityOnline pricing benchmarks (April 2026: Rs.950/Quintal, Pune)
- Macro event flags based on historical export ban records (RBI / NAFED reports)

---

## License

MIT
