import React from 'react';
import {
  Sparkles,
  Camera,
  Bot,
  CloudSun,
  Calendar,
  Package,
  TrendingUp,
  BookOpen,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Droplets,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

interface FarmerDashboardProps {
  onNavigate: (tab: string) => void;
  activeProduceCount: number;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onNavigate,
  activeProduceCount,
}) => {
  const { user, farmerProfile } = useAuth();
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <span>👨‍🌾 {farmerProfile?.farmName || 'Family Homestead Farm'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {farmerProfile?.locationName || 'Tirupati Rural'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white leading-tight">
            {t('tagline')}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {t('secondaryTagline')}
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('crop-recommendation')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('actionGetRec')}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('crop-scanner')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>{t('actionScanCrop')}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>{t('navAiAssistant')}</span>
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Farm Land Size
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-stone-900">
              {farmerProfile?.farmSizeAcres || 3}
            </span>
            <span className="text-xs text-stone-500 font-semibold">Acres</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1 truncate">
            {farmerProfile?.soilType || 'Red Sandy Loam'}
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Active Harvest Listings
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700">
              {activeProduceCount}
            </span>
            <span className="text-xs text-stone-500 font-semibold">items</span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium block mt-1">
            Visible to local citizens
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Current Crops
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-extrabold text-stone-900 truncate">
              {farmerProfile?.currentCrops.split(',')[0] || 'Groundnut'}
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium block mt-1">
            Kharif Season Cycle
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Farming Intelligence
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-emerald-800">
              100%
            </span>
            <span className="text-xs text-stone-500 font-semibold">Active</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block mt-1">
            Gemini Multilingual AI
          </span>
        </div>
      </div>

      {/* Feature Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Crop Recommendation */}
        <div
          onClick={() => onNavigate('crop-recommendation')}
          className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                {t('navCropRec')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Ranked crop recommendations based on your soil, water availability, season, and market viability.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mt-4 pt-3 border-t border-stone-100">
            <span>{t('actionGetRec')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. Crop Scanner */}
        <div
          onClick={() => onNavigate('crop-scanner')}
          className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
                {t('navCropScan')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Capture leaves with camera to check for pests, fungal spots, or nutrient stress via Gemini vision.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-teal-700 mt-4 pt-3 border-t border-stone-100">
            <span>{t('actionScanCrop')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. AI Assistant */}
        <div
          onClick={() => onNavigate('ai-assistant')}
          className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-indigo-700 transition-colors">
                {t('navAiAssistant')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Speak or type in your native language. Context-aware advice tailored to your 3-acre farm.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 mt-4 pt-3 border-t border-stone-100">
            <span>{t('actionAskVoice')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 4. Weather & Climate */}
        <div
          onClick={() => onNavigate('weather')}
          className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-sky-700 transition-colors">
                {t('navWeather')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Agri-meteorological forecasts, rainfall trend indices, and spray window advisories.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-sky-700 mt-4 pt-3 border-t border-stone-100">
            <span>View 7-Day Forecast</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 5. Crop Calendar */}
        <div
          onClick={() => onNavigate('crop-calendar')}
          className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                {t('navCropCalendar')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Growth stage timelines, sowing schedules, and weather-sensitive vulnerability warnings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-4 pt-3 border-t border-stone-100">
            <span>Explore Timeline</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 6. My Produce Listing */}
        <div
          onClick={() => onNavigate('my-produce')}
          className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-green-700 transition-colors">
                {t('navMyProduce')}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Post your groundnut, tomato, or rice harvests directly for nearby citizens to buy.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-green-700 mt-4 pt-3 border-t border-stone-100">
            <span>{t('actionAddProduce')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
