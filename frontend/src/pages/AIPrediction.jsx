import React, { useState } from 'react';
import { predictionService } from '../services/predictionService';
import RecommendationCard from '../components/RecommendationCard';
import {
  Cpu,
  Thermometer,
  Droplets,
  Users,
  Clock,
  IndianRupee,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function AIPrediction() {
  const [params, setParams] = useState({
    temperature: 35,
    humidity: 70,
    occupancy: 120,
    hour: 14,
    electricityRate: 8.0
  });

  const [prediction, setPrediction] = useState({
    predictedUsage: 180.25,
    electricityRate: 8.0,
    estimatedCost: 1442.0,
    unit: 'kWh',
    currency: '₹',
    formula: '180.25 kWh × ₹8.00 = ₹1442.00'
  });

  const [recommendations, setRecommendations] = useState([
    {
      id: 'REC-001',
      category: 'HVAC Optimization',
      title: 'Thermostat Setpoint Modulation',
      description: 'Under 35°C ambient temperature and 120 occupants, adjusting central chiller setpoint to 24°C yields ~18% compressor load reduction.',
      priority: 'HIGH',
      estimatedSavingsKwh: 32.4,
      estimatedSavingsCost: 259.2
    },
    {
      id: 'REC-002',
      category: 'Peak Shaving',
      title: 'Pre-Cooling Thermal Mass Shifting',
      description: 'At hour 14:00 peak grid tariff period, stage down non-critical air handling units by 15 minutes to avoid peak maximum demand penalties.',
      priority: 'MEDIUM',
      estimatedSavingsKwh: 18.0,
      estimatedSavingsCost: 144.0
    }
  ]);

  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const [predResult, recsResult] = await Promise.all([
        predictionService.predict(params),
        predictionService.getRecommendations({
          occupancy: params.occupancy,
          currentUsage: prediction?.predictedUsage || 180.0,
          hour: params.hour
        })
      ]);
      setPrediction(predResult);
      if (recsResult && recsResult.length > 0) {
        setRecommendations(recsResult);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
      // Heuristic fallback in case backend is offline
      const fallbackKwh = Math.round((25 + (params.temperature - 22) * 4.2 + params.occupancy * 0.38 + 15) * 100) / 100;
      const fallbackCost = Math.round(fallbackKwh * params.electricityRate * 100) / 100;
      setPrediction({
        predictedUsage: fallbackKwh,
        electricityRate: params.electricityRate,
        estimatedCost: fallbackCost,
        unit: 'kWh',
        currency: '₹',
        formula: `${fallbackKwh} kWh × ₹${params.electricityRate} = ₹${fallbackCost}`
      });
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (t, h, o, hr) => {
    const updated = {
      ...params,
      temperature: t,
      humidity: h,
      occupancy: o,
      hour: hr
    };
    setParams(updated);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Energy & Cost Predictor</h1>
        <p className="text-xs text-slate-500 mt-1">
          Machine Learning Random Forest Regressor predicts future hourly kWh load based on weather and building occupancy
        </p>
      </div>

      {/* Simulator Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 mr-2">Quick Scenarios:</span>
        <button
          onClick={() => setPreset(35, 70, 120, 14)}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-brand-300"
        >
          ☀️ Peak Summer Afternoon (35°C, 120 pax, 14:00)
        </button>
        <button
          onClick={() => setPreset(24, 85, 90, 10)}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-brand-300"
        >
          🌧️ Humid Monsoon Morning (24°C, 90 pax, 10:00)
        </button>
        <button
          onClick={() => setPreset(18, 45, 10, 22)}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-brand-300"
        >
          🌙 Winter Night Setback (18°C, 10 pax, 22:00)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Features Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Telemetric Environmental Inputs</h3>
              <p className="text-xs text-slate-400">Random Forest Regressor 4-Dimensional Feature Vector</p>
            </div>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-500" /> Ambient Temperature
                </span>
                <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {params.temperature} °C
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                step="0.5"
                value={params.temperature}
                onChange={(e) => setParams({ ...params, temperature: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Humidity */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-500" /> Relative Humidity
                </span>
                <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {params.humidity} %
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                step="1"
                value={params.humidity}
                onChange={(e) => setParams({ ...params, humidity: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Occupancy */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-500" /> Building Occupancy
                </span>
                <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {params.occupancy} People
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={params.occupancy}
                onChange={(e) => setParams({ ...params, occupancy: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Hour of Day */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" /> Operating Hour of Day
                </span>
                <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {String(params.hour).padStart(2, '0')}:00 hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                step="1"
                value={params.hour}
                onChange={(e) => setParams({ ...params, hour: Number(e.target.value) })}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Electricity Rate */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Electricity Tariff Rate (₹ / kWh)
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="50"
                  value={params.electricityRate}
                  onChange={(e) => setParams({ ...params, electricityRate: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Evaluating Model Ingestion...' : 'Execute AI Prediction Model'}
            </button>
          </form>
        </div>

        {/* Prediction Results & Cost Estimation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Prediction Display Card */}
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-brand-950 text-white p-7 rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Scikit-Learn Random Forest Regressor Prediction
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-2">
                <div>
                  <div className="text-xs uppercase tracking-widest text-brand-300 font-semibold">
                    Predicted Energy Usage
                  </div>
                  <div className="text-4xl font-extrabold text-white mt-1">
                    {prediction?.predictedUsage} <span className="text-xl font-normal text-brand-300">kWh</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Single-hour building baseline + HVAC + plug load</p>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                  <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                    Estimated Energy Cost
                  </div>
                  <div className="text-4xl font-extrabold text-emerald-300 mt-1">
                    ₹{prediction?.estimatedCost?.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Hourly operational expenditure</p>
                </div>
              </div>

              {/* Module 5: Cost Estimation Formula Box */}
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-xs text-brand-200 font-semibold mb-1">
                  Cost Estimation Formula:
                </div>
                <div className="font-mono text-sm text-white">
                  Estimated Cost = Predicted Usage × Electricity Rate
                </div>
                <div className="mt-1 font-mono text-xs text-brand-300">
                  {prediction?.formula || `${prediction?.predictedUsage} kWh × ₹${params.electricityRate} = ₹${prediction?.estimatedCost}`}
                </div>
              </div>
            </div>
          </div>

          {/* Module 6: Smart Recommendations tailored to prediction */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              Dynamic AI Recommendations for Current Condition
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
