import React, { useState } from 'react';
import {
  BookOpen,
  Sprout,
  Droplets,
  Bug,
  Recycle,
  Sun,
  ShieldCheck,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export const LearningHubView: React.FC = () => {
  const { language, t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const guides = [
    {
      id: 'g-soil-1',
      category: 'soil',
      badge: 'Soil Health',
      title:
        language === 'te'
          ? 'జీవామృతం & ఘనజీవామృతం తయారీ విధానం'
          : language === 'hi'
          ? 'जीवामृत व घनजीवामृत बनाने की सरल विधि'
          : 'Preparing Jeevamrutha Organic Bio-Stimulant',
      description:
        language === 'te'
          ? 'ఆవు పేడ, మూత్రం, బెల్లం మరియు పిండితో తయారుచేసే సహజ సూక్ష్మజీవుల టానిక్. ఇది నేలలో వానపాములు మరియు ఉపయోగకర బ్యాక్టీరియాను వేగంగా పెంచుతుంది.'
          : language === 'hi'
          ? 'देसी गाय के गोबर, गोमूत्र, गुड़ और बेसन से तैयार तरल खाद। यह मिट्टी के लाभकारी सूक्ष्मजीवों और केंचुओं को सक्रिय करती है।'
          : 'Harness indigenous beneficial soil microorganisms using native cow dung, urine, jaggery, and pulse flour to restore living soil vitality.',
      readTime: '4 min read',
      icon: '🌱',
      keyTips: [
        'Ferment 48-72 hours in shaded conditions, stirring clockwise twice a day.',
        'Apply 200 liters per acre with irrigation water every 15-21 days.',
        'Never expose microbial drums to direct scorching afternoon sunlight.',
      ],
    },
    {
      id: 'g-water-2',
      category: 'water',
      badge: 'Water Management',
      title:
        language === 'te'
          ? 'డ్రిప్ మరియు మల్చింగ్ ద్వారా 50% నీటి ఆదా'
          : language === 'hi'
          ? 'ड्रिप सिंचाई और मल्चिंग से 50% पानी की बचत'
          : 'Saving 50% Water with Micro-Drip & Mulch',
      description:
        language === 'te'
          ? 'నేలపై ఎండ నేరుగా పడకుండా ఎండుగడ్డి లేదా మల్చింగ్ షీట్ వాడటం వలన భూమిలో తేమ ఆవిరి కాకుండా కాపాడుతుంది.'
          : language === 'hi'
          ? 'फसलों के अवशेष या गीली घास से जमीन को ढंकना वाष्पीकरण रोकता है और खरपतवार नियंत्रित करता है।'
          : 'Prevent topsoil moisture evaporation, reduce soil temperature spikes, and curb weed competition through organic biomass mulching.',
      readTime: '3 min read',
      icon: '💧',
      keyTips: [
        'Apply 3-4 inches of paddy straw, sugarcane trash, or groundnut shells along rows.',
        'Schedule drip watering during early morning hours to minimize evaporative loss.',
        'Reduces required irrigation frequency by half during peak dry spells.',
      ],
    },
    {
      id: 'g-pest-3',
      category: 'pest',
      badge: 'Integrated Pest Management',
      title:
        language === 'te'
          ? 'వేప కషాయం & పసుపు అట్టలతో తెగుళ్ల నియంత్రణ'
          : language === 'hi'
          ? 'नीम का काढ़ा और पीले चिपचिपे कार्ड से कीट नियंत्रण'
          : 'Natural Neem Formulations & Sticky Trap Trapping',
      description:
        language === 'te'
          ? 'రసాయన మందుల వాడకాన్ని తగ్గించి, రసం పీల్చే పురుగులను తొలిదశలోనే పసుపు, నీలి రంగు జిగురు అట్టలతో సులభంగా పసిగట్టవచ్చు.'
          : language === 'hi'
          ? 'सफेद मक्खी, थ्रिप्स और एफिड्स को शुरुआती चरण में पकड़ने हेतु खेत में पीले-नीले चिपचिपे ट्रैप लगाएं।'
          : 'Disrupt sucking insect life cycles early using azadirachtin-rich cold-pressed neem oils and visual optical sticky traps.',
      readTime: '5 min read',
      icon: '🐞',
      keyTips: [
        'Install 10-15 yellow sticky sheets per acre at canopy level for whiteflies and aphids.',
        'Use 5ml pure neem oil (10,000 ppm) per liter of water with 1ml natural soap emulsifier.',
        'Spray during late evenings so beneficial pollinators are undisturbed.',
      ],
    },
    {
      id: 'g-rotation-4',
      category: 'sustainability',
      badge: 'Sustainable Practices',
      title:
        language === 'te'
          ? 'పంట మార్పిడి మరియు పప్పుధాన్యాల ప్రాముఖ్యత'
          : language === 'hi'
          ? 'फसल चक्र और दलहनी फसलों का महत्व'
          : 'Crop Rotation & Leguminous Nitrogen Fixation',
      description:
        language === 'te'
          ? 'ఒకే పంటను పదేపదే వేయకుండా, వేరుశనగ, కందులు లేదా పెసర వంటి పప్పుదినుసులను మార్పిడి చేయడం వలన సహజ నత్రజని నేలలో చేరుతుంది.'
          : language === 'hi'
          ? 'लगातार एक ही फसल बोने से बचें। अरहर, मूंग या उड़द जैसी दलहन फसलें मिट्टी में 40-60 किग्रा प्राकृतिक नाइट्रोजन जोड़ती हैं।'
          : 'Break pest cycles and replenish depleted root-zone nitrogen naturally by rotating cereal monocultures with tap-rooted legumes.',
      readTime: '4 min read',
      icon: '♻️',
      keyTips: [
        'Rotate deep-rooted crops with shallow-rooted crops to access distinct soil horizons.',
        'Incorporate green manure crops like Sunnhemp (Janumu) before flowering.',
        'Significantly cuts synthetic urea/DAP dependency for succeeding crops.',
      ],
    },
    {
      id: 'g-postharvest-5',
      category: 'harvest',
      badge: 'Post-Harvest Care',
      title:
        language === 'te'
          ? 'ధాన్యాలు & గింజల నాణ్యమైన ఆరబెట్టడం మరియు నిల్వ'
          : language === 'hi'
          ? 'अनाज व बीजों का सुरक्षित सुखाना और भंडारण'
          : 'Safe Sun-Drying & Aflatoxin Prevention',
      description:
        language === 'te'
          ? 'వేరుశనగ మరియు ధాన్యాలను తగిన తేమ శాతం (9% కంటే తక్కువ) వరకు ఆరబెట్టకపోతే బూజు పట్టి మార్కెట్ ధర తగ్గిపోతుంది.'
          : language === 'hi'
          ? 'मूंगफली और अनाज को सुरक्षित भंडारण हेतु तिरपाल पर सुखाएं ताकि नमी 8-10% से नीचे आ जाए।'
          : 'Moisture management during post-harvest handling prevents toxic Aspergillus fungal spores and preserves premium farm-gate prices.',
      readTime: '4 min read',
      icon: '🌾',
      keyTips: [
        'Dry produce on food-grade tarpaulins, never directly on bare mud soil.',
        'Test moisture: Pods should crack sharply between fingers with a clear crisp sound.',
        'Store in airtight Hermetic triple-layer bags in well-aerated warehouses.',
      ],
    },
  ];

  const filteredGuides =
    activeCategory === 'all'
      ? guides
      : guides.filter((g) => g.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Practical Agronomic Knowledge</span>
        </div>
        <h2 className="text-2xl font-bold font-serif">{t('navLearningHub')}</h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
          Actionable field guides, low-cost organic inputs, water conservation tactics, and pest scouting advice.
        </p>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-emerald-700/60">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            All Topics
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('soil')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'soil'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            🌱 Soil Health
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('water')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'water'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            💧 Water Management
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('pest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'pest'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            🐞 Pest Awareness (IPM)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('sustainability')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'sustainability'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            ♻️ Sustainable Practices
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('harvest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'harvest'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            🌾 Post-Harvest Care
          </button>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {guide.badge}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">{guide.readTime}</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl p-2.5 rounded-2xl bg-stone-50 border border-stone-100 shrink-0">
                  {guide.icon}
                </span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {guide.title}
                </h3>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{guide.description}</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5">
              <strong className="text-xs font-bold text-stone-800 block">Practical Field Checklist:</strong>
              <ul className="space-y-1">
                {guide.keyTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-stone-600 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
