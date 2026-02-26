import { useState, type FormEvent } from 'react';
import { useAuth } from './useAuth';
import { Button } from '../../components/ui/Button';
import { Sprout, Tractor } from 'lucide-react';

export const LoginPage = () => {
    const [role, setRole] = useState<'farmer' | 'trader'>('farmer');
    const [email, setEmail] = useState('farmer@agri.com');
    const [password, setPassword] = useState('demo');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-5819acf42461?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="relative z-10 text-center p-12">
                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Agri-Pivot AI</h1>
                    <p className="text-emerald-100 text-xl max-w-md mx-auto leading-relaxed">
                        Industry-grade predictive analytics for the modern agricultural ecosystem.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-slate-600">Sign in to your dashboard</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex p-1 bg-slate-200 rounded-xl">
                        <button
                            onClick={() => setRole('farmer')}
                            className={`flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-medium transition-all ${role === 'farmer' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <Tractor className="w-4 h-4 mr-2" />
                            I am a Farmer
                        </button>
                        <button
                            onClick={() => setRole('trader')}
                            className={`flex-1 flex items-center justify-center py-3 rounded-lg text-sm font-medium transition-all ${role === 'trader' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <Sprout className="w-4 h-4 mr-2" />
                            I am a Trader
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Sign In to Dashboard
                        </Button>

                        <p className="text-xs text-center text-slate-500 mt-4">
                            Strict Adherence Mode: Mock Auth enabled. <br /> Use <b>farmer@agri.com</b> / <b>demo</b>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
