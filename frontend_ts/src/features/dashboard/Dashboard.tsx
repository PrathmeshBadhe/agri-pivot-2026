import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { Button } from '../../components/ui/Button';
import { ForecastChart } from '../prediction/ForecastChart';
import { usePrediction } from '../prediction/usePrediction';
import { TrendingUp, TrendingDown, Tractor, Calculator, CloudSun, Leaf, Bell, Pencil, Check, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Dashboard = () => {
    const { user, logout, updateProfile } = useAuth();
    const [selectedCrop, setSelectedCrop] = useState('Onion');
    const { data: chartData, isLoading: isChartLoading, signal, color } = usePrediction(selectedCrop);

    // Profile Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(user?.full_name || '');

    // Sync temp name when user loads
    useEffect(() => {
        if (user?.full_name) setTempName(user.full_name);
    }, [user]);

    const handleSaveProfile = () => {
        if (tempName.trim()) {
            updateProfile(tempName);
            setIsEditing(false);
            toast.success('Profile Updated Successfully');
        } else {
            toast.error('Name cannot be empty');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">

            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AP
                        </div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">Agri-Pivot AI</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden md:block group">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="px-2 py-1 text-sm border border-emerald-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 w-32"
                                            autoFocus
                                        />
                                        <button onClick={handleSaveProfile} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-800">{user?.full_name || 'Agri-User'}</p>
                                        <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-emerald-600">
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                <p className="text-xs text-slate-500">Farmer • Premium</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-bold text-emerald-700">
                                {user?.full_name ? user.full_name[0] : 'U'}
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                {/* Hero Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {user?.full_name?.split(' ')[0] || 'Farmer'}! 🌾</h1>
                    <p className="text-slate-500 font-medium">Here's your mandi forecast for today.</p>
                </div>

                {/* Control Center (Quick Actions) */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link to="/calculator" className="contents">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative h-28 w-full flex items-center px-6 gap-4 bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden group hover:bg-white/80 transition-colors"
                            >
                                <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <Calculator className="w-7 h-7" />
                                </div>
                                <span className="text-lg font-bold text-slate-800 tracking-tight text-left leading-tight">Profit<br />Calculator</span>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                            </motion.button>
                        </Link>

                        <Link to="/logistics" className="contents">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative h-28 w-full flex items-center px-6 gap-4 bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden group hover:bg-white/80 transition-colors"
                            >
                                <div className="p-3.5 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <Tractor className="w-7 h-7" />
                                </div>
                                <span className="text-lg font-bold text-slate-800 tracking-tight text-left leading-tight">Logistics<br />Hub</span>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                            </motion.button>
                        </Link>

                        <Link to="/weather" className="contents">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="relative h-28 w-full flex items-center px-6 gap-4 bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden group hover:bg-white/80 transition-colors"
                            >
                                <div className="p-3.5 rounded-2xl bg-sky-100 text-sky-600 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <CloudSun className="w-7 h-7" />
                                </div>
                                <span className="text-lg font-bold text-slate-800 tracking-tight text-left leading-tight">Weather<br />Forecast</span>
                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl" />
                            </motion.button>
                        </Link>

                        <motion.button
                            onClick={() => toast('Crop Doctor AI coming soon!', { icon: '🤖' })}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="relative h-28 w-full flex items-center px-6 gap-4 bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden group hover:bg-white/80 transition-colors"
                        >
                            <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Leaf className="w-7 h-7" />
                            </div>
                            <span className="text-lg font-bold text-slate-800 tracking-tight text-left leading-tight">Crop<br />Doctor</span>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Section */}
                    <div className="col-span-1 lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-6 rounded-3xl"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    Price Forecast
                                </h2>

                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    {['Onion', 'Tomato', 'Potato'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedCrop(c)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCrop === c ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ForecastChart data={chartData} isLoading={isChartLoading} color={color} />
                        </motion.div>
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="col-span-1 space-y-6">
                        {/* Widget 1: AI Signal */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">AI Signal ({selectedCrop})</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-bold">{signal === 'buy' ? 'BUY NOW' : signal === 'sell' ? 'SELL NOW' : 'HOLD'}</h3>
                                    {signal === 'buy' ?
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse drop-shadow-[0_0_15px_rgba(16,185,129,0.6)] shadow-emerald-500/50"><TrendingUp className="w-6 h-6" /></div> :
                                        signal === 'sell' ?
                                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] shadow-red-500/50"><TrendingDown className="w-6 h-6" /></div> :
                                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-amber-500/50"><Coins className="w-6 h-6" /></div>
                                    }
                                </div>
                                <p className="text-slate-400 text-sm mt-4">
                                    {signal === 'buy' && `Market is bottoming out at ₹${chartData[chartData.length - 1]?.price.toFixed(0)}. Good time to stock.`}
                                    {signal === 'sell' && `Prices are peaking at ₹${chartData[chartData.length - 1]?.price.toFixed(0)}. Capture profit now.`}
                                    {signal === 'hold' && `Market trend is uncertain. Wait for clearer signals.`}
                                </p>
                            </div>
                        </motion.div>

                        {/* Widget 2: Market Ticker / Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="col-span-1 md:col-span-1 glass-panel p-6 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-shadow"
                        >
                            <div>
                                <h3 className="text-slate-500 text-xs font-bold uppercase mb-4">Market Pulse (Pune)</h3>
                                <div className="space-y-[1px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/50">
                                    <div className="flex justify-between items-center p-3 bg-white hover:bg-slate-50 transition-colors">
                                        <span className="font-medium text-slate-700">Onion</span>
                                        <span className="font-bold text-slate-900">₹2,400/q</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white hover:bg-slate-50 transition-colors">
                                        <span className="font-medium text-slate-700">Potato</span>
                                        <span className="font-bold text-slate-900">₹1,800/q</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white hover:bg-slate-50 transition-colors">
                                        <span className="font-medium text-slate-700">Tomato</span>
                                        <span className="font-bold text-slate-900">₹3,200/q</span>
                                    </div>
                                </div>
                            </div>
                            <Link to="/markets">
                                <Button variant="outline" size="sm" className="w-full mt-4 text-xs group">
                                    View All Mandis
                                    <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                                </Button>
                            </Link>
                        </motion.div>



                    </div>
                </div>
            </main>
        </div>
    );
};
