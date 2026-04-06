import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import xml.etree.ElementTree as et

# ─────────────────────────────────────────────
# Domain knowledge constants
# ─────────────────────────────────────────────
ONION_PRODUCING_STATES = [
    "Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat", "Rajasthan",
    "Andhra Pradesh", "Haryana", "West Bengal", "Uttar Pradesh",
    "Chattisgarh", "Jharkhand", "Telangana"
]
NON_HARVEST_MONTHS = [6, 7, 8]
DROUGHT_STATES = [
    "Maharashtra", "Karnataka", "Andhra Pradesh", "Uttar Pradesh",
    "Kerala", "Rajasthan", "Madhya Pradesh", "Uttrakhand"
]

# ─────────────────────────────────────────────
# Macro Shock Parameters
# These simulate real-world events that affect market price.
# ─────────────────────────────────────────────
def apply_macro_factors(df: pd.DataFrame) -> pd.DataFrame:
    """
    Adds macro/external columns per row:
      - weather_shock: monsoon failure can spike onion prices ~30-40%
      - tariff_factor: export ban / import tariff reduces or inflates wholesale
      - war_supply_disruption: global supply chain pressure factor
    All values are 0 (neutral) or 1 (active) flags that the tree model learns.
    """
    # ── Weather Shock: historically heavy rain / drought in June–September
    df['weather_shock'] = ((df['Month'] >= 6) & (df['Month'] <= 9) & 
                            df['State'].isin(DROUGHT_STATES)).astype(int)

    # ── Tariff/Export Ban: India periodically bans onion exports
    # Any year India implemented an onion export ban or MEP (Minimum Export Price)
    # 2019 (ban), 2023 (ban), early 2024 (ban lifted) — Mark those periods
    def tariff_flag(row):
        y, m = row['Year'], row['Month']
        # Sep 2019 – Mar 2020: export ban
        if (y == 2019 and m >= 9) or (y == 2020 and m <= 3): return 1
        # Sep 2023 – Mar 2024: export ban
        if (y == 2023 and m >= 9) or (y == 2024 and m <= 3): return 1
        # Apr 2025: India US tariff war tensions raised import costs
        if y == 2025 and 3 <= m <= 8: return 1
        return 0

    df['tariff_active'] = df.apply(tariff_flag, axis=1)

    # ── War / Global Disruption: Ukraine war (2022–2024) hit fuel & fertilizer costs
    df['war_supply_disruption'] = ((df['Year'] >= 2022) & (df['Year'] <= 2024)).astype(int)

    return df

# ─────────────────────────────────────────────
# Data Loading
# ─────────────────────────────────────────────
def load_data():
    base_dir = "ml_data"
    data_frames = []

    csv_19 = os.path.join(base_dir, "Onion_2019.csv")
    if os.path.exists(csv_19):
        df = pd.read_csv(csv_19)
        df = df.rename(columns={
            'state': 'State', 'district': 'District', 'market': 'Market',
            'commodity': 'Commodity', 'variety': 'Variety', 'arrival_date': 'Arrival_Date',
            'modal_price': 'Modal_Price'
        })
        data_frames.append(df)

    csv_20 = os.path.join(base_dir, "Onion Prices 2020.csv")
    if os.path.exists(csv_20):
        df = pd.read_csv(csv_20)
        df = df.rename(columns={
            'state': 'State', 'district': 'District', 'market': 'Market',
            'commodity': 'Commodity', 'variety': 'Variety', 'arrival_date': 'Arrival_Date',
            'modal_price': 'Modal_Price'
        })
        data_frames.append(df)

    csv_live = os.path.join(base_dir, "Live_Scraped_Prices.csv")
    if os.path.exists(csv_live):
        df = pd.read_csv(csv_live)
        print(f"  [OK] Live bridge data found: {len(df)} rows -> injecting 2024-2026 market anchors")
        data_frames.append(df)

    if not data_frames:
        raise ValueError("No data found in ml_data/. Run ml/fetch_live_data.py first.")

    data = pd.concat(data_frames, ignore_index=True)

    # Normalise column names case-insensitively
    for needed in ['State', 'Market', 'Arrival_Date', 'Modal_Price']:
        if needed not in data.columns:
            for col in data.columns:
                if col.strip().lower() == needed.lower():
                    data.rename(columns={col: needed}, inplace=True)

    return data[['State', 'Market', 'Arrival_Date', 'Modal_Price']].dropna()

