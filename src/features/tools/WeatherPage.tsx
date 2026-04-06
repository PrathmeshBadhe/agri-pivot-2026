import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Wind, Thermometer, Eye, AlertTriangle, CheckCircle, Info, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

// ─── Open-Meteo API (free, no key) ─────────────────────────────────
// Using Pune coordinates: lat=18.52, lon=73.86
const WEATHER_URL =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=18.52&longitude=73.86' +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max' +
    '&timezone=Asia%2FKolkata&forecast_days=7';

// WMO weather code → emoji + label
const WMO: Record<number, { icon: string; label: string }> = {
    0:  { icon: '☀️',  label: 'Clear Sky' },
    1:  { icon: '🌤️', label: 'Mainly Clear' },
    2:  { icon: '⛅',  label: 'Partly Cloudy' },
    3:  { icon: '☁️',  label: 'Overcast' },
    45: { icon: '🌫️', label: 'Foggy' },
    48: { icon: '🌫️', label: 'Icy Fog' },
    51: { icon: '🌦️', label: 'Light Drizzle' },
    53: { icon: '🌦️', label: 'Drizzle' },
    55: { icon: '🌧️', label: 'Heavy Drizzle' },
    61: { icon: '🌧️', label: 'Slight Rain' },
    63: { icon: '🌧️', label: 'Rain' },
    65: { icon: '🌧️', label: 'Heavy Rain' },
    71: { icon: '❄️',  label: 'Slight Snow' },
    80: { icon: '🌦️', label: 'Rain Showers' },
    81: { icon: '🌧️', label: 'Heavy Showers' },
    95: { icon: '⛈️',  label: 'Thunderstorm' },
    96: { icon: '⛈️',  label: 'Thunderstorm + Hail' },
};
const wmo = (code: number) => WMO[code] ?? { icon: '🌡️', label: 'Unknown' };

// ─── Crop advisory engine ───────────────────────────────────────────
interface Advisory {
    crop: string;
    emoji: string;
    level: 'danger' | 'warning' | 'good';
    title: string;
    actions: string[];
}

