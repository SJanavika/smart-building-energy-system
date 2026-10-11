import React from 'react';
import { Lightbulb, Zap, TrendingDown, CheckCircle2 } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  const { category, title, description, priority, estimatedSavingsKwh, estimatedSavingsCost, currency = '₹' } = recommendation;

  const priorityBadge = {
    HIGH: 'bg-rose-100 text-rose-700 border-rose-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }[priority] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{category}</span>
            <h4 className="text-base font-bold text-slate-800">{title}</h4>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${priorityBadge}`}>
          {priority} PRIORITY
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        {description}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <TrendingDown className="w-4 h-4" />
          <span>Est. Savings: <strong>{estimatedSavingsKwh} kWh</strong></span>
        </div>
        <div className="text-sm font-bold text-slate-900">
          Save {currency}{estimatedSavingsCost?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
