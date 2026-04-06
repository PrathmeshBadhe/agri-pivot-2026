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

// Fallback Mock Generator for other crops where model is not trained yet
const generateData = (basePrice: number, volatility: number) => {
    const today = new Date();
    const data: PredictionPoint[] = [];

    // 30 days history
    for (let i = 30; i > 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const p = basePrice + Math.random() * volatility * 2 - volatility;
        data.push({
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: p,
            price_premium: p * 1.35,
            price_a_grade: p * 1.15,
            type: 'history'
        });
    }

    // 14 days forecast
    let lastPrice = data[data.length - 1].price;
    for (let i = 1; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const trend = Math.random() > 0.4 ? 1 : -1;
        lastPrice = lastPrice + (Math.random() * volatility * 1.5 * trend);

        data.push({
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: lastPrice,
            price_premium: lastPrice * 1.35,
            price_a_grade: lastPrice * 1.15,
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
        let isMounted = true;
        setIsLoading(true);

        const fetchData = async () => {
            try {
                // Determine styling and theoretical signal based on crop types initially
                let themeColor = '#059669'; 
                let computedSignal: 'buy' | 'sell' | 'hold' = 'hold';

                switch (cropId.toLowerCase()) {
                    case 'tomato':
                        themeColor = '#dc2626'; 
                        computedSignal = 'sell';
                        break;
                    case 'potato':
                        themeColor = '#d97706'; 
                        computedSignal = 'buy';
                        break;
                    case 'soybean':
                        themeColor = '#d97706';
                        computedSignal = 'hold';
                        break;
                    default: // Onion
                        themeColor = '#059669';
                        computedSignal = 'sell';
                        break;
                }

                if(isMounted) {
                    setColor(themeColor);
                    setSignal(computedSignal);
                }

                // Actually fetch data from Vercel / serverless backend
                const response = await fetch(`/api/predict?commodity=${cropId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const apiData = await response.json();
                
                // Format dates to '10 Apr' for Recharts UI
                const formattedData = apiData.map((d: any) => {
                    const parsedDate = new Date(d.date);
                    return {
                        ...d,
                        date: parsedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    };
                });

                if (isMounted) {
                    setData(formattedData);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Failed fetching model prediction, using fallback mock", error);
                // Fallback config specific to this repo's earlier mock logic 
                let fallbackData = [];
                if (cropId.toLowerCase() === 'tomato') {
                    fallbackData = generateData(3200, 300);
                } else if (cropId.toLowerCase() === 'potato') {
                    fallbackData = generateData(1800, 50);
                } else if (cropId.toLowerCase() === 'soybean') {
                    fallbackData = generateData(4500, 150);
                } else {
                    fallbackData = generateData(2400, 100);
                }

                if (isMounted) {
                    setData(fallbackData);
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [cropId]);

    return { data, isLoading, signal, color };
};
