# Agri Pivot AI - Core Technical Summary

### 💻 Frontend
- **Framework**: React 19 (TypeScript) + Vite
- **UI/UX**: Tailwind CSS (Glassmorphic design), Framer Motion (Animations)
- **Data Viz**: Recharts (Price trends & forecasts)
- **State**: Zustand

### ⚙️ Backend
- **Environment**: Python (Flask)
- **Deployment**: Vercel Serverless Functions
- **API**: RESTful end-points for price prediction and accuracy metrics

### 🧠 Model
- **Algorithm**: `RandomForestRegressor` (Scikit-learn)
- **Features**: State/Market encoding, Seasonality, Weather Shocks, Export Tariffs, and Global Supply Disruption flags.
- **Logic**: Hybrid blending (45% weight on live market anchors for real-time accuracy).

### 📊 Data
- **Sources**: CSV datasets (2019-2020), Live Bridge Data (2024-2026 scraped prices).
- **Processing**: Feature engineering for harvest cycles, drought risks, and producing state status.
- **Storage**: Serialized payloads (`model.pkl`) containing the model, encoders, and performance metrics.
