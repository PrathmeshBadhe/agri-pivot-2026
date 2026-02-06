import sqlite3
import csv
import os
import datetime

# Configuration
DB_NAME = "agri.db"
CSV_FILE = "onion_master_data.csv"
SAMPLE_CSV_FILE = "sample_onion_data.csv"

def get_data_file():
    if os.path.exists(CSV_FILE):
        return CSV_FILE
    elif os.path.exists(SAMPLE_CSV_FILE):
        print(f"Using sample dataset: {SAMPLE_CSV_FILE}")
        return SAMPLE_CSV_FILE
    return None

def seed_database():
    csv_path = get_data_file()
    if not csv_path:
        print("No CSV file found.")
        return

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS historical_prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE,
        mandi TEXT,
        commodity TEXT,
        price FLOAT,
        transport_cost FLOAT DEFAULT 0.0
    )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_date ON historical_prices (date)")

    rows_to_insert = []
    
    # Mapping logic for standard CSV vs Sample
    # Sample has: Price Date,Modal Price,Market,Commodity,State
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            # Normalize headers (strip spaces)
            reader.fieldnames = [name.strip() for name in reader.fieldnames]
            
            for row in reader:
                # Handle flexible column names
                date_str = row.get('Price Date') or row.get('Date') or row.get('date')
                price_str = row.get('Modal Price') or row.get('Price') or row.get('price')
                mandi = row.get('Market') or row.get('Mandi') or row.get('mandi') or row.get('State') # Fallback
                commodity = row.get('Commodity') or row.get('commodity')
                
                if not (date_str and price_str and commodity):
                    continue

                # Parse Price
                try:
                    price = float(price_str)
                except:
                    continue

                # Parse Date (Assuming YYYY-MM-DD for now, or use datetime)
                # If date is DD-MM-YYYY or something else, this might fail or store raw.
                # Let's try to normalize to YYYY-MM-DD if possible, or just store string.
                # For sorting we need comparable strings.
                formatted_date = date_str
                try:
                    # quick attempt to parse standard formats
                    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
                        try:
                            dt = datetime.datetime.strptime(date_str, fmt)
                            formatted_date = dt.strftime("%Y-%m-%d")
                            break
                        except ValueError:
                            pass
                except:
                    pass

                rows_to_insert.append((formatted_date, mandi, commodity, price, 0.0))

        if rows_to_insert:
            print(f"Inserting {len(rows_to_insert)} rows...")
            cursor.executemany("INSERT INTO historical_prices (date, mandi, commodity, price, transport_cost) VALUES (?, ?, ?, ?, ?)", rows_to_insert)
            conn.commit()
            print("Seeding complete.")
        else:
            print("No valid rows found to insert.")

    except Exception as e:
        print(f"Error seeding: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_database()
