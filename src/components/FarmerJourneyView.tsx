import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Calendar,
  Sprout,
  CheckCircle,
  FileText,
  BarChart3,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { getFarmingHistory, addFarmingHistory, deduplicateById } from '../services/dataService';
import { FarmingHistoryRecord } from '../types';

export const FarmerJourneyView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  const [history, setHistory] = useState<FarmingHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [year, setYear] = useState('2026-27');
  const [season, setSeason] = useState('Kharif');
  const [cropName, setCropName] = useState('');
  const [areaAcres, setAreaAcres] = useState<number>(2.5);
  const [harvestYield, setHarvestYield] = useState('');
  const [notes, setNotes] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    const records = await getFarmingHistory(user?.uid || 'demo_farmer_ravi');
    setHistory(deduplicateById(records));
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    await addFarmingHistory({
      userId: user?.uid || 'demo_farmer_ravi',
      year,
      season,
      cropName,
      areaAcres,
      harvestYield: harvestYield || 'Normal harvest',
      notes,
    });

    setModalOpen(false);
    setCropName('');
    setHarvestYield('');
    setNotes('');
    await loadHistory();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Farm Records & Evolution</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">{t('navFarmingHistory')}</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Track past seasons, yield metrics, and soil insights over time to make data-backed crop decisions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Season Record</span>
        </button>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500">Seasons Logged</span>
            <h4 className="text-xl font-bold text-stone-900">{history.length} Seasons</h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500">Total Cultivated Area</span>
            <h4 className="text-xl font-bold text-stone-900">
              {history.reduce((acc, h) => acc + (h.areaAcres || 0), 0).toFixed(1)} Acres
            </h4>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-500">Primary Practice</span>
            <h4 className="text-xl font-bold text-stone-900">Multi-Cropping</h4>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {history.map((record, idx) => (
          <div
            key={`${record.id}-${idx}`}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg p-2 rounded-2xl bg-emerald-50 text-emerald-700 font-bold">
                  🌾
                </span>
                <div>
                  <h4 className="text-base font-bold text-stone-900">{record.cropName}</h4>
                  <span className="text-xs text-stone-500">
                    {record.season} Season • Year {record.year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl">
                  {record.areaAcres} Acres
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                  Yield: {record.harvestYield}
                </span>
              </div>
            </div>

            {record.notes && (
              <div className="bg-stone-50 p-3.5 rounded-2xl text-xs text-stone-700 leading-relaxed border border-stone-100">
                <strong className="text-stone-900 block font-semibold mb-0.5">Agronomic Notes & Lessons:</strong>
                {record.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Record Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">Add Seasonal Harvest Record</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid / Summer">Zaid (Summer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Crop Name & Variety *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groundnut (Kadiri-6) / Tomato (Desi)"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Cultivated Acres</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Harvest Yield</label>
                  <input
                    type="text"
                    placeholder="e.g. 28 Quintals / 15 Tons"
                    value={harvestYield}
                    onChange={(e) => setHarvestYield(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Field Practices & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Soil amendments, organic pest controls used, water availability..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
