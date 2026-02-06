import http.server
import socketserver
import json
import sqlite3
import random
from datetime import date, timedelta
import urllib.parse
import os

PORT = 8000
DB_NAME = "agri.db"

class AgriHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        # API Endpoint: /api/predict/{commodity}
        if parsed_path.path.startswith("/api/predict/"):
            commodity = parsed_path.path.split("/")[-1]
            try:
                data = self.mock_predict(commodity)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*') # CORS
                self.end_headers()
                self.wfile.write(json.dumps(data).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
            return
            
        # Default behavior (files)
        # We don't really want to serve files from root unless frontend is built there
        self.send_response(404)
        self.end_headers()

    def mock_predict(self, commodity):
        # Retrieve last price from DB if possible
        start_price = 2000.0
        last_date = date.today()
        
        try:
            if os.path.exists(DB_NAME):
                conn = sqlite3.connect(DB_NAME)
                cursor = conn.cursor()
                cursor.execute("SELECT price, date FROM historical_prices WHERE commodity LIKE ? ORDER BY date DESC LIMIT 1", (f"%{commodity}%",))
                row = cursor.fetchone()
                if row:
                    start_price = row[0]
                    # Try parse date
                    try:
                       # simplified parsing
                        pass 
                    except:
                        pass
                conn.close()
        except:
            pass

        result = []
        
        # History (30 days)
        curr = start_price
        for i in range(30, 0, -1):
            d = last_date - timedelta(days=i)
            curr += random.uniform(-50, 50)
            result.append({
                "date": d.strftime("%Y-%m-%d"),
                "price": round(curr, 2),
                "type": "history"
            })
            
        # Forecast (14 days)
        for i in range(1, 15):
            d = last_date + timedelta(days=i)
            curr += random.uniform(-10, 60)
            result.append({
                "date": d.strftime("%Y-%m-%d"),
                "price": round(curr, 2),
                "yhat_lower": round(curr * 0.9, 2),
                "yhat_upper": round(curr * 1.1, 2),
                "confidence": "High",
                "type": "forecast"
            })
            
        return result

    # Handle Preflight CORS
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        self.end_headers()

def run():
    print(f"Starting Zero-Dependency Server on port {PORT}...")
    with socketserver.TCPServer(("", PORT), AgriHandler) as httpd:
        print("Scaffolding Complete. Ctrl+C to stop.")
        httpd.serve_forever()

if __name__ == "__main__":
    run()
