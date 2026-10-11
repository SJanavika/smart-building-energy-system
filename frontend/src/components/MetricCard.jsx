import React from 'react';

export default function MetricCard({ title, value, unit = '', subtext, icon: Icon, color = 'blue', trend }) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      badge: 'text-blue-700 bg-blue-100'
    },
    teal: {
      bg: 'bg-teal-50 text-teal-600',
      border: 'border-teal-100',
      badge: 'text-teal-700 bg-teal-100'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      badge: 'text-amber-700 bg-amber-100'
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'border-indigo-100',
      badge: 'text-indigo-700 bg-indigo-100'
    }
  }[color] || {
    bg: 'bg-slate-50 text-slate-600',
    border: 'border-slate-100',
    badge: 'text-slate-700 bg-slate-100'
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colorStyles.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{subtext}</span>
          {trend && (
            <span className={`px-2 py-0.5 rounded-full font-medium ${trend.startsWith('+') ? 'text-rose-700 bg-rose-50' : 'text-emerald-700 bg-emerald-50'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
