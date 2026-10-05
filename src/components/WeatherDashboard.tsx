import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Compass,
  AlertTriangle,
  TrendingUp,
  Calendar,
  CloudDrizzle,
  CheckCircle,
  BarChart2,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const WeatherDashboard: React.FC = () => {
  const { t } = useI18n();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather?location=Tirupati%2C%20Andhra%20Pradesh')
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Weather fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !weatherData) {
    return (
      <div className="p-12 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
        Loading agricultural meteorology data...
      </div>
    );
  }

  const { current, forecast, trends, advisories } = weatherData;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-800 to-emerald-900 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md mb-2">
              <CloudSun className="w-3.5 h-3.5" />
              <span>Agri-Meteorological Intelligence</span>
            </div>
            <h2 className="text-2xl font-bold font-serif">{t('weatherTitle')}</h2>
            <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
              {weatherData.location} • {weatherData.label}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/20 sm:pl-4">
            <span className="text-3xl font-extrabold">{current.temperature}°C</span>
            <span className="block text-xs text-sky-200">Feels like {current.feelsLike}°C • {current.condition}</span>
          </div>
        </div>
      </div>

      {/* Spray and Farming Advisory Alert Box */}
      {advisories && advisories.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t('weatherSprayAdvisory')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {advisories.map((adv: string, idx: number) => (
              <div key={idx} className="bg-white/80 p-3 rounded-xl border border-amber-100 text-xs text-stone-800 leading-relaxed flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{adv}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>{t('weatherHumidity')}</span>
          </div>
          <span className="text-lg font-bold text-stone-900">{current.humidity}%</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Dew point {current.dewPoint}°C</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span>{t('weatherRain')}</span>
          </div>
          <span className="text-lg font-bold text-stone-900">{current.rainfallToday} mm</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">Light showers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
            <Wind className="w-4 h-4 text-teal-500" />
            <span>{t('weatherWind')}</span>
          </div>
          <span className="text-lg font-bold text-stone-900">{current.windSpeed} km/h</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Dir: {current.windDirection}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>{t('weatherSoilMoisture')}</span>
          </div>
          <span className="text-xs font-bold text-emerald-800">{current.soilMoisture}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Depth 0-15cm</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>ET Loss</span>
          </div>
          <span className="text-lg font-bold text-stone-900">{current.evapotranspiration}</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Water balance</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
            <Sun className="w-4 h-4 text-orange-500" />
            <span>UV Index</span>
          </div>
          <span className="text-lg font-bold text-stone-900">{current.uvIndex} (High)</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Peak 11am-3pm</span>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <span>📅</span> {t('weather7Day')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((f: any, idx: number) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-emerald-50/70 border-emerald-300 font-medium'
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <span className="text-[11px] font-bold text-stone-600 block">{f.day}</span>
              <div className="my-2 flex justify-center text-emerald-600">
                {f.icon.includes('rain') ? (
                  <CloudRain className="w-7 h-7 text-blue-500" />
                ) : f.icon.includes('sun') ? (
                  <Sun className="w-7 h-7 text-amber-500" />
                ) : (
                  <CloudSun className="w-7 h-7 text-emerald-600" />
                )}
              </div>
              <div className="text-xs font-bold text-stone-900">
                {f.tempMax}° / {f.tempMin}°
              </div>
              <span className="text-[10px] text-blue-600 font-semibold block mt-1">
                💧 {f.rainProb}% rain
              </span>
              <span className="text-[10px] text-stone-500 block truncate mt-0.5">
                {f.condition}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Rainfall Trend Chart (mm) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>{t('weatherRainTrend')}</span>
          </h3>
          <span className="text-xs text-stone-400">Actual vs Historical Normal</span>
        </div>

        <div className="grid grid-cols-6 gap-3 items-end h-40 pt-4 px-2 border-b border-stone-100">
          {trends.monthlyRainfall.map((m: any, idx: number) => {
            const maxVal = 200;
            const actualH = (m.rainfall / maxVal) * 100;
            const normalH = (m.normal / maxVal) * 100;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="flex items-end gap-1.5 h-full w-full justify-center">
                  <div
                    style={{ height: `${actualH}%` }}
                    className="w-4 sm:w-6 bg-emerald-600 rounded-t-lg transition-all group-hover:bg-emerald-700 relative"
                    title={`Actual: ${m.rainfall}mm`}
                  >
                    <span className="hidden group-hover:block absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-stone-900 text-white px-1 rounded font-bold">
                      {m.rainfall}
                    </span>
                  </div>
                  <div
                    style={{ height: `${normalH}%` }}
                    className="w-3 sm:w-4 bg-stone-200 rounded-t-lg transition-all"
                    title={`Normal: ${m.normal}mm`}
                  />
                </div>
                <span className="text-[10px] font-bold text-stone-600 mt-2 block">{m.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-stone-500 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
            <span>Current Year (mm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-stone-300 rounded-sm"></div>
            <span>30-Year Normal (mm)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
