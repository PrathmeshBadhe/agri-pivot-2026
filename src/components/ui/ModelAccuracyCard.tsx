import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity } from 'lucide-react';

interface Metrics {
    r2: number;
    rmse: number;
    accuracy_pct: number;
    features: string[];
}

const FALLBACK: Metrics = {
    r2: 0.8154,
    rmse: 536.81,
    accuracy_pct: 81.5,
    features: [
        'State', 'Market', 'Month', 'Year',
        'Producing State', 'Harvest Season',
        'Drought Risk', 'Weather Shock', 'Tariff Active', 'War Disruption'
    ]
};

export const ModelAccuracyCard = () => {
    const [metrics, setMetrics] = useState<Metrics>(FALLBACK);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/metrics')
            .then(r => r.json())
            .then(d => { setMetrics(d); setLoading(false); })
            .catch(() => { setMetrics(FALLBACK); setLoading(false); });
    }, []);

    const accuracy = metrics.accuracy_pct;
    const arcColor = accuracy >= 80 ? '#10b981' : accuracy >= 65 ? '#f59e0b' : '#ef4444';

    // SVG semi-circle gauge params
    const r = 52, cx = 80, cy = 70;
    const circumference = Math.PI * r;          // half-circle arc length
    const filled = circumference * (accuracy / 100);
    const gap    = circumference - filled;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-3xl"
        >
            <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    AI Model Accuracy
                </h3>
            </div>

            {/* Gauge */}
            <div className="flex flex-col items-center mb-4">
                <svg width="160" height="90" overflow="visible">
                    {/* Track */}
                    <path
                        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round"
                    />
                    {/* Filled arc */}
                    <path
                        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none"
                        stroke={arcColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${filled} ${gap}`}
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                    {/* Label */}
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#0f172a">
                        {loading ? '...' : `${accuracy.toFixed(1)}%`}
                    </text>
                    <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#64748b">
                        R² Score
                    </text>
                </svg>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-2xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs text-slate-500 font-medium">Avg Error</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">
                        {loading ? '...' : `Rs.${(metrics.rmse / 100).toFixed(1)}/Kg`}
                    </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-xs text-slate-500 font-medium">Inputs</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800">{metrics.features.length}</p>
                </div>
            </div>

            {/* Feature tags */}
            <div>
                <p className="text-xs text-slate-400 mb-2 font-semibold uppercase">Model Factors</p>
                <div className="flex flex-wrap gap-1.5">
                    {metrics.features.map(f => (
                        <span
                            key={f}
                            className="text-[10px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100"
                        >
                            {f}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
