import React, { useState, useEffect } from 'react';
import { energyService } from '../services/energyService';
import EnergyDataModal from '../components/EnergyDataModal';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Calendar,
  Zap,
  Clock,
  Download
} from 'lucide-react';

export default function EnergyMonitoring() {
  const [records, setRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [deviceFilter, setDeviceFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dropdown options
  const [availableDevices, setAvailableDevices] = useState([]);
  const [availableFloors, setAvailableFloors] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchRecords = async (page = 0) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10,
        device: deviceFilter || undefined,
        floor: floorFilter !== '' ? Number(floorFilter) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const res = await energyService.getRecords(params);
      setRecords(res.content || []);
      setTotalPages(res.totalPages || 1);
      setCurrentPage(res.currentPage || 0);
      setTotalItems(res.totalItems || 0);
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [devs, flrs] = await Promise.all([
        energyService.getDistinctDevices(),
        energyService.getDistinctFloors()
      ]);
      setAvailableDevices(devs || []);
      setAvailableFloors(flrs || []);
    } catch (e) {
      console.error('Error fetching options', e);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchRecords(0);
  }, [deviceFilter, floorFilter, startDate, endDate]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete telemetry record #${id}?`)) {
      try {
        await energyService.deleteRecord(id);
        fetchRecords(currentPage);
        fetchOptions();
      } catch (err) {
        alert('Failed to delete record: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingRecord) {
        await energyService.updateRecord(editingRecord.id, formData);
      } else {
        await energyService.createRecord(formData);
      }
      setIsModalOpen(false);
      fetchRecords(currentPage);
      fetchOptions();
    } catch (err) {
      alert('Error saving record: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleResetFilters = () => {
    setDeviceFilter('');
    setFloorFilter('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Energy Consumption Monitoring</h1>
          <p className="text-xs text-slate-500 mt-1">
            Log, inspect, and manage building zone telemetry, operating hours, and meter records
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Energy Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Device Search / Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Filter By Device
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search or pick device..."
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Floor Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Filter By Floor
            </label>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Building Floors</option>
              {availableFloors.map((flr) => (
                <option key={flr} value={flr}>Floor {flr}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {(deviceFilter || floorFilter || startDate || endDate) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Active filter results: {totalItems} matches</span>
            <button
              onClick={handleResetFilters}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Telemetry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Device / Sub-System</th>
                <th className="py-3.5 px-5">Floor</th>
                <th className="py-3.5 px-5">Consumption</th>
                <th className="py-3.5 px-5">Hours</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Est. Cost</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="mt-2 text-xs">Loading records...</p>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No energy consumption records found. Click <strong>"Log Energy Record"</strong> to create one.
                  </td>
                </tr>
              ) : (
                records.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-slate-400">#{row.id}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                      {row.deviceName}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        Floor {row.floorNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {row.consumption?.toFixed(2)} <span className="font-normal text-slate-400">kWh</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {row.operatingHours} hrs
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-teal-700">
                      ₹{(row.consumption * 8.0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(row)}
                        title="Edit record"
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        title="Delete record"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing Page <strong>{currentPage + 1}</strong> of <strong>{totalPages || 1}</strong> ({totalItems} total telemetry entries)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRecords(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchRecords(currentPage + 1)}
              disabled={currentPage + 1 >= totalPages}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <EnergyDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
}
