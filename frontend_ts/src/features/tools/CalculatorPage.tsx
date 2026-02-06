import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowLeft, Truck, ArrowRight, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CalculatorPage = () => {
    const navigate = useNavigate();

    // Inputs
    const [crop, setCrop] = useState('Onion');
    const [unit, setUnit] = useState<'kg' | 'quintal'>('kg');
    const [inputValue, setInputValue] = useState<number>(500); // Input value based on unit
    const [distance, setDistance] = useState<number>(100); // km
    const [vehicle, setVehicle] = useState('pickup');

    // Rates (Mock DB)
    const marketPrices: Record<string, number> = {
        'Onion': 24, // ₹/kg
        'Tomato': 32,
        'Soybean': 45,
        'Potato': 18
    };

    const vehicles = [
        { id: 'tractor', name: 'Tractor', rate: 12, capacity: '2 Ton', icon: Truck },
        { id: 'pickup', name: 'Pickup', rate: 15, capacity: '1.5 Ton', icon: Truck },
        { id: 'truck', name: 'Mini Truck', rate: 18, capacity: '4 Ton', icon: Truck },
    ];

    // Derived Logic
    const quantityKg = unit === 'kg' ? inputValue : inputValue * 100;
    const pricePerKg = marketPrices[crop];
    const selectedVehicle = vehicles.find(v => v.id === vehicle) || vehicles[0];

    // Financials
    const grossRevenue = pricePerKg * quantityKg;
    const transportCost = distance * selectedVehicle.rate;
    const laborCost = quantityKg * 2.50; // ₹2.50/kg loading/unloading
    const totalCost = transportCost + laborCost;
    const netProfit = grossRevenue - totalCost;
    const isLoss = netProfit < 0;

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-emerald-600" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Input Form */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Profit Calculator</h1>
                        </div>

                        <div className="space-y-6">
                            {/* Crop Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Crop</label>
                                <select
                                    value={crop}
                                    onChange={(e) => setCrop(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {Object.keys(marketPrices).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <Info className="w-3 h-3" /> Current Market Rate: ₹{pricePerKg}/kg
                                </p>
                            </div>

                            {/* Quantity with Unit Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(Number(e.target.value))}
                                        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setUnit('kg')}
                                            className={`px - 4 py - 2 rounded - lg text - sm font - medium transition - all ${unit === 'kg' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
                                        >
                                            kg
                                        </button>
                                        <button
                                            onClick={() => setUnit('quintal')}
                                            className={`px - 4 py - 2 rounded - lg text - sm font - medium transition - all ${unit === 'quintal' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'} `}
                                        >
                                            Quintal
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 text-right">Total: {quantityKg} kg</p>
                            </div>

                            {/* Distance Slider */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Distance to Market: <span className="font-bold text-slate-900">{distance} km</span>
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>

                            {/* Vehicle Selection Cards */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Transport Mode</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {vehicles.map((v) => (
                                        <div
                                            key={v.id}
                                            onClick={() => setVehicle(v.id)}
                                            className={`flex items - center justify - between p - 3 rounded - xl border cursor - pointer transition - all ${vehicle === v.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'} `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p - 2 rounded - lg ${vehicle === v.id ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'} `}>
                                                    <v.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={`font - bold text - sm ${vehicle === v.id ? 'text-emerald-900' : 'text-slate-700'} `}>{v.name}</p>
                                                    <p className="text-xs text-slate-500">Cap: {v.capacity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 text-sm">₹{v.rate}/km</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Receipt */}
                    <div className={`rounded - 2xl p - 8 shadow - 2xl relative overflow - hidden flex flex - col justify - between transition - colors duration - 500 ${isLoss ? 'bg-slate-900' : 'bg-slate-900'} `}>
                        {/* Background Glow */}
                        <div className={`absolute top - 0 right - 0 p - 32 rounded - full blur - 3xl transition - colors duration - 500 ${isLoss ? 'bg-red-500/10' : 'bg-emerald-500/10'} `}></div>

                        <div className="relative z-10">
                            <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-6 border-b border-slate-700 pb-4">Estimated Net Profit</h3>

                            <div className="space-y-4 text-sm text-slate-300">
                                <div className="flex justify-between">
                                    <span>Gross Revenue ({quantityKg}kg x ₹{pricePerKg})</span>
                                    <span className="text-white font-mono">₹{grossRevenue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span className="flex items-center gap-2"><Truck className="w-3 h-3" /> Transport Cost</span>
                                    <span className="font-mono">- ₹{transportCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span>Labor & Loading (₹2.50/kg)</span>
                                    <span className="font-mono">- ₹{laborCost.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-700">
                                <div className="flex justify-between items-end">
                                    <span className={`text - lg font - medium ${isLoss ? 'text-red-400' : 'text-emerald-400'} `}>
                                        {isLoss ? 'Net Loss' : 'Net Profit'}
                                    </span>
                                    <span className={`text - 4xl lg: text - 5xl font - bold font - mono transition - colors duration - 300 ${isLoss ? 'text-red-500' : 'text-emerald-400'} `}>
                                        {isLoss ? '-' : ''}₹{Math.abs(netProfit).toLocaleString()}
                                    </span>
                                </div>
                                {isLoss && (
                                    <div className="mt-4 p-3 bg-red-900/30 border border-red-900/50 rounded-lg flex items-start gap-2 text-red-200 text-xs">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                                        <p>Warning: Transport & Labor costs exceed your revenue. Increase quantity to improve margins.</p>
                                    </div>
                                )}
                                {!isLoss && (
                                    <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-900/50 rounded-lg flex items-start gap-2 text-emerald-200 text-xs">
                                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                                        <p>Great! You are making a healthy profit on this trade.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button className={`w - full text - white border - none py - 6 text - lg transition - colors ${isLoss ? 'bg-slate-700 hover:bg-slate-600' : 'bg-emerald-500 hover:bg-emerald-600'} `}>
                                Save Calculation <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