function getAdvisories(temp: number, humidity: number, rain: number, windSpeed: number, code: number): Advisory[] {
    const advisories: Advisory[] = [];
    const isRainy      = rain > 5 || [51,53,55,61,63,65,80,81,95,96].includes(code);
    const isHeavyRain  = rain > 20 || [65,81,95,96].includes(code);
    const isHot        = temp > 38;
    const isCold       = temp < 12;
    const isFoggy      = [45,48].includes(code);
    const highHumidity = humidity > 80;
    const highWind     = windSpeed > 30;

    // ── Onion ────────────────────────────────────────────────────────
    {
        const actions: string[] = [];
        let level: Advisory['level'] = 'good';
        let title = 'Conditions suitable for onion growth';

        if (isHeavyRain) {
            level = 'danger';
            title = 'Heavy rain alert — risk of bulb rot!';
            actions.push('Ensure drainage channels are clear to prevent waterlogging.');
            actions.push('Avoid harvesting — wet bulbs rot quickly in storage.');
            actions.push('Delay transportation; wet roads increase damage.');
        } else if (highHumidity && isRainy) {
            level = 'warning';
            title = 'High fungal disease risk (Purple Blotch / Stemphylium Blight)';
            actions.push('Spray Mancozeb (2.5g/L) or Copper Oxychloride preventively.');
            actions.push('Improve air circulation in storage sheds.');
        } else if (isHot) {
            level = 'warning';
            title = 'Heat stress may affect bulb sizing';
            actions.push('Evening irrigation recommended — avoid daytime watering.');
            actions.push('Mulching reduces soil temperature by 5-8°C.');
        } else if (isFoggy) {
            level = 'warning';
            title = 'Fog increases thrips & mite activity';
            actions.push('Scout fields for thrips damage on leaves.');
            actions.push('Apply Spinosad (0.5 ml/L) if infestation found.');
        } else {
            actions.push('Good time for weeding and light irrigation.');
            actions.push('Check bulb development — harvest when tops fall over.');
        }
        advisories.push({ crop: 'Onion', emoji: '🧅', level, title, actions });
    }

    // ── Tomato ───────────────────────────────────────────────────────
    {
        const actions: string[] = [];
        let level: Advisory['level'] = 'good';
        let title = 'Favourable conditions for tomato';

        if (isHeavyRain || (isRainy && highHumidity)) {
            level = 'danger';
            title = 'High risk of Early Blight & Late Blight!';
            actions.push('Spray Cymoxanil + Mancozeb (3g/L) immediately.');
            actions.push('Remove and burn infected leaves — do NOT compost.');
            actions.push('Stake plants to keep fruit off wet soil.');
        } else if (isHot) {
            level = 'warning';
            title = 'Temperature above 35°C causes blossom drop';
            actions.push('Apply potassium nitrate (13:0:45) at 5 g/L as foliar spray.');
            actions.push('Shade net (35%) recommended during 12–3 PM.');
        } else if (isCold) {
            level = 'warning';
            title = 'Cold nights slow fruit ripening';
            actions.push('Cover seedlings at night with thin cloth.');
            actions.push('Delay transplanting if temp falls below 10°C.');
        } else {
            actions.push('Good time for staking and fruit thinning.');
            actions.push('Ideal for pesticide application — dry weather increases efficacy.');
        }
        advisories.push({ crop: 'Tomato', emoji: '🍅', level, title, actions });
    }

    // ── Potato ───────────────────────────────────────────────────────
    {
        const actions: string[] = [];
        let level: Advisory['level'] = 'good';
        let title = 'Suitable growing conditions for potato';

        if (isRainy && highHumidity) {
            level = 'danger';
            title = 'Late Blight (Phytophthora) alert — spreads rapidly in rain!';
            actions.push('Apply Metalaxyl + Mancozeb (2.5 g/L) urgently.');
            actions.push('Avoid overhead irrigation — use drip if possible.');
            actions.push('Ensure ridges are formed to prevent waterlogging at roots.');
        } else if (isHot) {
            level = 'warning';
            title = 'High temps above 30°C reduce tuber formation';
            actions.push('Irrigate in early morning to keep soil temp down.');
            actions.push('Avoid nitrogen fertilisers in heat — causes excessive foliage.');
        } else if (highWind) {
            level = 'warning';
            title = 'Strong wind can topple plants & spread aphids';
            actions.push('Inspect for aphid colonies on leaf underside.');
            actions.push('Apply Imidacloprid (0.5 ml/L) if aphids detected.');
        } else {
            actions.push('Good window for earthing up (hilling) around plants.');
            actions.push('Monitor for Colorado beetle — pick manually if small area.');
        }
        advisories.push({ crop: 'Potato', emoji: '🥔', level, title, actions });
    }

    // ── Soybean ──────────────────────────────────────────────────────
    {
        const actions: string[] = [];
        let level: Advisory['level'] = 'good';
        let title = 'Conditions suitable for soybean';

        if (isHeavyRain) {
            level = 'warning';
            title = 'Heavy rain may cause waterlogging damage to roots';
            actions.push('Open field drainage — soybean cannot tolerate >48h flooding.');
            actions.push('Delay post-emergence herbicide spray until fields dry.');
        } else if (isRainy) {
            level = 'good';
            title = 'Moderate rain beneficial for pod filling stage';
            actions.push('Good time for foliar urea spray (2%) at pod-filling stage.');
            actions.push('Avoid pesticide sprays — rain reduces effectiveness.');
        } else if (isHot && humidity < 50) {
            level = 'warning';
            title = 'Dry heat during pod filling reduces yield';
            actions.push('Critical: irrigate immediately if crop at R3-R5 growth stage.');
        } else {
            actions.push('Suitable for sowing in well-drained fields.');
            actions.push('Apply Rhizobium seed treatment for nitrogen fixation boost.');
        }
        advisories.push({ crop: 'Soybean', emoji: '🌿', level, title, actions });
    }

    return advisories;
}

