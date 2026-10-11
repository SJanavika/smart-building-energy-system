import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Shield, Mail, Calendar, Key, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Operator Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Account credentials, role-based access security parameters, and authentication status
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Header */}
        <div className="h-28 bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-700 p-6 flex items-end">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg translate-y-8 flex items-center justify-center">
            <div className="w-full h-full rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-black text-2xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </div>

        <div className="pt-12 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Administrator'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
                  <Shield className="w-3 h-3" />
                  {user?.role || 'ROLE_ADMIN'}
                </span>
                <span className="text-xs text-slate-400">• Smart Building Certified</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              <span>JWT Bearer Token Authenticated</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 font-semibold uppercase">Registered Email</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium text-slate-800">
                <Mail className="w-4 h-4 text-brand-600" />
                <span>{user?.email || 'admin@smartbuilding.io'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 font-semibold uppercase">Access Level</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium text-slate-800">
                <Key className="w-4 h-4 text-brand-600" />
                <span>Full Telemetry Read & Write + Model Predict</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
