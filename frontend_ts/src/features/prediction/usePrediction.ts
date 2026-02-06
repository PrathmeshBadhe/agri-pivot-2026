import { useState, useEffect } from 'react';

export interface PredictionPoint {
    date: string;
    price: number;
    type: 'history' | 'forecast';
    yhat_lower?: number;
    yhat_upper?: number;
}

// Mock Data Generators
const generateData = (basePrice: number, volatility: number) => {
    const today = new Date();
    const data: PredictionPoint[] = [];

    // 30 days history
    for (let i = 30; i > 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        data.push({
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: basePrice + Math.random() * volatility * 2 - volatility,
            type: 'history'
        });
    }

    // 14 days forecast
    let lastPrice = data[data.length - 1].price;
    for (let i = 1; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const trend = Math.random() > 0.4 ? 1 : -1; // Slight upward bias logic could be here
        lastPrice = lastPrice + (Math.random() * volatility * 1.5 * trend);

        data.push({
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: lastPrice,
            type: 'forecast',
            yhat_lower: lastPrice - volatility,
            yhat_upper: lastPrice + volatility
        });
    }
    return data;
};

export const usePrediction = (cropId: string) => {
    const [data, setData] = useState<PredictionPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [signal, setSignal] = useState<'buy' | 'sell' | 'hold'>('hold');
    const [color, setColor] = useState('#059669'); // Default Emerald

    useEffect(() => {
        setIsLoading(true);
        // Simulate API delay
        const timer = setTimeout(() => {
            let basePrice = 2400;
            let volatility = 100;
            let themeColor = '#059669'; // Emerald
            let computedSignal: 'buy' | 'sell' | 'hold' = 'hold';

            // Crop-specific configurations
            switch (cropId.toLowerCase()) {
                case 'tomato':
                    basePrice = 3200;
                    volatility = 300; // High volatility
                    themeColor = '#dc2626'; // Red
                    computedSignal = 'sell';
                    break;
                case 'potato':
                    basePrice = 1800;
                    volatility = 50; // Low volatility
                    themeColor = '#d97706'; // Amber/Gold
                    computedSignal = 'buy';
                    break;
                case 'soybean':
                    basePrice = 4500;
                    volatility = 150;
                    themeColor = '#d97706';
                    computedSignal = 'hold';
                    break;
                default: // Onion
                    basePrice = 2400;
                    volatility = 100;
                    themeColor = '#059669';
                    computedSignal = 'sell';
                    break;
            }

            setColor(themeColor);
            setSignal(computedSignal);
            setData(generateData(basePrice, volatility));
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [cropId]);

    return { data, isLoading, signal, color };
};