# ─────────────────────────────────────────────
# Feature Engineering
# ─────────────────────────────────────────────
def feature_engineering(data: pd.DataFrame) -> pd.DataFrame:
    print("Engineering features...")
    data['Arrival_Date'] = pd.to_datetime(data['Arrival_Date'], errors='coerce', dayfirst=True)
    data = data.dropna(subset=['Arrival_Date'])

    data['Month']      = data['Arrival_Date'].dt.month
    data['Year']       = data['Arrival_Date'].dt.year
    data['DayOfWeek']  = data['Arrival_Date'].dt.dayofweek
    data['DayOfYear']  = data['Arrival_Date'].dt.dayofyear

    data['Producing']      = data['State'].isin(ONION_PRODUCING_STATES).astype(int)
    data['Harvest_Season'] = (~data['Month'].isin(NON_HARVEST_MONTHS)).astype(int)
    data['Drought_Risk']   = data['State'].isin(DROUGHT_STATES).astype(int)

    # Macro external factors
    data = apply_macro_factors(data)

    data['Modal_Price'] = pd.to_numeric(data['Modal_Price'], errors='coerce')
    return data.dropna(subset=['Modal_Price'])

# ─────────────────────────────────────────────
# Train
# ─────────────────────────────────────────────
FEATURES = [
    'State_Encoded', 'Market_Encoded',
    'Month', 'Year', 'DayOfWeek', 'DayOfYear',
    'Producing', 'Harvest_Season', 'Drought_Risk',
    # Macro factors
    'weather_shock', 'tariff_active', 'war_supply_disruption',
]
TARGET = 'Modal_Price'


def train():
    print("\n" + "="*40)
    print("  Agri-Pivot Advanced ML Training")
    print("="*40)

    df = load_data()
    df = feature_engineering(df)
    print(f"  Total rows after preprocessing: {len(df):,}")

    le_state  = LabelEncoder()
    le_market = LabelEncoder()
    df['State_Encoded']  = le_state.fit_transform(df['State'])
    df['Market_Encoded'] = le_market.fit_transform(df['Market'])

    X = df[FEATURES]
    y = df[TARGET]

    if len(X) > 200_000:
        print("  Subsampling to 200,000 rows for training speed...")
        X, _, y, _ = train_test_split(X, y, train_size=200_000, random_state=42)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("\n  Training RandomForestRegressor with Macro Factors...")
    model = RandomForestRegressor(
        n_estimators=50,
        max_depth=12,
        min_samples_split=8,
        n_jobs=-1,
        random_state=42
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse   = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2     = float(r2_score(y_test, y_pred))

    print("\n" + "-"*40)
    print("  Model Evaluation")
    print("-"*40)
    print(f"  RMSE      : Rs.{rmse:.2f}/Quintal  (~Rs.{rmse/100:.2f}/Kg)")
    print(f"  R2 Score  : {r2:.4f}  ({r2*100:.1f}% variance explained)")
    print("-"*40)

    os.makedirs("api", exist_ok=True)
    payload = {
        'model':    model,
        'le_state': le_state,
        'le_market':le_market,
        'features': FEATURES,
        'metrics':  {'rmse': rmse, 'r2': r2}
    }
    joblib.dump(payload, "api/model.pkl")
    print("\n  Saved model + metrics -> api/model.pkl")
    print("="*40 + "\n")


if __name__ == "__main__":
    train()
