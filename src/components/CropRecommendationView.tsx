import React, { useState } from 'react';
import {
  Sparkles,
  Droplet,
  ShieldCheck,
  TrendingUp,
  Bookmark,
  Check,
  RefreshCw,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { saveCropRecommendation } from '../services/dataService';
import { RecommendedCrop, CropRecommendationRecord } from '../types';

export const CropRecommendationView: React.FC = () => {
  const { user, farmerProfile } = useAuth();
  const { language, t } = useI18n();

  // Inputs
  const [location, setLocation] = useState(farmerProfile?.locationName || 'Tirupati, Andhra Pradesh');
  const [landSize, setLandSize] = useState<number>(farmerProfile?.farmSizeAcres || 3);
  const [soilType, setSoilType] = useState(farmerProfile?.soilType || 'Red Sandy Loam');
  const [waterAvailability, setWaterAvailability] = useState('Medium');
  const [irrigationType, setIrrigationType] = useState('Borewell with Drip');
  const [season, setSeason] = useState('Kharif (Monsoon)');
  const [previousCrop, setPreviousCrop] = useState('Groundnut / Fallow');
  const [budget, setBudget] = useState('Moderate (₹25,000 - ₹45,000/acre)');
  const [riskPreference, setRiskPreference] = useState('Low to Moderate');

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedCrop[]>([]);
  const [climateAdvice, setClimateAdvice] = useState<string>('');
  const [disclaimer, setDisclaimer] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'compare'>('cards');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGetRecommendation = async () => {
    setLoading(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          landSize,
          soilType,
          waterAvailability,
          irrigationType,
          season,
          previousCrop,
          budget,
          riskPreference,
          language,
        }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();

      setRecommendations(data.recommendations || []);
      setClimateAdvice(data.climateAdvice || '');
      setDisclaimer(data.disclaimer || '');
    } catch (err) {
      console.error(err);
      setErrorMessage(t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecommendation = async () => {
    if (!recommendations.length) return;
    const recRecord: CropRecommendationRecord = {
      userId: user?.uid || 'guest_farmer',
      location,
      landSize,
      soilType,
      season,
      waterAvailability,
      recommendations,
      climateAdvice,
      disclaimer,
      createdAt: new Date().toISOString(),
    };

    await saveCropRecommendation(recRecord);
    setSavedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multilingual Agri-Intelligence</span>
        </div>
        <h2 className="text-2xl font-bold font-serif">{t('navCropRec')}</h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
          Get ranked, climate-tailored crop recommendations for your specific field conditions, soil profile, and water capacity.
        </p>
      </div>

      {/* Input Parameters Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <span>🌱</span> Farm & Environmental Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">{t('labelLocation')}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">{t('labelLandSize')}</label>
            <input
              type="number"
              value={landSize}
              onChange={(e) => setLandSize(parseFloat(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
              step="0.5"
              min="0.5"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">{t('labelSoilType')}</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="Red Sandy Loam">Red Sandy Loam (ఎర్ర నేల)</option>
              <option value="Black Cotton Soil">Black Cotton Soil (నల్ల రేగడి)</option>
              <option value="Clayey Loam">Clayey Loam (బంకమట్టి నేల)</option>
              <option value="Alluvial Soil">Alluvial Soil (ఒండ్రు నేల)</option>
              <option value="Laterite / Gravelly">Laterite / Gravelly (ఎర్ర కంకర నేల)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">{t('labelWaterAvailability')}</label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="Abundant (Perennial canal/bore)">Abundant (సమృద్ధిగా నీరు)</option>
              <option value="Medium (Adequate borewell)">Medium (మధ్యస్థం)</option>
              <option value="Limited (Water conservation needed)">Limited (పరిమితం / పొదుపు అవసరం)</option>
              <option value="Rainfed (Monsoon dependent)">Rainfed (పూర్తిగా వర్షాధారం)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">{t('labelIrrigation')}</label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="Borewell with Drip">Drip Irrigation (బిందు సేద్యం)</option>
              <option value="Sprinkler System">Sprinkler (తుంపర సేద్యం)</option>
              <option value="Furrow / Basin Flood">Channel / Furrow (కాలువ తడులు)</option>
              <option value="Rainfed Only">Rainfed Only (వర్షాధారం)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">{t('labelSeason')}</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="Kharif (Monsoon Season)">Kharif (ఖరీఫ్ - జూన్ నుండి అక్టోబర్)</option>
              <option value="Rabi (Winter Season)">Rabi (రబీ - అక్టోబర్ నుండి మార్చి)</option>
              <option value="Zaid / Summer">Zaid / Summer (వేసవి - మార్చి నుండి మే)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-stone-100">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>AI automatically personalizes responses in {language.toUpperCase()}</span>
          </div>

          <button
            type="button"
            onClick={handleGetRecommendation}
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('actionAnalyzing')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('actionGetRec')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {recommendations.length > 0 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
          {/* Controls: View toggle & Save */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-800">
                Top {recommendations.length} Suitable Crops
              </span>
              <div className="inline-flex bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    viewMode === 'cards' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
                  }`}
                >
                  Cards View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compare')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    viewMode === 'compare' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
                  }`}
                >
                  {t('actionCompareCrops')}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveRecommendation}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                savedSuccess
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t('actionSaved')}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>{t('actionSaveRec')}</span>
                </>
              )}
            </button>
          </div>

          {climateAdvice && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-medium">
              💡 <span className="font-bold">Seasonal Climate Context:</span> {climateAdvice}
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.map((crop, idx) => (
                <div
                  key={crop.id || idx}
                  className="bg-white rounded-3xl border border-stone-200 hover:border-emerald-400 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Rank #{idx + 1}
                        </span>
                        <h4 className="text-lg font-bold text-stone-900 mt-1">
                          {crop.cropName}
                        </h4>
                        {crop.scientificName && (
                          <span className="text-xs text-stone-400 italic block">
                            {crop.scientificName}
                          </span>
                        )}
                      </div>

                      <div className="text-center p-2 rounded-2xl bg-emerald-50 border border-emerald-200 min-w-14">
                        <span className="text-lg font-black text-emerald-800 leading-none">
                          {crop.suitabilityScore}%
                        </span>
                        <span className="text-[9px] uppercase font-bold text-emerald-600 block mt-0.5">
                          Suitability
                        </span>
                      </div>
                    </div>

                    {/* Metric Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Water</span>
                        <span className="font-bold text-stone-800">{crop.waterRequirement}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Risk</span>
                        <span className="font-bold text-stone-800">{crop.riskLevel}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Duration</span>
                        <span className="font-bold text-stone-800">{crop.durationDays}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Est. Yield</span>
                        <span className="font-bold text-emerald-800">{crop.expectedYield}</span>
                      </div>
                    </div>

                    {/* Why this crop */}
                    <div>
                      <span className="text-xs font-bold text-stone-800 block mb-1.5">
                        Why this crop?
                      </span>
                      <ul className="space-y-1.5">
                        {crop.whyThisCrop.map((pt, pIdx) => (
                          <li key={pIdx} className="text-xs text-stone-600 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-emerald-500 font-bold shrink-0">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100">
                    <span className="text-[11px] text-stone-500 block leading-tight">
                      <strong className="text-stone-700">Best Window:</strong> {crop.bestSowingWindow || 'Timely Kharif/Rabi onset'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Comparison Matrix View (Section 11) */
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                    <tr>
                      <th className="p-4">Crop Parameter</th>
                      {recommendations.map((crop, idx) => (
                        <th key={idx} className="p-4 text-emerald-950 font-bold text-sm min-w-44">
                          {crop.cropName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="p-4 font-bold text-stone-800 bg-stone-50/40">Suitability Index</td>
                      {recommendations.map((c, i) => (
                        <td key={i} className="p-4 font-extrabold text-emerald-700 text-sm">
                          {c.suitabilityScore}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-800 bg-stone-50/40">Water Requirement</td>
                      {recommendations.map((c, i) => (
                        <td key={i} className="p-4 text-stone-700 font-medium">
                          {c.waterRequirement}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-800 bg-stone-50/40">Soil Compatibility</td>
                      {recommendations.map((c, i) => (
                        <td key={i} className="p-4 text-stone-700 font-medium">
                          {c.soilCompatibility}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-800 bg-stone-50/40">Risk Level</td>
                      {recommendations.map((c, i) => (
                        <td key={i} className="p-4 text-stone-700 font-medium">
                          {c.riskLevel}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-800 bg-stone-50/40">Growing Period</td>
                      {recommendations.map((c, i) => (
                        <td key={i} className="p-4 text-stone-700 font-medium">
                          {c.durationDays}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-800 bg-stone-50/40">Expected Yield</td>
                      {recommendations.map((c, i) => (
                        <td key={i} className="p-4 text-emerald-800 font-bold">
                          {c.expectedYield}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-stone-800 bg-stone-50/40">Estimated Realization</td>
                      {recommendations.map((c, i) => (
                        <td key={i} className="p-4 text-stone-700 font-semibold">
                          {c.estimatedProfit || 'Good returns based on local mandis'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {disclaimer && (
            <p className="text-[11px] text-stone-500 text-center italic mt-2">
              {disclaimer}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
