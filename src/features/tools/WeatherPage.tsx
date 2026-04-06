import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const WeatherPage = () => {
    const navigate = useNavigate();

    // Mock Forecast Data
    const current = { temp: 28, humidity: 82, wind: 12, condition: 'Cloudy' };
    const forecast = [
        { day: 'Tue', temp: 29, icon: '⛅' },
        { day: 'Wed', temp: 27, icon: '🌧️' },
        { day: 'Thu', temp: 26, icon: '🌧️' },
        { day: 'Fri', temp: 28, icon: '⛅' },
        { day: 'Sat', temp: 30, icon: '☀️' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-emerald-600" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                {/* Current Weather Hero */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h2 className="text-blue-100 font-medium text-lg mb-1">Pune, Maharashtra</h2>
                            <h1 className="text-6xl font-bold mb-4">{current.temp}°</h1>
                            <div className="flex items-center gap-4 text-blue-100 text-sm">
                                <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {current.humidity}%</span>
                                <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> {current.wind} km/h</span>
                            </div>
                        </div>
                        <div className="text-8xl">⛅</div>
                    </div>
                </div>

                {/* Agri-Advisory (Smart Logic) */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
                    <div className="p-3 bg-amber-100 rounded-full text-amber-600 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-amber-900 font-bold text-lg mb-1">High Fungal Risk Alert</h3>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            Due to high humidity ({current.humidity}%) and cloudy weather, there is a risk of <b>Early Blight</b> in Tomato and Potato crops.
                        </p>
                        <div className="mt-3 inline-block bg-white px-3 py-1 rounded-md border border-amber-200 text-xs font-bold text-amber-900">
                            Recommendation: Spray Mancozeb (2.5g/liter)
                        </div>
                    </div>
                </div>

                {/* 5-Day Forecast */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h3 className="text-slate-900 font-bold mb-4">5-Day Forecast</h3>
                    <div className="grid grid-cols-5 gap-2 text-center">
                        {forecast.map((day, idx) => (
                            <div key={idx} className="p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <p className="text-slate-500 text-xs font-medium mb-2">{day.day}</p>
                                <div className="text-2xl mb-2">{day.icon}</div>
                                <p className="text-slate-900 font-bold">{day.temp}°</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
