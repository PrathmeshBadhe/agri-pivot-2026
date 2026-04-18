import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Calculator, Truck, CloudSun, ShoppingCart } from 'lucide-react';

const NAV_ITEMS = [
    { to: '/',           icon: LayoutDashboard, label: 'Home'       },
    { to: '/shop',       icon: ShoppingCart,    label: 'Buy'        },
    { to: '/markets',    icon: TrendingUp,      label: 'Mandi'      },
    { to: '/calculator', icon: Calculator,      label: 'Profit'     },
    { to: '/logistics',  icon: Truck,           label: 'Transport'  },
];

export const BottomNav = () => {
    const { pathname } = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-200 pb-safe">
            <div className="flex items-center justify-around h-16 px-1">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
                    const active = pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-all tap-none ${
                                active
                                    ? 'text-emerald-600'
                                    : 'text-slate-400 hover:text-slate-700'
                            }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-emerald-50' : ''}`}>
                                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                            </div>
                            <span className={`text-[10px] font-semibold ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
