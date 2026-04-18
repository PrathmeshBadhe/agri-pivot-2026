# Agri Pivot AI - Technical Documentation

Agri Pivot AI is a sophisticated agricultural tech platform designed to provide farmers and traders with high-precision price forecasts and market insights. It combines modern web technologies with machine learning to deliver actionable data.

## 🚀 Technology Stack

### Frontend (User Interface)
- **Core**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (with customized glassmorphic theme)
- **Animations**: Framer Motion (for smooth transitions and micro-interactions)
- **Charts**: Recharts (for price trend visualization)
- **State Management**: Zustand (lightweight and performant state)
- **Navigation**: React Router DOM v7
- **Icons**: Lucide React

### Backend (API & Logic)
- **Framework**: Flask (Python 3.x)
- **Middleware**: Flask-CORS for cross-origin resource sharing
- **Deployment**: Configured for Vercel Serverless Functions
- **Data Handling**: Pandas & NumPy for data manipulation

### Machine Learning (Intelligence)
- **Engine**: Scikit-learn (Random Forest / Gradient Boosting typical for this structure)
- **Serialization**: Joblib (for saving/loading trained models)
- **Features**: 
  - Seasonal decomposition (Month, Day of Year)
  - Geographic analysis (State, Market encoding)
  - Macro-impact flags (Weather shock, Tariff changes, Global supply disruptions)
- **Predictive Depth**: 14-day forward-looking forecast
- **Calibration**: A hybrid "Live Anchor" blending system (45% weight on real-world verified prices to ensure accuracy).

## 📁 Project Structure

```bash
Agri Pivot AI/
├── api/                # Flask backend (Vercel Serverless)
│   ├── index.py        # Main API entry point & prediction logic
│   └── model.pkl       # Serialized ML model and encoders
├── src/                # React frontend source
│   ├── components/     # UI components (BottomNav, Charts, etc.)
│   ├── store/          # Zustand state definitions
│   └── App.tsx         # Main application coordinator
├── ml/                 # Machine Learning pipeline
│   ├── train_model.py  # Script to train and calibrate the model
│   └── fetch_live_data.py # Script to update live market anchors
├── ml_data/            # Datasets used for training
├── vercel.json         # Deployment configuration for Vercel
├── package.json        # Frontend dependencies and scripts
└── tailwind.config.js  # Design system tokens and styling rules
```

## 🛠️ Key Features & Capabilities

1.  **Price Prediction**: Real-time forecasting for major commodities (Onion, Tomato, Potato, Soybean).
2.  **Market Confidence**: Provides upper/lower bound confidence intervals (yhat_upper/lower).
3.  **Macro Insights**: Identifies if prices are driven by weather events or trade policies.
4.  **Premium Aesthetics**: High-contrast, glassmorphic UI designed for mobile-first accessibility.
5.  **Multi-Grade Pricing**: Estimates for "Premium" and "A-Grade" quality levels.

## 📦 Deployment & Verification

- **Production**: Vercel (Frontend & Serverless Backend)
- **Local Dev**: `npm run dev` for frontend; `python api/index.py` for backend.
- **Model Training**: Can be refreshed by running `python ml/train_model.py`.

---
*Last Updated: April 2026*
