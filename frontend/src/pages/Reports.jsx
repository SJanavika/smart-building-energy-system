import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  IndianRupee,
  Layers
} from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('MONTHLY');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getAllReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const newReport = await reportService.generateReport(selectedType);
      setSuccessMessage(`Successfully generated ${selectedType} Energy Audit Report!`);
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchReports();
    } catch (err) {
      alert('Error generating report: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async (type) => {
    try {
      await reportService.downloadPdf(type);
    } catch (err) {
      alert('Failed to download PDF report');
    }
  };

  const handleDownloadExcel = async (type) => {
    try {
      await reportService.downloadExcel(type);
    } catch (err) {
      alert('Failed to download Excel sheet');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Reports & Export Center</h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate comprehensive Daily, Weekly, and Monthly ESG energy audits with PDF and Excel export capabilities
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Generator Action Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Generate New Building Audit</h3>
            <p className="text-xs text-slate-500">
              Aggregates consumption telemetry, tariff costs, AI predictions, and optimization suggestions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-slate-300 p-1 bg-slate-50 text-xs font-semibold">
              {['DAILY', 'WEEKLY', 'MONTHLY'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    selectedType === type
                      ? 'bg-white text-brand-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? 'Compiling Audit...' : `Generate ${selectedType} Report`}
            </button>
          </div>
        </div>

        {/* Quick Instant Export Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-medium">Quick Export Current {selectedType} Snapshot:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadPdf(selectedType)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              Download PDF Report
            </button>
            <button
              onClick={() => handleDownloadExcel(selectedType)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Download Excel Spreadsheet
            </button>
          </div>
        </div>
      </div>

      {/* Generated Reports History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Generated Reports Archive</h3>
          <span className="text-xs text-slate-400">Recorded in MySQL 'reports' table</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Report ID</th>
                <th className="py-3 px-6">Report Name</th>
                <th className="py-3 px-6">Period</th>
                <th className="py-3 px-6">Consumption</th>
                <th className="py-3 px-6">Total Cost</th>
                <th className="py-3 px-6">Generated At</th>
                <th className="py-3 px-6 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">Loading audit history...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    No reports generated yet. Click above to generate your first audit.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-slate-400">#{r.id}</td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">{r.reportName}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-700">
                        {r.reportType}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      {r.totalConsumption?.toLocaleString()} kWh
                    </td>
                    <td className="py-3.5 px-6 font-bold text-teal-700">
                      ₹{r.totalCost?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {r.generatedDate ? new Date(r.generatedDate).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleDownloadPdf(r.reportType)}
                        title="Download PDF"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadExcel(r.reportType)}
                        title="Download Excel"
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-block"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