const levelConfig = {
    danger:  { bg: 'bg-red-50 border-red-200',    icon: AlertTriangle, iconColor: 'text-red-500',    iconBg: 'bg-red-100',    badge: 'bg-red-100 text-red-700'    },
    warning: { bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500',  iconBg: 'bg-amber-100',  badge: 'bg-amber-100 text-amber-700' },
    good:    { bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-100', badge: 'bg-emerald-100 text-emerald-700' },
};

// ─── Component ─────────────────────────────────────────────────────
export const WeatherPage = () => {
    const navigate = useNavigate();
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    const fetchWeather = () => {
        setLoading(true);
        setError('');
        fetch(WEATHER_URL)
            .then(r => r.json())
            .then(d => {
                setWeather(d);
                setUpdatedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
                setLoading(false);
            })
            .catch(() => {
                setError('Unable to fetch live weather. Check internet connection.');
                setLoading(false);
            });
    };

    useEffect(() => { fetchWeather(); }, []);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const cur   = weather?.current;
    const daily = weather?.daily;
    const temp  = cur?.temperature_2m ?? 28;
    const hum   = cur?.relative_humidity_2m ?? 65;
    const wind  = cur?.wind_speed_10m ?? 10;
    const rain  = cur?.precipitation ?? 0;
    const code  = cur?.weather_code ?? 2;
    const { icon: curIcon, label: curLabel } = wmo(code);

    const advisories = weather ? getAdvisories(temp, hum, rain, wind, code) : [];

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-emerald-600" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Agri Weather</h1>
                        <p className="text-sm text-slate-500">Pune, Maharashtra · Live data from Open-Meteo</p>
                    </div>
                    <button onClick={fetchWeather} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full transition-colors">
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        {updatedAt ? `Updated ${updatedAt}` : 'Refresh'}
                    </button>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                        <p>Fetching live weather from Open-Meteo...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {!loading && weather && (
                    <>
                        {/* ── Current Weather Hero ── */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl mb-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12" />
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-blue-200 font-medium mb-1">Pune, Maharashtra</p>
                                    <h2 className="text-7xl font-black mb-1">{Math.round(temp)}°<span className="text-3xl font-light">C</span></h2>
                                    <p className="text-blue-100 text-lg mb-4">{curLabel}</p>
                                    <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                                        <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4" />{hum}% Humidity</span>
                                        <span className="flex items-center gap-1.5"><Wind className="w-4 h-4" />{wind} km/h Wind</span>
                                        <span className="flex items-center gap-1.5"><Thermometer className="w-4 h-4" />{rain} mm Rain</span>
                                    </div>
                                </div>
                                <div className="text-8xl drop-shadow-lg">{curIcon}</div>
                            </div>
                        </motion.div>

                        {/* ── 7-Day Forecast ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6"
                        >
                            <h3 className="text-slate-900 font-bold mb-4">7-Day Forecast</h3>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {daily?.time?.map((date: string, idx: number) => {
                                    const d     = new Date(date);
                                    const dCode = daily.weather_code[idx];
                                    const { icon } = wmo(dCode);
                                    const maxT    = Math.round(daily.temperature_2m_max[idx]);
                                    const minT    = Math.round(daily.temperature_2m_min[idx]);
                                    const rain7   = daily.precipitation_sum[idx];
                                    return (
                                        <div key={idx} className={`p-2 rounded-xl ${idx === 0 ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'} transition-colors`}>
                                            <p className="text-slate-500 text-[11px] font-medium mb-1">{idx === 0 ? 'Today' : days[d.getDay()]}</p>
                                            <div className="text-2xl mb-1">{icon}</div>
                                            <p className="text-slate-900 font-bold text-sm">{maxT}°</p>
                                            <p className="text-slate-400 text-[11px]">{minT}°</p>
                                            {rain7 > 1 && <p className="text-blue-400 text-[10px] mt-1">💧{rain7}mm</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* ── Crop-Specific Advisory ── */}
                        <div className="mb-2">
                            <h3 className="text-slate-900 font-bold text-lg mb-1 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-emerald-600" />
                                Crop Action Advisory
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Based on today's live conditions — what you should do right now for each crop
                            </p>
                        </div>

                        <div className="space-y-4">
                            {advisories.map((adv, idx) => {
                                const cfg  = levelConfig[adv.level];
                                const Icon = cfg.icon;
                                return (
                                    <motion.div
                                        key={adv.crop}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + idx * 0.08 }}
                                        className={`border rounded-2xl p-5 ${cfg.bg}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2.5 rounded-xl shrink-0 ${cfg.iconBg}`}>
                                                <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="text-xl">{adv.emoji}</span>
                                                    <h4 className="font-bold text-slate-900">{adv.crop}</h4>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${cfg.badge}`}>
                                                        {adv.level === 'good' ? 'All Clear' : adv.level === 'warning' ? 'Caution' : 'Action Needed'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 text-sm font-semibold mb-3">{adv.title}</p>
                                                <ul className="space-y-1.5">
                                                    {adv.actions.map((action, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                            <span className="text-slate-400 shrink-0 mt-0.5">→</span>
                                                            {action}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 justify-center">
                            <Info className="w-3 h-3" />
                            Weather data: Open-Meteo.com (free, open-source) · Advisory based on agronomic best practices
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
