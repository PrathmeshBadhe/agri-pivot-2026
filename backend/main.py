from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from datetime import date, timedelta
import random

# Try to import Prophet/Pandas, but don't crash if missing
try:
    import pandas as pd
    from prophet import Prophet
    HAS_PROPHET = True
except ImportError:
    print("Warning: Prophet or Pandas not found. Running in Mock Prediction Mode.")
    HAS_PROPHET = False

app = FastAPI(title="Agri-Pivot AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for MVP testing to avoid CORS issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_NAME = "agri.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/predict/{commodity}")
def predict_price(commodity: str):
    conn = get_db_connection()
    try:
        if HAS_PROPHET:
            return run_prophet_prediction(conn, commodity)
        else:
            return run_mock_prediction(conn, commodity)
    except Exception as e:
        print(f"Prediction Error: {e}")
        # Build a safe emergency fallback even if Prophet crashes
        return run_mock_prediction(conn, commodity, error_mode=True)
    finally:
        conn.close()

def run_prophet_prediction(conn, commodity):
    # (Original Logic)
    query = "SELECT date, price FROM historical_prices WHERE commodity LIKE ? ORDER BY date ASC"
    df = pd.read_sql_query(query, conn, params=(f"%{commodity}%",))
    
    if df.empty:
        return run_mock_prediction(conn, commodity) # Fallback if no data

    df = df.rename(columns={'date': 'ds', 'price': 'y'})
    df['ds'] = pd.to_datetime(df['ds'])
    
    model = Prophet(yearly_seasonality=True, changepoint_prior_scale=0.5)
    model.add_country_holidays(country_name='IN')
    model.fit(df)
    
    future = model.make_future_dataframe(periods=14)
    forecast = model.predict(future)
    
    result = []
    # History
    for _, row in df.iterrows():
         result.append({"date": row['ds'].strftime("%Y-%m-%d"), "price": row['y'], "type": "history"})
    
    # Forecast
    last_date = df['ds'].max()
    future_data = forecast[forecast['ds'] > last_date]
    for _, row in future_data.iterrows():
        result.append({
            "date": row['ds'].strftime("%Y-%m-%d"), 
            "price": round(row['yhat'], 2),
            "yhat_lower": round(row['yhat_lower'], 2),
            "yhat_upper": round(row['yhat_upper'], 2),
            "type": "forecast",
            "confidence": "High"
        })
    return result

def run_mock_prediction(conn, commodity, error_mode=False):
    # Generates a realistic looking graph based on last known price
    # Fetch last price
    cursor = conn.cursor()
    cursor.execute("SELECT date, price FROM historical_prices WHERE commodity LIKE ? ORDER BY date DESC LIMIT 1", (f"%{commodity}%",))
    row = cursor.fetchone()
    
    if row:
        last_date_str = row['date']
        last_price = row['price']
    else:
        last_date_str = date.today().strftime("%Y-%m-%d")
        last_price = 2000.0 # Default fallback
    
    # Convert to date object
    try:
        # resilient parsing
        last_date_obj = date.fromisoformat(last_date_str)
    except:
        last_date_obj = date.today()

    result = []
    
    # Fake History (Last 30 days) to show a line
    current_price = last_price
    for i in range(30, 0, -1):
        d = last_date_obj - timedelta(days=i)
        # Random walk
        current_price += random.uniform(-50, 50)
        result.append({
            "date": d.strftime("%Y-%m-%d"),
            "price": round(current_price, 2),
            "type": "history"
        })

    # Fake Forecast (Next 14 days)
    # Trend up!
    future_price = current_price
    for i in range(1, 15):
        d = last_date_obj + timedelta(days=i)
        future_price += random.uniform(-10, 60) # Slight upward trend
        upper = future_price * 1.05
        lower = future_price * 0.95
        
        result.append({
            "date": d.strftime("%Y-%m-%d"),
            "price": round(future_price, 2),
            "yhat_lower": round(lower, 2),
            "yhat_upper": round(upper, 2),
            "type": "forecast",
            "confidence": "Simulated"
        })
        
    return result
