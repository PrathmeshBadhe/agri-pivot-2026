import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Truck, Share2, Star } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LogisticsPage = () => {
    const navigate = useNavigate();
    const [poolingEnabled, setPoolingEnabled] = useState(false);

    const transporters = [
        { id: 1, name: 'Ramesh Transport', vehicle: 'Tata Ace (Chota Hathi)', capacity: '750 kg', rate: '₹15/km', rating: 4.5, verified: true },
        { id: 2, name: 'Priya Logistics', vehicle: 'Mahindra Bolero Pickup', capacity: '1.2 Ton', rate: '₹18/km', rating: 4.8, verified: true },
        { id: 3, name: 'Pune Express', vehicle: 'Eicher Pro', capacity: '3.5 Ton', rate: '₹28/km', rating: 4.2, verified: false },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-emerald-600" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="bg-emerald-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Find Transport</h1>
                        <p className="text-emerald-100 mb-6">Connect with verified local transporters instantly.</p>

                        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <Share2 className="w-6 h-6 text-emerald-200" />
                            <div className="flex-1">
                                <p className="font-bold">Share a Ride & Save 30%</p>
                                <p className="text-xs text-emerald-100">Pool your load with nearby farmers.</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${poolingEnabled ? 'bg-emerald-400' : 'bg-slate-900/40'}`} onClick={() => setPoolingEnabled(!poolingEnabled)}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${poolingEnabled ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
                        <Truck className="w-64 h-64" />
                    </div>
                </div>

                <div className="space-y-4">
                    {transporters.map(t => (
                        <div key={t.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        {t.name}
                                        {t.verified && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">Verified</span>}
                                    </h3>
                                    <p className="text-sm text-slate-500">{t.vehicle} • {t.capacity}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold text-slate-700">{t.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="text-right hidden sm:block">
                                    <p className="text-lg font-bold text-emerald-600">
                                        {poolingEnabled ? (
                                            <>
                                                <span className="line-through text-slate-300 text-xs mr-2">{t.rate}</span>
                                                ₹{parseInt(t.rate.replace(/\D/g, '')) * 0.7}/km
                                            </>
                                        ) : t.rate}
                                    </p>
                                    {poolingEnabled && <p className="text-xs text-emerald-600 font-medium">Pooled Rate</p>}
                                </div>
                                <Button className="flex-1 sm:flex-none gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                    <Phone className="w-4 h-4" /> Call Now
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
