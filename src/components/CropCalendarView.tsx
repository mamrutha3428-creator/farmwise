import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Droplets,
  Sun,
  ShieldCheck,
  ChevronRight,
  Sprout,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface CropStage {
  phase: string;
  days: string;
  title: string;
  description: string;
  activities: string[];
  weatherAlert: string;
  icon: string;
}

interface CropCalendarData {
  cropName: string;
  sowingWindow: string;
  duration: string;
  expectedHarvest: string;
  stages: CropStage[];
}

export const CropCalendarView: React.FC = () => {
  const { language, t } = useI18n();
  const [selectedCropKey, setSelectedCropKey] = useState<string>('groundnut');

  const calendars: Record<string, CropCalendarData> = {
    groundnut: {
      cropName: 'Groundnut (వేరుశనగ / मूंगफली)',
      sowingWindow: 'Mid-June to July (Kharif) or Oct-Nov (Rabi)',
      duration: '105 - 115 Days',
      expectedHarvest: 'October - November',
      stages: [
        {
          phase: 'Phase 1',
          days: 'Days 1 - 15',
          title: t('stageSowing'),
          description: 'Seed selection, biological seed treatment, furrow sowing at 30x10 cm spacing.',
          activities: [
            'Treat seeds with Trichoderma viride (4g/kg) and Rhizobium culture',
            'Ensure adequate subsoil moisture before placing seeds 5cm deep',
            'Light irrigation if dry sowing was practiced',
          ],
          weatherAlert: 'Avoid sowing immediately before forecasted heavy rain to prevent seed rot.',
          icon: '🌱',
        },
        {
          phase: 'Phase 2',
          days: 'Days 16 - 45',
          title: t('stageVegetative'),
          description: 'Branching, vegetative development, and critical mechanical weeding.',
          activities: [
            'First inter-cultivation and hand weeding at 20-25 days after sowing',
            'Apply gypsum (200 kg/acre) around 40-45 DAS for pod calcium uptake',
            'Scout for early leaf spot and aphids',
          ],
          weatherAlert: 'Sunny dry weather favors weeding. Avoid disturbing soil when wet.',
          icon: '🌿',
        },
        {
          phase: 'Phase 3',
          days: 'Days 46 - 75',
          title: t('stageFlowering'),
          description: 'Peak yellow flowering and peg penetration into topsoil.',
          activities: [
            'CRITICAL: Strictly stop inter-cultivation/hoeing once pegs start entering soil',
            'Maintain optimal soil moisture — pegging requires moist loose soil',
            'Install yellow sticky traps for vector control',
          ],
          weatherAlert: 'Moisture stress during peg entry severely reduces pod yield by up to 40%.',
          icon: '🌻',
        },
        {
          phase: 'Phase 4',
          days: 'Days 76 - 95',
          title: t('stageGrainFilling'),
          description: 'Pod expansion and kernel oil synthesis.',
          activities: [
            'Provide protective irrigation if rain fails for more than 10 days',
            'Monitor for Cercospora leaf spot (spray 5% neem extract if initial symptoms appear)',
            'Check soil looseness around root zone',
          ],
          weatherAlert: 'Intermittent sunshine and mild moisture support high oil content.',
          icon: '🌾',
        },
        {
          phase: 'Phase 5',
          days: 'Days 96 - 115',
          title: t('stageHarvest'),
          description: 'Maturity, pulling pods, drying, and grading.',
          activities: [
            'Check maturity: Inner shell turns dark brown/black with prominent kernel veins',
            'Pull plants when soil has light moisture; do not pull in bone-dry soil to avoid pod loss',
            'Sun-dry pods for 5-7 days until moisture drops below 9%',
          ],
          weatherAlert: 'Ensure pods are completely dried before bagging to prevent aflatoxin mold.',
          icon: '🧺',
        },
      ],
    },
    tomato: {
      cropName: 'Tomato (టమోటా / टमाटर)',
      sowingWindow: 'August to October (Winter crop) or Dec-Jan (Summer)',
      duration: '90 - 120 Days',
      expectedHarvest: 'Continuous pickings from Day 65 onwards',
      stages: [
        {
          phase: 'Phase 1',
          days: 'Days 1 - 25',
          title: 'Nursery & Seedling Raising',
          description: 'Pro-tray nursery raising with shade net protection.',
          activities: [
            'Sow hybrid seeds in 98-cell pro-trays filled with sterile cocopeat',
            'Drench with bio-fungicide to prevent damping-off',
            'Harden seedlings 3 days prior to transplanting',
          ],
          weatherAlert: 'Protect nursery trays from driving thunderstorms and scorching direct sun.',
          icon: '🌱',
        },
        {
          phase: 'Phase 2',
          days: 'Days 26 - 50',
          title: 'Transplanting & Staking',
          description: 'Field transplanting on silver-black mulch with drip lines.',
          activities: [
            'Transplant in evening hours at 90x60 cm spacing on raised beds',
            'Install bamboo stakes and trellis wires for vine training',
            'Prune side suckers up to 30 cm height to improve airflow',
          ],
          weatherAlert: 'High humidity increases early blight risk. Keep foliage airy.',
          icon: '🌿',
        },
        {
          phase: 'Phase 3',
          days: 'Days 51 - 75',
          title: 'Flowering & Fruit Setting',
          description: 'Flower clusters, bumblebee visitation, and fruit formation.',
          activities: [
            'Maintain consistent drip irrigation to prevent blossom end rot (calcium deficiency)',
            'Install pheromone traps for Helicoverpa fruit borer',
            'Foliar spray of micronutrient mix at early fruit set',
          ],
          weatherAlert: 'Temperatures above 35°C cause blossom drop. Provide light misting if needed.',
          icon: '🍅',
        },
        {
          phase: 'Phase 4',
          days: 'Days 76 - 120',
          title: 'Harvest & Local Market Supply',
          description: 'Multi-stage selective hand-picking at breaker/pink stage.',
          activities: [
            'Harvest fruits early morning when ambient temperatures are cool',
            'Grade by size and pack into ventilated plastic crates',
            'List available crates on FarmWise for nearby citizens and buyers',
          ],
          weatherAlert: 'Harvest before anticipated heavy rain to prevent skin splitting.',
          icon: '🧺',
        },
      ],
    },
    rice: {
      cropName: 'Rice / Paddy (వరి / धान)',
      sowingWindow: 'June - July (Kharif) or Nov - Dec (Rabi)',
      duration: '125 - 140 Days',
      expectedHarvest: 'November - December',
      stages: [
        {
          phase: 'Phase 1',
          days: 'Days 1 - 25',
          title: 'Nursery & Land Puddling',
          description: 'Raised nursery bed preparation and field puddling.',
          activities: [
            'Sprout seeds and sow on wet bed nursery',
            'Puddle main field thoroughly with green manure incorporation',
            'Transplant 2-3 seedlings per hill at 20x15 cm spacing',
          ],
          weatherAlert: 'Standing water of 2 cm is essential during transplanting week.',
          icon: '🌱',
        },
        {
          phase: 'Phase 2',
          days: 'Days 26 - 60',
          title: 'Tillering & Vegetative Growth',
          description: 'Active tillering and weed management.',
          activities: [
            'Use cono-weeder at 15 and 30 DAT to incorporate weeds and aerate roots',
            'Maintain alternate wetting and drying (AWD) to save 30% water',
            'Monitor for stem borer and leaf folder',
          ],
          weatherAlert: 'Intermittent water drying reduces methane emissions and boosts root vigor.',
          icon: '🌿',
        },
        {
          phase: 'Phase 3',
          days: 'Days 61 - 95',
          title: 'Panicle Initiation & Flowering',
          description: 'Booting, heading, and anthesis.',
          activities: [
            'Maintain shallow 3-5 cm water layer from panicle emergence through grain filling',
            'Scout for blast symptoms or brown planthopper at base of tillers',
            'Do not spray any chemicals during peak morning pollination',
          ],
          weatherAlert: 'Extreme heat or high winds during flowering can lead to chaffy grains.',
          icon: '🌾',
        },
        {
          phase: 'Phase 4',
          days: 'Days 96 - 135',
          title: 'Grain Ripening & Harvest',
          description: 'Dough stage, golden maturity, and threshing.',
          activities: [
            'Drain field completely 10 days before harvesting',
            'Harvest when 85% of panicles turn golden straw color',
            'Thresh, winnow, and dry grain to 13-14% moisture content',
          ],
          weatherAlert: 'Check for cyclone/rain warnings before cutting crop.',
          icon: '🧺',
        },
      ],
    },
  };

  const currentCrop = calendars[selectedCropKey] || calendars.groundnut;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Agronomic Schedule</span>
            </div>
            <h2 className="text-2xl font-bold font-serif">{t('calendarTitle')}</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              {t('calendarSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 p-1.5 rounded-2xl border border-emerald-700/40">
            <span className="text-xs font-semibold text-emerald-200 pl-2">Crop:</span>
            <select
              value={selectedCropKey}
              onChange={(e) => setSelectedCropKey(e.target.value)}
              className="bg-emerald-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="groundnut">Groundnut (వేరుశనగ)</option>
              <option value="tomato">Tomato (టమోటా)</option>
              <option value="rice">Rice / Paddy (వరి)</option>
            </select>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-emerald-700/60 text-xs">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Recommended Window</span>
            <span className="font-bold text-white text-sm">{currentCrop.sowingWindow}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Total Growing Cycle</span>
            <span className="font-bold text-white text-sm">{currentCrop.duration}</span>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Harvest Horizon</span>
            <span className="font-bold text-white text-sm">{currentCrop.expectedHarvest}</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline Cards */}
      <div className="space-y-4">
        {currentCrop.stages.map((stage, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Stage indicator strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-2xl bg-emerald-50 border border-emerald-100">
                  {stage.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {stage.phase} • {stage.days}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">{stage.title}</h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-4">{stage.description}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Essential Activities */}
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Farming Actions
                </span>
                <ul className="space-y-1.5">
                  {stage.activities.map((act, aIdx) => (
                    <li key={aIdx} className="text-xs text-stone-700 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weather Vulnerability Warning */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5 text-amber-900">Weather-Sensitive Phase:</strong>
                  <span>{stage.weatherAlert}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
