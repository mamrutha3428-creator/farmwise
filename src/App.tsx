import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './context/I18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { CropRecommendationView } from './components/CropRecommendationView';
import { CropScanner } from './components/CropScanner';
import { AIChatAssistant } from './components/AIChatAssistant';
import { WeatherDashboard } from './components/WeatherDashboard';
import { CropCalendarView } from './components/CropCalendarView';
import { MyProduceView } from './components/MyProduceView';
import { CitizenDiscoveryView } from './components/CitizenDiscoveryView';
import { CitizenSavedView } from './components/CitizenSavedView';
import { FarmerJourneyView } from './components/FarmerJourneyView';
import { LearningHubView } from './components/LearningHubView';
import { FarmProfileSettings } from './components/FarmProfileSettings';
import { AdminModerationView } from './components/AdminModerationView';
import { NotificationsModal } from './components/NotificationsModal';
import {
  getProduceListings,
  getNotifications,
} from './services/dataService';
import { NotificationItem } from './types';
import {
  Sparkles,
  Camera,
  Bot,
  CloudSun,
  Calendar,
  Package,
  TrendingUp,
  BookOpen,
  User,
  ShieldCheck,
  Heart,
  LayoutDashboard,
  WifiOff,
} from 'lucide-react';

function MainApp() {
  const { user, role, activeRole, switchRole } = useAuth();
  const { t } = useI18n();

  const currentRole = activeRole || role || 'farmer';

  // Initialize currentTab based on the active role
  const [currentTab, setCurrentTab] = useState<string>(() => {
    try {
      const savedRole = localStorage.getItem('farmwise_active_role');
      if (savedRole === 'citizen') return 'fresh-produce';
      if (savedRole === 'admin') return 'admin';
    } catch (e) {}
    return 'home';
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [activeProduceCount, setActiveProduceCount] = useState<number>(5);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshData = async () => {
    const notifs = await getNotifications(user?.uid || 'demo_farmer_ravi');
    setNotifications(notifs);

    const produce = await getProduceListings();
    setActiveProduceCount(produce.filter((p) => p.status === 'available').length);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  // Synchronize tab immediately when role switches
  useEffect(() => {
    if (currentRole === 'citizen') {
      setCurrentTab('fresh-produce');
    } else if (currentRole === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('home');
    }
  }, [currentRole]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Offline Status Notice */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>{t('offlineNotice')}</span>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        key={`navbar-${currentRole}`}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        notifications={notifications}
        onOpenNotifications={() => setNotifModalOpen(true)}
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-3 shadow-sm space-y-1">
            <span className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
              {currentRole === 'farmer' ? 'Farmer Suite' : currentRole === 'citizen' ? 'Citizen Market' : 'Admin Panel'}
            </span>

            {currentRole === 'farmer' && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentTab('home')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'home'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>{t('navDashboard')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('crop-recommendation')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'crop-recommendation'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{t('navCropRec')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('crop-scanner')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'crop-scanner'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Camera className="w-4 h-4 shrink-0 text-teal-500" />
                  <span>{t('navCropScan')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('ai-assistant')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'ai-assistant'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Bot className="w-4 h-4 shrink-0 text-indigo-500" />
                  <span>{t('navAiAssistant')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('weather')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'weather'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <CloudSun className="w-4 h-4 shrink-0 text-sky-500" />
                  <span>{t('navWeather')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('crop-calendar')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'crop-calendar'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>{t('navCropCalendar')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('my-produce')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'my-produce'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Package className="w-4 h-4 shrink-0 text-green-600" />
                  <span>{t('navMyProduce')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('farming-history')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'farming-history'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 shrink-0 text-purple-500" />
                  <span>{t('navFarmingHistory')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('learning-hub')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'learning-hub'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0 text-blue-500" />
                  <span>{t('navLearningHub')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('farm-profile')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'farm-profile'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0 text-stone-500" />
                  <span>{t('navMyFarm')}</span>
                </button>
              </>
            )}

            {currentRole === 'citizen' && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentTab('fresh-produce')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'fresh-produce'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Package className="w-4 h-4 shrink-0" />
                  <span>{t('navExploreProduce')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('saved')}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                    currentTab === 'saved'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Heart className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{t('navSavedProduce')}</span>
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <button
                type="button"
                onClick={() => setCurrentTab('admin')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left rtl:text-right ${
                  currentTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t('navReports')}</span>
              </button>
            )}
          </div>

          {/* Quick role change card */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-4 text-xs space-y-2">
            <span className="font-extrabold text-emerald-950 uppercase text-[10px] tracking-wider block">
              Active Experience Mode
            </span>
            <p className="text-emerald-800 leading-snug">
              {currentRole === 'farmer'
                ? t('roleFarmerDesc')
                : currentRole === 'citizen'
                ? t('roleCitizenDesc')
                : 'Moderation console for trust & safety.'}
            </p>
            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => switchRole(currentRole === 'farmer' ? 'citizen' : 'farmer')}
                className="font-bold text-emerald-700 underline text-xs hover:text-emerald-900"
              >
                Switch to {currentRole === 'farmer' ? "Citizen / Buyer" : "Farmer"} Mode →
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Farmer Views */}
          {currentRole === 'farmer' && (
            <>
              {currentTab === 'crop-recommendation' && <CropRecommendationView />}
              {currentTab === 'crop-scanner' && <CropScanner />}
              {currentTab === 'ai-assistant' && <AIChatAssistant />}
              {currentTab === 'weather' && <WeatherDashboard />}
              {currentTab === 'crop-calendar' && <CropCalendarView />}
              {currentTab === 'my-produce' && <MyProduceView />}
              {currentTab === 'farming-history' && <FarmerJourneyView />}
              {currentTab === 'learning-hub' && <LearningHubView />}
              {currentTab === 'farm-profile' && <FarmProfileSettings />}
              {(currentTab === 'home' ||
                ![
                  'crop-recommendation',
                  'crop-scanner',
                  'ai-assistant',
                  'weather',
                  'crop-calendar',
                  'my-produce',
                  'farming-history',
                  'learning-hub',
                  'farm-profile',
                ].includes(currentTab)) && (
                <FarmerDashboard
                  onNavigate={setCurrentTab}
                  activeProduceCount={activeProduceCount}
                />
              )}
            </>
          )}

          {/* Citizen Views */}
          {currentRole === 'citizen' && (
            <>
              {currentTab === 'saved' ? (
                <CitizenSavedView onNavigateToProduce={() => setCurrentTab('fresh-produce')} />
              ) : (
                <CitizenDiscoveryView />
              )}
            </>
          )}

          {/* Admin View */}
          {currentRole === 'admin' && <AdminModerationView />}
        </main>
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        notifications={notifications}
        onRefresh={refreshData}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">FarmWise</span>
            <span>•</span>
            <span>{t('tagline')}</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Direct Farm Connections • No Commissions</span>
            <span>•</span>
            <span>Powered by Gemini & Firebase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </I18nProvider>
  );
}
