import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Truck, Phone, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Mock Data
const MARKETS = [
    { id: 1, name: 'Pune APMC', distance: 120, price: 2400, transportCost: 1800, grade: 'A', arrival: '150 Tons', contact: '+91 98220 12345' },
    { id: 2, name: 'Lasalgaon', distance: 210, price: 2800, transportCost: 3150, grade: 'A+', arrival: '500 Tons', contact: '+91 99230 67890' },
    { id: 3, name: 'Nashik Market', distance: 200, price: 2600, transportCost: 3000, grade: 'A', arrival: '320 Tons', contact: '+91 94220 54321' },
    { id: 4, name: 'Mumbai Vashi', distance: 150, price: 2900, transportCost: 2800, grade: 'B', arrival: '120 Tons', contact: '+91 98200 98765' },
];

export const MarketPage = () => {
    const navigate = useNavigate();
    const qty = 10; // 10 Quintals (1 Ton) for calculation base

    // Calculate Net Profit
    const marketsWithProfit = MARKETS.map(m => {
        const gross = m.price * qty;
        const profit = gross - m.transportCost;
        return { ...m, profit };
    }).sort((a, b) => b.profit - a.profit); // Sort by highest profit

    const [selectedMarket, setSelectedMarket] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-emerald-600" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-8 h-8 text-emerald-600" />
                            Mandi Arbitrage
                        </h1>
                        <p className="text-slate-500">Real-time profit comparison based on your location.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Market</th>
                                    <th className="p-4 font-semibold">Grade</th>
                                    <th className="p-4 font-semibold">Price/Qtl</th>
                                    <th className="p-4 font-semibold">Distance</th>
                                    <th className="p-4 font-semibold text-right">Net Profit (1 Ton)</th>
                                    <th className="p-4 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marketsWithProfit.map((m, idx) => (
                                    <tr
                                        key={m.id}
                                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx === 0 ? 'bg-emerald-50/50 hover:bg-emerald-50' : ''}`}
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{m.name}</div>
                                            <div className="text-xs text-slate-400">Arrival: {m.arrival}</div>
                                            {idx === 0 && <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full mt-1 font-bold"> <Star className="w-3 h-3 fill-emerald-800" /> Best Rate</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{m.grade}</span>
                                        </td>
                                        <td className="p-4 font-mono font-medium">₹{m.price.toLocaleString()}</td>
                                        <td className="p-4 text-slate-500 text-sm">{m.distance} km</td>
                                        <td className="p-4 text-right">
                                            <div className="font-bold text-emerald-600">₹{m.profit.toLocaleString()}</div>
                                            <div className="text-[10px] text-red-400">Trans: -₹{m.transportCost}</div>
                                        </td>
                                        <td className="p-4">
                                            <Button size="sm" variant="outline" onClick={() => setSelectedMarket(m.id)}>
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Logic (Simple conditional render) */}
                {selectedMarket && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedMarket(null)}>
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{MARKETS.find(m => m.id === selectedMarket)?.name} Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500">Secretary Contact</p>
                                        <p className="font-medium">{MARKETS.find(m => m.id === selectedMarket)?.contact}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Truck className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs text-slate-500">Best Unloading Time</p>
                                        <p className="font-medium">10:00 AM - 02:00 PM</p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full mt-6" onClick={() => setSelectedMarket(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
