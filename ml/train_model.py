import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import xml.etree.ElementTree as et

def load_data():
    base_dir = "ml_data"
    data_frames = []
    
    # Check for 2019 CSV
    csv_19 = os.path.join(base_dir, "Onion_2019.csv")
    if os.path.exists(csv_19):
        df_19 = pd.read_csv(csv_19)
        # Rename columns if needed
        # 2019 has state,district,market,commodity,variety,arrival_date,min_price,max_price,modal_price
        if 'modal_price' in df_19.columns:
            df_19 = df_19.rename(columns={
                'state': 'State', 'district': 'District', 'market': 'Market', 
                'commodity': 'Commodity', 'variety': 'Variety', 'arrival_date': 'Arrival_Date', 
                'modal_price': 'Modal_Price'
            })
        data_frames.append(df_19)
        
    # Check for 2020 CSV
    csv_20 = os.path.join(base_dir, "Onion Prices 2020.csv")
    if os.path.exists(csv_20):
        df_20 = pd.read_csv(csv_20)
        # Assuming same format
        if 'modal_price' in df_20.columns:
            df_20 = df_20.rename(columns={
                'state': 'State', 'district': 'District', 'market': 'Market', 
                'commodity': 'Commodity', 'variety': 'Variety', 'arrival_date': 'Arrival_Date', 
                'modal_price': 'Modal_Price'
            })
        data_frames.append(df_20)

    if not data_frames:
        raise ValueError("No data found in ml_data directory.")

    # Combine
    data = pd.concat(data_frames, ignore_index=True)
    
    # We only care about necessary columns
    cols_to_keep = ['State', 'Market', 'Arrival_Date', 'Modal_Price']
    for c in cols_to_keep:
        if c not in data.columns:
            # try finding matching column case-insensitively
            for actual_col in data.columns:
                if actual_col.lower() == c.lower():
                    data.rename(columns={actual_col: c}, inplace=True)
                    
    data = data[cols_to_keep].dropna()
    return data

def feature_engineering(data):
    # Parse Date string to datetime
    print("Engineering features...")
    # Dates can be DD/MM/YYYY or YYYY-MM-DD
    data['Arrival_Date'] = pd.to_datetime(data['Arrival_Date'], errors='coerce', dayfirst=True)
    data = data.dropna(subset=['Arrival_Date'])
    
    data['Month'] = data['Arrival_Date'].dt.month
    data['Year'] = data['Arrival_Date'].dt.year
    data['DayOfWeek'] = data['Arrival_Date'].dt.dayofweek
    data['DayOfYear'] = data['Arrival_Date'].dt.dayofyear
    
    # Feature logic based on notebook
    onion_producing_states=["Maharashtra", "Madhya Pradesh", "Karnataka", "Gujarat", "Rajasthan", "Andhra Pradesh", "Haryana", "West Bengal", "Uttar Pradesh", "Chattisgarh", "Jharkhand","Telangana"]
    onion_non_harv_months=[6, 7, 8]
    # Simple Drought definition based on previous
    drought_states=["Maharashtra","Karnataka","Andhra Pradesh","Uttar Pradesh","Kerala","Rajasthan","Madhya Pradesh","Uttrakhand"]
    
    data['Producing'] = data['State'].apply(lambda x: 1 if x in onion_producing_states else 0)
    data['Harvest_Season'] = data['Month'].apply(lambda x: 0 if x in onion_non_harv_months else 1)
    data['Drought_Risk'] = data['State'].apply(lambda x: 1 if x in drought_states else 0)
    
    # Price
    # Ensure Modal_Price is numeric
    data['Modal_Price'] = pd.to_numeric(data['Modal_Price'], errors='coerce')
    data = data.dropna(subset=['Modal_Price'])
    # Convert per Quintal (100kg)
    data['Price_Per_Quintal'] = data['Modal_Price']
    return data

def train():
    try:
        df = load_data()
        df = feature_engineering(df)
    except Exception as e:
        print("Data Loading Error:", e)
        return

    print(f"Dataset Size: {len(df)} rows")
    
    # Encode categorical
    le_state = LabelEncoder()
    df['State_Encoded'] = le_state.fit_transform(df['State'])
    
    # Market cardinality might be high, using Label Encoding for simplicity in trees
    le_market = LabelEncoder()
    df['Market_Encoded'] = le_market.fit_transform(df['Market'])

    # Features
    features = ['State_Encoded', 'Market_Encoded', 'Month', 'Year', 'DayOfWeek', 'DayOfYear', 'Producing', 'Harvest_Season', 'Drought_Risk']
    target = 'Price_Per_Quintal'
    
    X = df[features]
    y = df[target]
    
    # Subsample if dataset is too massive for fast training
    if len(X) > 200000:
        print("Subsampling data for faster training iteration...")
        X, _, y, _ = train_test_split(X, y, train_size=200000, random_state=42)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=15, n_jobs=-1, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print("-" * 30)
    print("Evaluation Metrics:")
    print(f"RMSE: {rmse:.2f} Rs/Quintal (~{rmse/100:.2f} Rs/Kg error)")
    print(f"R2 (Accuracy Score): {r2:.4f}")
    print("-" * 30)
    
    # Save Model and Encoders
    os.makedirs("api", exist_ok=True)
    joblib.dump({
        'model': model,
        'le_state': le_state,
        'le_market': le_market,
        'features': features
    }, "api/model.pkl")
    print("Saved model to api/model.pkl")

if __name__ == "__main__":
    train()
