import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, ChevronLeft, ShoppingCart, Plus, Minus, X, ScanLine, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// Mock DB of farmers
const FARMERS_DB = [
    { 
        id: 'mock-farmer-1', // Generic ID for trader to see
        name: 'Ramesh Patil', 
        farm: 'Green Valley Organics', 
        location: 'Nashik, MH', 
        distance: '12 km away',
        rating: 4.9,
        reviews: 124,
        products: [
            { id: 'p1', name: 'Export Quality Grapes', category: 'Fruits', price: 80, unit: 'kg', emoji: '🍇' },
            { id: 'p2', name: 'Red Onions (A-Grade)', category: ' वेजिटेबल्स (Veg)', price: 25, unit: 'kg', emoji: '🧅' },
            { id: 'p3', name: 'Pomegranates', category: 'Fruits', price: 120, unit: 'kg', emoji: '🍎' } // fallback emoji
        ]
    },
    { 
        id: 'mock-farmer-2', 
        name: 'Suresh Kumar', 
        farm: 'Sunrise Agro Farms', 
        location: 'Pune APMC Zone', 
        distance: '45 km away',
        rating: 4.7,
        reviews: 89,
        products: [
            { id: 'p4', name: 'Hybrid Tomatoes', category: 'Vegetables', price: 18, unit: 'kg', emoji: '🍅' },
            { id: 'p5', name: 'Fresh Potatoes', category: 'Vegetables', price: 15, unit: 'kg', emoji: '🥔' }
        ]
    },
    { 
        id: 'mock-farmer-3', 
        name: 'Anand Reddy', 
        farm: 'Reddy Estates', 
        location: 'Solapur, MH', 
        distance: '110 km away',
        rating: 4.8,
        reviews: 210,
        products: [
            { id: 'p6', name: 'Alphonso Mangoes', category: 'Fruits', price: 650, unit: 'dozen', emoji: '🥭' },
            { id: 'p7', name: 'Sweet Corn', category: 'Vegetables', price: 40, unit: 'kg', emoji: '🌽' }
        ]
    }
];

