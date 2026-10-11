import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEVICE_OPTIONS } from '../utils/constants';

export default function EnergyDataModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    deviceName: '',
    floorNumber: 1,
    consumption: '',
    operatingHours: 12,
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        deviceName: initialData.deviceName || '',
        floorNumber: initialData.floorNumber || 1,
        consumption: initialData.consumption || '',
        operatingHours: initialData.operatingHours || 12,
        date: initialData.date || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        deviceName: DEVICE_OPTIONS[0],
        floorNumber: 1,
        consumption: '',
        operatingHours: 12,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.deviceName.trim()) errs.deviceName = 'Device name is required';
    if (formData.floorNumber === undefined || formData.floorNumber === '') errs.floorNumber = 'Floor is required';
    if (!formData.consumption || Number(formData.consumption) <= 0) errs.consumption = 'Valid positive kWh required';
    if (formData.operatingHours === undefined || Number(formData.operatingHours) < 0 || Number(formData.operatingHours) > 24) {
      errs.operatingHours = 'Hours must be between 0 and 24';
    }
    if (!formData.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      floorNumber: Number(formData.floorNumber),
      consumption: Number(formData.consumption),
      operatingHours: Number(formData.operatingHours)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? 'Edit Energy Record' : 'Log New Energy Data'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Device Name
            </label>
            <input
              type="text"
              list="device-options"
              value={formData.deviceName}
              onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
              placeholder="e.g. HVAC Chiller 1, Floor 2 AHU"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                errors.deviceName ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
              }`}
            />
            <datalist id="device-options">
              {DEVICE_OPTIONS.map((dev, idx) => (
                <option key={idx} value={dev} />
              ))}
            </datalist>
            {errors.deviceName && <p className="text-xs text-rose-500 mt-1">{errors.deviceName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Floor Number
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.floorNumber}
                onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.floorNumber && <p className="text-xs text-rose-500 mt-1">{errors.floorNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Consumption (kWh)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.consumption}
                onChange={(e) => setFormData({ ...formData, consumption: e.target.value })}
                placeholder="e.g. 154.20"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors.consumption ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                }`}
              />
              {errors.consumption && <p className="text-xs text-rose-500 mt-1">{errors.consumption}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Operating Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.operatingHours && <p className="text-xs text-rose-500 mt-1">{errors.operatingHours}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700 shadow-sm"
            >
              {initialData ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
