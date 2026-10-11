import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { predictionService } from '../services/predictionService';
import MetricCard from '../components/MetricCard';
import RecommendationCard from '../components/RecommendationCard';
import DailyTrendChart from '../charts/DailyTrendChart';
import WeeklyTrendChart from '../charts/WeeklyTrendChart';
import MonthlyTrendChart from '../charts/MonthlyTrendChart';
import DevicePieChart from '../charts/DevicePieChart';
import {
  Zap,
  IndianRupee,
  Server,
  Cpu,
  RefreshCw,
  Lightbulb,
  Building,
  TrendingDown
} from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [sumData, recsData] = await Promise.all([
        dashboardService.getSummary(),
        predictionService.getRecommendations({ occupancy: 85, currentUsage: 165.0, hour: 14 })
      ]);
      setSummary(sumData);
      setRecommendations(recsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Aggregating smart meter telemetry & AI predictions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Energy Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry feeds, AI machine learning forecasting, and automated load optimization
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Syncing...' : 'Sync Telemetry'}
        </button>
      </div>

      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Energy Consumption"
          value={summary?.totalEnergyConsumption?.toLocaleString() || '0'}
          unit="kWh"
          subtext="Cumulative meter reading"
          icon={Zap}
          color="blue"
          trend="-4.2% vs target"
        />

        <MetricCard
          title="Total Energy Cost"
          value={`₹${summary?.totalEnergyCost?.toLocaleString() || '0'}`}
          subtext="Tariff rated @ ₹8.0 / kWh"
          icon={IndianRupee}
          color="teal"
          trend="Commercial billing"
        />

        <MetricCard
          title="Highest Consuming Device"
          value={summary?.highestConsumingDevice || 'Chiller Unit'}
          unit=""
          subtext={`${summary?.highestDeviceConsumption?.toLocaleString() || 0} kWh peak draw`}
          icon={Server}
          color="amber"
          trend="Primary HVAC load"
        />

        <MetricCard
          title="AI Predicted Energy Usage"
          value={summary?.aiPredictedEnergyUsage?.toLocaleString() || '180'}
          unit="kWh/hr"
          subtext={`Est. ₹${summary?.aiEstimatedCost?.toLocaleString() || '1,440'}/hr cost`}
          icon={Cpu}
          color="indigo"
          trend="RF Model confidence 96%"
        />
      </div>

      {/* Charts Grid: Row 1 (Daily Trend & Device Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Daily Consumption Trend</h3>
              <p className="text-xs text-slate-400">Past 7 days energy load and tariff trajectory</p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-brand-50 text-brand-700 font-semibold rounded-full border border-brand-100">
              Live Telemetry
            </span>
          </div>
          <DailyTrendChart data={summary?.dailyTrend || []} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Device Consumption</h3>
              <p className="text-xs text-slate-400">Load distribution by equipment type</p>
            </div>
          </div>
          <DevicePieChart data={summary?.deviceBreakdown || []} />
        </div>
      </div>

      {/* Charts Grid: Row 2 (Weekly Trend & Monthly Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Weekly Consumption Trend</h3>
              <p className="text-xs text-slate-400">Comparison across past 4 operational audit weeks</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">4-Week Rolling</span>
          </div>
          <WeeklyTrendChart data={summary?.weeklyTrend || []} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Monthly Consumption Trend</h3>
              <p className="text-xs text-slate-400">Seasonal commercial facility energy trends</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">H1 + H2 Trends</span>
          </div>
          <MonthlyTrendChart data={summary?.monthlyTrend || []} />
        </div>
      </div>

      {/* Smart Optimization Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">AI Optimization & Energy-Saving Advice</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Real-time heuristics & predictive optimization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.slice(0, 3).map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>
    </div>
  );
}
