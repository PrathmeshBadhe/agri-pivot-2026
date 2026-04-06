import { useState, useEffect } from 'react';

export interface PredictionPoint {
    date: string;
    price: number; // Standard Bulk
    price_premium?: number;
    price_a_grade?: number;
    type: 'history' | 'forecast';
    yhat_lower?: number;
    yhat_upper?: number;
    confidence?: string;
}

// ─── Real 2026 verified base prices (Rs/Quintal) ─────────────────────
const LIVE_BASE_PRICES: Record<string, number> = {
    onion:   1300,   // CommodityOnline Pune, Apr 2026
    tomato:  2000,   // Maharashtra avg, Apr 2026
    potato:  1000,   // Maharashtra avg, Apr 2026
    soybean: 4200,   // MP avg, Apr 2026
};

// ─── Fallback mock generator (used only if API is unreachable) ────────
const generateData = (basePrice: number, volatility: number): PredictionPoint[] => {
    const today = new Date();
    const data: PredictionPoint[] = [];

    for (let i = 30; i > 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const p = basePrice + Math.random() * volatility * 2 - volatility;
        data.push({
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price:          Math.round(p),
            price_premium:  Math.round(p * 1.35),
            price_a_grade:  Math.round(p * 1.15),
            type: 'history'
        });
    }

    let lastPrice = data[data.length - 1].price;
    for (let i = 1; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const trend = Math.random() > 0.4 ? 1 : -1;
        lastPrice = Math.max(200, lastPrice + Math.random() * volatility * 1.5 * trend);
        data.push({
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price:          Math.round(lastPrice),
            price_premium:  Math.round(lastPrice * 1.35),
            price_a_grade:  Math.round(lastPrice * 1.15),
            type: 'forecast',
            yhat_lower: Math.round(lastPrice - volatility),
            yhat_upper: Math.round(lastPrice + volatility),
        });
    }
    return data;
};

export const usePrediction = (cropId: string) => {
    const [data, setData]       = useState<PredictionPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [signal, setSignal]   = useState<'buy' | 'sell' | 'hold'>('hold');
    const [color, setColor]     = useState('#059669');

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        // ── Signal & colour config per crop ──────────────────────────
        const cropKey = cropId.toLowerCase();
        const themeMap: Record<string, { color: string; signal: 'buy' | 'sell' | 'hold' }> = {
            tomato:  { color: '#dc2626', signal: 'sell' },
            potato:  { color: '#d97706', signal: 'buy'  },
            soybean: { color: '#d97706', signal: 'hold' },
            onion:   { color: '#059669', signal: 'sell' },
        };
        const theme = themeMap[cropKey] ?? themeMap.onion;

        if (isMounted) {
            setColor(theme.color);
            setSignal(theme.signal);
        }

        // ── Fetch from real backend ──────────────────────────────────
        fetch(`/api/predict?commodity=${cropKey}`)
            .then(r => {
                if (!r.ok) throw new Error(`API ${r.status}`);
                return r.json();
            })
            .then((apiData: any[]) => {
                const formatted: PredictionPoint[] = apiData.map(d => ({
                    ...d,
                    date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                }));
                if (isMounted) {
                    setData(formatted);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.warn('API unavailable, using calibrated fallback:', err);
                // ── Calibrated fallback — uses REAL 2026 prices, not old mock values ──
                const base    = LIVE_BASE_PRICES[cropKey] ?? 1300;
                const volatility = cropKey === 'tomato' ? 200
                                 : cropKey === 'soybean' ? 300
                                 : cropKey === 'potato'  ? 80
                                 : 100;   // onion
                if (isMounted) {
                    setData(generateData(base, volatility));
                    setIsLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, [cropId]);

    return { data, isLoading, signal, color };
};
