import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  FileSpreadsheet,
  User,
  Zap,
  Building2
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Energy Monitoring', path: '/monitoring', icon: Activity },
    { name: 'AI Prediction', path: '/prediction', icon: Cpu },
    { name: 'Audit Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950/40">
        <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-wide block">SMART ENERGY</span>
          <span className="text-[10px] text-brand-400 font-medium tracking-wider uppercase">AI Building OS</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Core Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Pill */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/60 border border-slate-800">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-200">AI Grid Active</span>
        </div>
        <p className="text-[11px] text-slate-400">
          FastAPI RF Regressor connected on :8000
        </p>
      </div>
    </aside>
  );
}
