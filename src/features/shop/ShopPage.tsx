import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, ScanLine, X, ChevronRight, Plus, Minus, CheckCircle, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

// MOCK PRODUCTS
const PRODUCTS = [
    { id: 1, name: 'Urea Fertilizer 50kg', category: 'Fertilizer', price: 266, image: '🌿' },
    { id: 2, name: 'DAP Fertilizer 50kg', category: 'Fertilizer', price: 1350, image: '🌱' },
    { id: 3, name: 'Hybrid Tomato Seeds 100g', category: 'Seeds', price: 450, image: '🍅' },
    { id: 4, name: 'Onion Seeds N-53 500g', category: 'Seeds', price: 1200, image: '🧅' },
    { id: 5, name: 'Knapsack Sprayer 16L', category: 'Equipment', price: 2500, image: '🎒' },
    { id: 6, name: 'Drip Irrigation Kit 1 Acre', category: 'Equipment', price: 15000, image: '💧' },
];

export const ShopPage = () => {
    const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle'|'scanning'|'success'>('idle');

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === id) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const filteredProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    // Simulate scanning
    useEffect(() => {
        // Disabled simulated flow, handled by Razorpay callback now
    }, []);

    const handlePayNow = async () => {
        setPaymentStatus('scanning');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: cartTotal })
            });

            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            
            const loadRazorpayScript = () => {
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Are you online?');
                setPaymentStatus('idle');
                return;
            }

            const options = {
                key: data.key_id || 'rzp_test_Sf36eThBTQxONp',
                amount: data.amount,
                currency: 'INR',
                name: 'AgriMarket Direct',
                description: 'Direct Buy Checkout',
                // order_id is dynamically skipped if null for test keys
                ...(data.order_id ? { order_id: data.order_id } : {}),
                handler: function (response: any) {
                    setIsScannerOpen(true);
                    setPaymentStatus('success');
                    setTimeout(() => {
                        setIsScannerOpen(false);
                        setCart([]);
                        setIsCartOpen(false);
                        setPaymentStatus('idle');
                    }, 3000);
                },
                theme: { color: '#10b981' }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert("Payment failed: " + response.error.description);
                setPaymentStatus('idle');
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            alert('Payment initialization failed. Please try again.');
            setPaymentStatus('idle');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-24">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                            <ChevronRight className="w-6 h-6 rotate-180" />
                        </Link>
                        <h1 className="font-bold text-slate-800 text-lg">AgriMarket</h1>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                {cart.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search seeds, fertilizers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow shadow-sm"
                    />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <motion.div 
                            key={product.id}
                            whileHover={{ y: -4 }}
                            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col"
                        >
                            <div className="w-full h-24 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-4xl">
                                {product.image}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">{product.category}</p>
                                <h3 className="font-semibold text-slate-800 text-sm mb-1 leading-tight">{product.name}</h3>
                                <p className="font-bold text-slate-900 mb-4">₹{product.price}</p>
                            </div>
                            <Button 
                                onClick={() => addToCart(product)}
                                size="sm" 
                                className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Cart Slide-over */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-sm md:w-96 bg-white z-50 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                                    Your Cart
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                        <Package className="w-16 h-16 text-slate-200" />
                                        <p>Your cart is empty.</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.product.id} className="flex gap-4 p-3 border border-slate-100 rounded-xl bg-slate-50/50 block">
                                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl border border-slate-100 shadow-sm shrink-0">
                                                {item.product.image}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-medium text-sm text-slate-800 leading-tight">{item.product.name}</h4>
                                                    <p className="text-emerald-600 font-bold text-sm">₹{item.product.price}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600">
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 text-emerald-700">
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-4 bg-slate-50 border-t border-slate-200">
                                    <div className="flex justify-between mb-4 text-slate-600 font-medium text-sm">
                                        <span>Total Amount</span>
                                        <span className="text-slate-900 font-bold text-lg">₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <Button onClick={handlePayNow} className="w-full py-4 text-lg font-bold shadow-lg shadow-emerald-500/20">
                                        Pay Now
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Farmer's Scanner Modal (Payment) */}
            <AnimatePresence>
                {isScannerOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900 flex flex-col"
                    >
                        {/* Camera UI Mock */}
                        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
                            {/* Fake camera blur background */}
                            <div className="absolute inset-0 bg-[#123] bg-cover bg-center opacity-30 scale-110 blur-sm" />
                            
                            <div className="absolute top-6 left-4 right-4 flex justify-between items-center z-10">
                                <button onClick={() => setIsScannerOpen(false)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm flex items-center gap-2">
                                    <ScanLine className="w-4 h-4" /> Farmer's Scanner
                                </div>
                            </div>

                            {paymentStatus === 'scanning' ? (
                                <div className="relative z-10 w-64 h-64 border-2 border-emerald-500/50 rounded-3xl overflow-hidden flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                    {/* Scanning Animation */}
                                    <motion.div 
                                        animate={{ y: [-128, 128] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="absolute w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent" />
                                    <p className="text-white/70 text-sm mt-32 font-medium">Scanning QR...</p>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative z-10 bg-white p-8 rounded-3xl flex flex-col items-center text-center max-w-sm mx-4 w-full"
                                >
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <CheckCircle className="w-10 h-10" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful</h3>
                                    <p className="text-slate-500 mb-6">₹{cartTotal.toLocaleString()} paid securely via Razorpay.</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Scanner Bottom Panel */}
                        <div className="bg-white rounded-t-3xl -mt-6 relative z-20 pb-8 pt-6 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-slate-500">Paying to</p>
                                    <p className="font-bold text-slate-900">AgriMarket Direct</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">Amount</p>
                                    <p className="font-bold text-emerald-600 text-xl">₹{cartTotal.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
