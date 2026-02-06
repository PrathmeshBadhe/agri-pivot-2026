import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PredictionPoint } from './usePrediction';

interface ForecastChartProps {
    data: PredictionPoint[];
    isLoading: boolean;
    color?: string;
}

export const ForecastChart = ({ data, isLoading, color = '#059669' }: ForecastChartProps) => {
    if (isLoading) {
        return (
            <div className="h-96 w-full bg-slate-50 animate-pulse flex items-center justify-center">
                <div className="text-slate-400 text-sm">Loading AI Model...</div>
            </div>
        );
    }

    // Split data for separate rendering
    // 1. "priceHistory" field for history points (null for forecast)
    // 2. "priceForecast" field for forecast points (null for history)

    const chartData = data.map((point, idx) => {
        // Connect the last history point to the first forecast point
        const isTransition = idx > 0 && data[idx - 1].type === 'history' && point.type === 'forecast';

        return {
            ...point,
            priceHistory: point.type === 'history' || isTransition ? point.price : null,
            priceForecast: point.type === 'forecast' ? point.price : null,
            // Create a range for confidence interval (yhat_upper - yhat_lower)
            range: point.yhat_upper && point.yhat_lower ? [point.yhat_lower, point.yhat_upper] : null
        };
    });

    return (
        <div className="w-full h-[350px] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Price Forecast</h3>
                    <p className="text-2xl font-bold text-slate-900">Onion (Pune)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>History</span>
                    <span className="flex items-center text-indigo-600"><span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>AI Prediction</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.1} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `₹${value} `} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: color, fontWeight: 'bold' }}
                    />

                    {/* Confidence Interval (The Range) */}
                    <Area
                        type="monotone"
                        dataKey="range"
                        stroke="none"
                        fill={color}
                        fillOpacity={0.1}
                        name="Confidence Interval"
                        connectNulls
                    />
                    {/* History Line (Solid) */}
                    <Area
                        type="monotone"
                        dataKey="priceHistory"
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        name="Historical Price"
                        connectNulls
                    />

                    {/* Forecast Line (Dotted) */}
                    <Area
                        type="monotone"
                        dataKey="priceForecast"
                        stroke={color}
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fill="none"
                        name="AI Forecast"
                        connectNulls
                        dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
