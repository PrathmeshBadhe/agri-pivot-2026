import { useState, useEffect } from 'react';


export interface PredictionPoint {
    date: string;
    price: number;
    yhat_lower?: number;
    yhat_upper?: number;
    type: 'history' | 'forecast';
}

export const usePrediction = (commodity: string) => {
    const [data, setData] = useState<PredictionPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [signal, setSignal] = useState<'buy' | 'sell' | 'hold'>('hold');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            // Simulate API latency
            await new Promise(resolve => setTimeout(resolve, 600));

            // Robust Mock Data conforming to the Recharts structure requested
            const mockData: PredictionPoint[] = [
                // History (Solid Line)
                { date: '2-01', price: 2400, type: 'history' },
                { date: '2-02', price: 2420, type: 'history' },
                { date: '2-03', price: 2380, type: 'history' },
                { date: '2-04', price: 2450, type: 'history' },
                { date: '2-05', price: 2480, type: 'history' },
                { date: '2-06', price: 2500, type: 'history' },
                // Forecast (Dotted Line + Confidence)
                { date: '2-07', price: 2550, yhat_lower: 2500, yhat_upper: 2600, type: 'forecast' },
                { date: '2-08', price: 2600, yhat_lower: 2540, yhat_upper: 2660, type: 'forecast' },
                { date: '2-09', price: 2650, yhat_lower: 2580, yhat_upper: 2720, type: 'forecast' },
                { date: '2-10', price: 2700, yhat_lower: 2600, yhat_upper: 2800, type: 'forecast' },
                { date: '2-11', price: 2680, yhat_lower: 2550, yhat_upper: 2810, type: 'forecast' },
                { date: '2-12', price: 2720, yhat_lower: 2600, yhat_upper: 2840, type: 'forecast' },
            ];

            setData(mockData);
            setSignal('sell'); // Strong uptrend -> Sell Signal
            setIsLoading(false);
        };

        loadData();
    }, [commodity]);

    return { data, isLoading, signal };
};
