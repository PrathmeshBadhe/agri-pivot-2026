// Utility to seed data structure from Kaggle dataset
// This would run on the backend typically, but here provides Types for the CSV structure.

export interface MarketDataRow {
    date: string; // YYYY-MM-DD
    price: number;
    commodity: string;
    mandi: string;
}

export const parseCSV = (csvContent: string): MarketDataRow[] => {
    const lines = csvContent.split('\n');
    const data: MarketDataRow[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length < 4) continue;

        // Assumes simple CSV structure: Date, Price, Mandi, Commodity
        // In reality, use a CSV parser lib
        data.push({
            date: row[0],
            price: parseFloat(row[1]),
            mandi: row[2],
            commodity: row[3]
        });
    }
    return data;
};

export const SEED_DATA_TEMPLATE = `date,price,mandi,commodity
2026-02-01,2400,Pune,Onion
2026-02-02,2450,Pune,Onion`;
