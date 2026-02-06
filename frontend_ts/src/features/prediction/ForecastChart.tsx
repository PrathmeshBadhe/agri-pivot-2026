import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PredictionPoint } from './usePrediction';

interface ForecastChartProps {
    data: PredictionPoint[];
    isLoading: boolean;
}

export const ForecastChart = ({ data, isLoading }: ForecastChartProps) => {
    if (isLoading) return <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl"></div>;

    // Split data for separate rendering if needed, but Recharts Area can handle it if structured right.
    // Actually, to get Solid vs Dotted line, we usually need multiple Areas or a gradients/strokeDasharray trick.
    // Easiest "Pro" way:
    // 1. Full Line (History)
    // 2. Full Line (Forecast) - but filtered
    // 3. Area (Confidence) - only on Forecast points

    // Transform data for Recharts optimized consumption
    const chartData = data.map(pt => ({
        ...pt,
        // Separate fields based on type allows different styling in same chart
        priceHistory: pt.type === 'history' ? pt.price : null,
        // Connect the last history point to first forecast point? 
        // Usually we need overlapping point. 
        // For simplicity, let's just match them.
        priceForecast: pt.type === 'forecast' ? pt.price : null,
        // Add nulls to history for range area so it doesn't draw at 0
        range: pt.type === 'forecast' ? [pt.yhat_lower, pt.yhat_upper] : null
    }));

    // Hack: Bridge the gap between history and forecast visually
    // Find last history index
    const lastHistoryIndex = chartData.findLastIndex(d => d.type === 'history');
    if (lastHistoryIndex >= 0 && lastHistoryIndex < chartData.length - 1) {
        chartData[lastHistoryIndex].priceForecast = chartData[lastHistoryIndex].priceHistory; // Connect lines
        // chartData[lastHistoryIndex].range = [chartData[lastHistoryIndex].priceHistory, chartData[lastHistoryIndex].priceHistory]; // Start range?
    }

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
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
                    />

                    {/* Confidence Interval (The Range) */}
                    <Area
                        type="monotone"
                        dataKey="range"
                        stroke="none"
                        fill="url(#colorConfidence)"
                        connectNulls
                    />

                    {/* History Line (Solid) */}
                    <Area
                        type="monotone"
                        dataKey="priceHistory"
                        stroke="#059669"
                        strokeWidth={3}
                        fill="transparent"
                        connectNulls
                    />

                    {/* Forecast Line (Dotted) */}
                    <Area
                        type="monotone"
                        dataKey="priceForecast"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        fill="transparent"
                        connectNulls
                        dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