export const TraderNetworkPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFarmer, setSelectedFarmer] = useState<typeof FARMERS_DB[0] | null>(null);
    const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
    
    // GPay Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'scan' | 'verifying' | 'success'>('scan');
    const [activeScannerImg, setActiveScannerImg] = useState<string | null>(null);

    const filteredFarmers = useMemo(() => {
        return FARMERS_DB.filter(f => 
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
        toast.success(`Added ${product.name} to cart`);
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === id) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: newQuantity > 0 ? newQuantity : 0 };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleOpenCheckout = () => {
        if (!selectedFarmer) return;
        // See if the farmer uploaded a real QR in their local storage test account
        const customQr = localStorage.getItem(`farmer_qr_${selectedFarmer.id}`);
        setActiveScannerImg(customQr || 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg');
        setIsCheckoutOpen(true);
        setPaymentStep('scan');
    };

    const handleConfirmPayment = () => {
        setPaymentStep('verifying');
        setTimeout(() => {
            setPaymentStep('success');
            setTimeout(() => {
                setIsCheckoutOpen(false);
                setCart([]);
                setSelectedFarmer(null);
                setSearchQuery('');
                toast.success('Order placed successfully!');
            }, 3000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-24">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="font-bold text-slate-800 text-lg">Farmer Network</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {!selectedFarmer ? (
                    <>
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search farmers, locations, or crops..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-wide text-slate-700 shadow-sm"
                            />
                        </div>

                        {/* Directory */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFarmers.map(farmer => (
                                <motion.div 
                                    key={farmer.id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => setSelectedFarmer(farmer)}
                                    className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center text-xl font-bold text-emerald-700 shrink-0 border border-emerald-100">
                                                {farmer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors leading-tight">{farmer.name}</h3>
                                                <p className="text-sm text-slate-500 font-medium">{farmer.farm}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <MapPin className="w-4 h-4 text-emerald-500" /> {farmer.location}
                                        </div>
                                        <div className="w-[1px] h-4 bg-slate-200" />
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {farmer.rating} <span className="text-slate-400 font-normal">({farmer.reviews})</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Available Now</p>
                                        <div className="flex flex-wrap gap-2">
                                            {farmer.products.map(p => (
                                                <span key={p.id} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 font-medium shadow-sm">
                                                    {p.emoji} {p.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        {/* Selected Farmer Header */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none" />
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <button onClick={() => { setSelectedFarmer(null); setCart([]); }} className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline mb-4">
                                        <ChevronLeft className="w-4 h-4" /> Back to Directory
                                    </button>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-1">{selectedFarmer.name}</h2>
                                    <p className="text-slate-500 font-medium mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {selectedFarmer.location} • {selectedFarmer.distance}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Products */}
                            <div className="col-span-1 lg:col-span-2">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Fresh Produce</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedFarmer.products.map(product => (
                                        <div key={product.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors">
                                            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                                                {product.emoji}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900">{product.name}</h4>
                                                <p className="text-lg font-bold text-emerald-600">₹{product.price}<span className="text-xs text-slate-400 font-normal">/{product.unit}</span></p>
                                            </div>
                                            <Button onClick={() => addToCart(product)} size="sm" className="shrink-0 bg-slate-900 hover:bg-slate-800">
                                                Add
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cart Sidebar */}
                            <div className="col-span-1">
                                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5 text-emerald-600" />
                                        Your Order
                                    </h3>

                                    {cart.length === 0 ? (
                                        <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            Select produce from {selectedFarmer.name.split(' ')[0]} to start buying.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map(item => (
                                                <div key={item.product.id} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-slate-800 text-sm leading-tight">{item.product.name}</h4>
                                                        <p className="text-emerald-600 font-bold text-sm mt-1">₹{item.product.price}/{item.product.unit}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className="font-bold text-slate-900">₹{item.product.price * item.quantity}</span>
                                                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                                            <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-white rounded text-slate-600"><Minus className="w-3 h-3" /></button>
                                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-white rounded text-slate-600"><Plus className="w-3 h-3" /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="pt-4 mt-2">
                                                <div className="flex justify-between items-center mb-6">
                                                    <span className="text-slate-500 font-semibold">Total to Pay</span>
                                                    <span className="text-2xl font-black text-slate-900">₹{cartTotal.toLocaleString()}</span>
                                                </div>
                                                <Button onClick={handleOpenCheckout} className="w-full py-4 text-lg shadow-lg shadow-emerald-500/20">
                                                    Open Scanner
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Google Pay Direct Scanner Modal */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative"
                        >
                            <button onClick={() => setIsCheckoutOpen(false)} disabled={paymentStep !== 'scan'} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full z-10 disabled:opacity-0 transition-opacity">
                                <X className="w-4 h-4" />
                            </button>

                            <div className="p-8 pb-6 flex flex-col items-center">
                                <ScanLine className="w-8 h-8 text-slate-400 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight text-center leading-tight mb-2">
                                    Direct Payment to<br/>{selectedFarmer?.name}
                                </h3>
                                <p className="text-emerald-600 font-black text-3xl my-2">₹{cartTotal.toLocaleString()}</p>
                            </div>

                            {paymentStep === 'scan' ? (
                                <div className="px-8 pb-8 flex flex-col items-center">
                                    <div className="w-full aspect-square border-4 border-slate-100 rounded-3xl p-4 bg-white shadow-inner relative flex items-center justify-center mb-6 overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        <img src={activeScannerImg || ''} alt="GPay QR Code" className="w-full h-full object-contain relative z-10" />
                                        
                                        {/* Scanner beam animation */}
                                        <motion.div 
                                            animate={{ y: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium text-center mb-6">
                                        Scan this code using Google Pay or PhonePe on your phone to complete the transaction directly.
                                    </p>
                                    <Button onClick={handleConfirmPayment} className="w-full py-4 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20">
                                        I have completed the payment
                                    </Button>
                                </div>
                            ) : paymentStep === 'verifying' ? (
                                <div className="px-8 py-12 flex flex-col items-center">
                                    <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-6" />
                                    <h4 className="font-bold text-lg text-slate-800">Verifying Payment...</h4>
                                    <p className="text-slate-500 text-sm mt-2">Waiting for bank confirmation</p>
                                </div>
                            ) : (
                                <div className="px-8 py-12 flex flex-col items-center bg-emerald-50">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
                                        <CheckCircle className="w-10 h-10" />
                                    </motion.div>
                                    <h4 className="font-bold text-2xl text-emerald-900 mb-2">Payment Confirmed!</h4>
                                    <p className="text-emerald-700 text-center font-medium">Your order has been sent to the farmer successfully.</p>
                                </div>
                            )}

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
