import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Eye,
  Users,
  Package,
  Layers,
} from 'lucide-react';
import { getListingReports, deleteProduceListing, deduplicateById } from '../services/dataService';
import { ListingReportRecord } from '../types';

export const AdminModerationView: React.FC = () => {
  const [reports, setReports] = useState<ListingReportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    const data = await getListingReports();
    setReports(deduplicateById(data));
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleResolve = (id?: string) => {
    if (!id) return;
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' as const } : r))
    );
  };

  const handleRemoveProduce = async (produceId: string, reportId?: string) => {
    await deleteProduceListing(produceId);
    handleResolve(reportId);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-800 to-stone-900 rounded-3xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold backdrop-blur-md mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust & Safety Console</span>
        </div>
        <h2 className="text-2xl font-bold font-serif">Platform Moderation & Reports</h2>
        <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
          Review community reports regarding inaccurate pricing, location anomalies, or suspicious produce listings.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-semibold block">Pending Reports</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
            {reports.filter((r) => r.status === 'pending').length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-semibold block">Resolved Reports</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
            {reports.filter((r) => r.status === 'resolved').length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-semibold block">Active Produce Nodes</span>
          <span className="text-2xl font-extrabold text-stone-900 mt-1 block">12</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-semibold block">Protected Citizens</span>
          <span className="text-2xl font-extrabold text-stone-900 mt-1 block">100% Direct</span>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Reported Listings Queue</span>
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-stone-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No active flags or reports in queue.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {reports.map((report, idx) => (
              <div key={`${report.id}-${idx}`} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        report.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {report.status}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">{report.produceTitle}</h4>
                  </div>
                  <p className="text-xs text-stone-600">
                    <strong className="text-stone-700">Reason:</strong> {report.reason} • {report.details}
                  </p>
                  <span className="text-[10px] text-stone-400 block">
                    Reported on: {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {report.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleResolve(report.id)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl transition-colors"
                    >
                      Dismiss / Mark Safe
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveProduce(report.produceId, report.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Listing</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
