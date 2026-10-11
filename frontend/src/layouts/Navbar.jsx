import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Bell, ShieldCheck, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-slate-800">
          Smart Building Energy Management System
        </h2>
        <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
          <Zap className="w-3 h-3 text-brand-600" /> Smart City Campus
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info & Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name || 'Administrator'}
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
              <ShieldCheck className="w-3 h-3 text-brand-600" />
              <span>{user?.role || 'ROLE_ADMIN'}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
