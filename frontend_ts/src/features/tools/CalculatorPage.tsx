import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CalculatorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-emerald-600" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                            <Calculator className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Profit Calculator</h1>
                    </div>

                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <p className="text-slate-500">Advanced Crop Profitability modeling coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
