import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Truck, Calculator, ChevronLeft, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateReturns, type CalculationResult } from './calculatorEngine';

interface HistoryItem {
    id: number;
    crop: string;
    qty: number;
    net: number;
    date: string;
}

export const CalculatorPage = () => {
    // Inputs
    const [price, setPrice] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [distance, setDistance] = useState<number | ''>('');
    const [unit, setUnit] = useState<'kg' | 'quintal'>('kg');
    const [selectedVehicle, setSelectedVehicle] = useState<'tractor' | 'pickup' | 'truck' | null>(null);

    // Engine State
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Animation Springs
    const animatedRevenue = useSpring(0, { stiffness: 100, damping: 20 });
    const animatedExpenses = useSpring(0, { stiffness: 100, damping: 20 });
    const animatedNet = useSpring(0, { stiffness: 100, damping: 20 });

    const displayRevenue = useTransform(animatedRevenue, (latest) => Math.round(latest).toLocaleString());
    const displayExpenses = useTransform(animatedExpenses, (latest) => Math.round(latest).toLocaleString());
    const displayNet = useTransform(animatedNet, (latest) => Math.round(latest).toLocaleString());

    // Vehicle Rates
    const vehicles = [
        { id: 'tractor', name: 'Tractor', rate: 12, capacity: '1-2 Ton' },
        { id: 'pickup', name: 'Pickup', rate: 15, capacity: '2-4 Ton' },
        { id: 'truck', name: 'Mini Truck', rate: 18, capacity: '5-8 Ton' }
    ] as const;

    // Recalculate Effect
    useEffect(() => {
        if (price && quantity && distance && selectedVehicle) {
            const vehicleRate = vehicles.find(v => v.id === selectedVehicle)?.rate || 0;

            // Normalize Price to ₹/kg
            // If unit is quintal, price input is ₹/100kg. So ₹/kg = Input / 100.
            const pricePerKg = unit === 'quintal' ? (Number(price) / 100) : Number(price);

            const calc = calculateReturns(
                pricePerKg,
                Number(quantity),
                Number(distance),
                vehicleRate
            );

            setResult(calc);

            // Trigger Animations
            if (calc) {
                animatedRevenue.set(calc.grossRevenue);
                animatedExpenses.set(calc.totalExpenses);
                animatedNet.set(calc.netProfit);
            }
        } else {
            setResult(null);
        }
    }, [price, quantity, distance, selectedVehicle, unit]);

    const handleSave = () => {
        if (result && quantity) {
            const newItem: HistoryItem = {
                id: Date.now(),
                crop: 'Simulated Crop', // Could add a crop selector later
                qty: Number(quantity),
                net: result.netProfit,
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setHistory(prev => [newItem, ...prev].slice(0, 5)); // Keep last 5
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg space-y-6"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-slate-600">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-emerald-600" />
                        Smart Profit Engine
                    </h1>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-6">

                    {/* Unit Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {(['kg', 'quintal'] as const).map(u => (
                            <button
                                key={u}
                                onClick={() => setUnit(u)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${unit === u ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                ₹ / {u}
                            </button>
                        ))}
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(Number(e.target.value) || '')}
                                    className="w-full pl-8 pr-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity (kg)</label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value) || '')}
                                className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                placeholder="e.g. 500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distance to Mandi (km)</label>
                        <input
                            type="number"
                            value={distance}
                            onChange={e => setDistance(Number(e.target.value) || '')}
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none"
                            placeholder="e.g. 45"
                        />
                    </div>

                    {/* Vehicle Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {vehicles.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVehicle(v.id as any)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${selectedVehicle === v.id
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                        }`}
                                >
                                    <Truck className={`w-5 h-5 mb-2 ${selectedVehicle === v.id ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    <div className="text-xs font-bold">{v.name}</div>
                                    <div className="text-[10px] opacity-70">₹{v.rate}/km</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* LIVE RECEIPT */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl space-y-4 relative overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <div className="flex justify-between items-center text-slate-400 text-sm">
                                <span>Gross Revenue</span>
                                <div className="flex items-center gap-1 font-mono">
                                    ₹<motion.span>{displayRevenue}</motion.span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-red-300 text-sm">
                                <span>Transport & Labor</span>
                                <div className="flex items-center gap-1 font-mono">
                                    -₹<motion.span>{displayExpenses}</motion.span>
                                </div>
                            </div>

                            <div className="h-px bg-slate-700 border-t border-dashed border-slate-600 my-2"></div>

                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 font-bold text-sm tracking-wider uppercase">Net Profit</span>
                                <div className={`text-3xl font-bold font-mono ${result.isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                                    ₹<motion.span>{displayNet}</motion.span>
                                </div>
                            </div>

                            {!result.isProfitable && (
                                <div className="bg-red-500/20 text-red-200 text-xs p-2 rounded-lg text-center font-bold flex items-center justify-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Warning: Transport costs are eating your profit!
                                </div>
                            )}

                            {result.isProfitable && (
                                <div className="bg-emerald-500/20 text-emerald-200 text-xs p-2 rounded-lg text-center font-bold flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Healthy profit margin!
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                className="w-full py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white mt-2 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save to History
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Recent Simulations */}
                {history.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider pl-2">Recent Simulations</h3>
                        {history.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center"
                            >
                                <div>
                                    <div className="font-bold text-slate-800">{item.qty}kg Load</div>
                                    <div className="text-xs text-slate-400">{item.date}</div>
                                </div>
                                <div className={`font-mono font-bold ${item.net > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {item.net > 0 ? '+' : ''}₹{item.net.toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </motion.div>
        </div>
    );
};
