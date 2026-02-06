import { useAuth } from '../auth/useAuth';
import { Button } from '../../components/ui/Button';
import { ForecastChart } from '../prediction/ForecastChart';
import { usePrediction } from '../prediction/usePrediction';
import { TrendingUp, TrendingDown, Tractor, Calculator, CloudSun, Leaf, Bell } from 'lucide-react';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const { data, isLoading, signal } = usePrediction('Onion');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-6 h-6 text-emerald-600" />
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Agri-Pivot</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">{user?.full_name || 'Farmer'}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role || 'Guest'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                {user?.full_name?.[0] || 'U'}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Command Center</h2>
                        <p className="text-slate-500">Live market intelligence for your district.</p>
                    </div>
                    <div className="hidden md:block">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                            Live Connection
                        </span>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {/* Widget 1: The Signal (Hero) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center justify-between h-full">
                            <div>
                                <h3 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-2">AI Recommendation</h3>
                                <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
                                    {signal === 'sell' ? (
                                        <>
                                            <span className="text-emerald-400">SELL NOW</span>
                                            <TrendingUp className="w-10 h-10 text-emerald-500" />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-amber-400">HOLD</span>
                                            <TrendingDown className="w-10 h-10 text-amber-500" />
                                        </>
                                    )}
                                </div>
                                <p className="text-slate-300 max-w-sm">
                                    Prices are projected to peak in <b>4 days</b> based on historical mandi patterns.
                                </p>
                            </div>
                            {/* Traffic Light Visual */}
                            <div className="hidden md:flex flex-col gap-3 bg-slate-800 p-3 rounded-full border border-slate-700">
                                <div className={`w-12 h-12 rounded-full ${signal === 'sell' ? 'bg-red-500/20' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]'}`}></div>
                                <div className={`w-12 h-12 rounded-full ${signal === 'hold' ? 'bg-amber-500/20' : 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]'}`}></div>
                                <div className={`w-12 h-12 rounded-full ${signal === 'buy' ? 'bg-emerald-500/20' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]'}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Widget 2: Market Ticker / Stats */}
                    <div className="col-span-1 md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase mb-4">Market Pulse (Pune)</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                    <span className="font-medium text-slate-700">Onion</span>
                                    <span className="font-bold text-slate-900">₹2,400/q</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                                    <span className="font-medium text-slate-700">Potato</span>
                                    <span className="font-bold text-slate-900">₹1,800/q</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-700">Tomato</span>
                                    <span className="font-bold text-slate-900">₹3,200/q</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4 text-xs">View All Mandis</Button>
                    </div>

                    {/* Widget 3: Quick Tools */}
                    <div className="col-span-1 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <h3 className="text-emerald-800 text-xs font-bold uppercase mb-4">Quick Tools</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-emerald-700">
                                <Calculator className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">Profit Calc</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-emerald-700">
                                <Tractor className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">Logistics</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-emerald-700">
                                <CloudSun className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">Weather</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-emerald-700">
                                <Leaf className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold">Crop Doc</span>
                            </button>
                        </div>
                    </div>

                    {/* Widget 4: The Brain (Forecast Chart) */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4 rounded-2xl overflow-hidden">
                        <ForecastChart data={data} isLoading={isLoading} />
                    </div>

                </div>
            </main>
        </div>
    );
};
