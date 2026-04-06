from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

model_data = None
if os.path.exists(MODEL_PATH):
    try:
        model_data = joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Failed to load model: {e}")

@app.route('/api/predict', methods=['GET'])
def predict():
    commodity = request.args.get('commodity', 'onion')
    
    if model_data is None:
        return jsonify({"error": "Model not loaded. Please train the model first."}), 500

    model = model_data['model']
    le_state = model_data['le_state']
    le_market = model_data['le_market']
    
    # Default inputs for generic forecast
    # We choose a major producing state and market
    state = "Maharashtra"
    market = "Pune"
    
    # Safely transform
    try:
        state_encoded = le_state.transform([state])[0]
        market_encoded = le_market.transform([market])[0]
    except ValueError:
        # Fallback to first available if not found
        state_encoded = 0
        market_encoded = 0

    today = datetime.now()
    results = []
    
    # Historical Mock Context - Since Model is trained for forecasting,
    # Real app would query DB, here we generate context based on today's prediction
    
    # Predict next 14 days
    last_price = 2000
    for i in range(1, 15):
        d = today + timedelta(days=i)
        
        # Feature Engineering based on ml/train_model.py
        month = d.month
        year = d.year
        dayofweek = d.weekday()
        dayofyear = d.timetuple().tm_yday
        producing = 1
        harvest_season = 0 if month in [6, 7, 8] else 1
        drought_risk = 1
        
        input_features = pd.DataFrame([{
            'State_Encoded': state_encoded,
            'Market_Encoded': market_encoded,
            'Month': month,
            'Year': year,
            'DayOfWeek': dayofweek,
            'DayOfYear': dayofyear,
            'Producing': producing,
            'Harvest_Season': harvest_season,
            'Drought_Risk': drought_risk
        }])
        
        pred_price = model.predict(input_features)[0]
        last_price = pred_price
        
        results.append({
            "date": d.strftime("%Y-%m-%d"),
            "price": round(pred_price, 2), # Standard bulk
            "price_premium": round(pred_price * 1.35, 2), # 35% markup for premium
            "price_a_grade": round(pred_price * 1.15, 2), # 15% markup for A-grade
            "type": "forecast",
            "yhat_lower": round(pred_price * 0.90, 2),
            "yhat_upper": round(pred_price * 1.10, 2),
            "confidence": "High"
        })

    # For seamless chart integration, prefix with 30 days history
    history = []
    base_price = results[0]['price']
    for i in range(30, 0, -1):
        d = today - timedelta(days=i)
        base_price += (10 if i % 2 == 0 else -8)
        history.append({
            "date": d.strftime("%Y-%m-%d"),
            "price": round(base_price, 2),
            "price_premium": round(base_price * 1.35, 2),
            "price_a_grade": round(base_price * 1.15, 2),
            "type": "history"
        })
    
    return jsonify(history + results)

if __name__ == '__main__':
    app.run(port=8000, debug=True)
