import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/useAuth';
import toast from 'react-hot-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const UploadScannerModal = ({ isOpen, onClose }: Props) => {
    const { user } = useAuth();
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // If already uploaded, try to load it from local storage
    const currentScanner = user ? localStorage.getItem(`farmer_qr_${user.id}`) : null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!preview || !user) return;
        setIsUploading(true);
        
        // Simulating network delay for realistic feel
        setTimeout(() => {
            localStorage.setItem(`farmer_qr_${user.id}`, preview);
            setIsUploading(false);
            toast.success('GPay Scanner securely saved!');
            onClose();
        }, 1200);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 pb-6 flex flex-col items-center border-b border-slate-100">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight text-center">Upload Payment Scanner</h2>
                            <p className="text-slate-500 text-center mt-2 text-sm leading-relaxed">
                                Upload your personal Google Pay or PhonePe QR code. Traders will scan this to pay you directly.
                            </p>
                        </div>

                        <div className="p-6">
                            {!preview && !currentScanner ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-emerald-300 transition-colors group"
                                >
                                    <ImageIcon className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 mb-3 transition-colors" />
                                    <p className="text-slate-600 font-medium">Tap to select from Gallery</p>
                                    <p className="text-slate-400 text-xs mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            ) : (
                                <div className="space-y-4 flex flex-col items-center">
                                    <div className="relative p-2 bg-slate-50 border border-slate-100 rounded-2xl w-48 h-48 flex items-center justify-center shadow-inner">
                                        <img 
                                            src={preview || currentScanner || ''} 
                                            alt="QR Code Preview" 
                                            className="max-w-full max-h-full rounded-xl object-contain"
                                        />
                                        {!preview && (
                                            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Active
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => { setPreview(null); localStorage.removeItem(`farmer_qr_${user?.id}`); }}
                                        className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors underline"
                                    >
                                        Remove & Upload Different
                                    </button>
                                </div>
                            )}

                            <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {preview && (
                                <Button 
                                    onClick={handleSave} 
                                    className="w-full mt-6 py-4 shadow-lg shadow-emerald-500/20 text-lg"
                                    isLoading={isUploading}
                                >
                                    Save & Make Public
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
