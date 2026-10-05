import React, { useState } from 'react';
import {
  Sprout,
  Bell,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationItem } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  notifications,
  onOpenNotifications,
}) => {
  const { user, role, activeRole, switchRole, loginWithGoogle, loginDemo, logout } = useAuth();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const currentRole = activeRole || role || 'farmer';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                if (currentRole === 'citizen') setCurrentTab('fresh-produce');
                else if (currentRole === 'admin') setCurrentTab('admin');
                else setCurrentTab('home');
              }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-emerald-950 font-serif">FarmWise</span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    AgriTech
                  </span>
                </div>
                <span className="hidden md:block text-[11px] text-stone-500 font-medium">
                  {t('tagline')}
                </span>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => switchRole('farmer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'farmer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>👨‍🌾</span>
                <span>{t('roleFarmer')}</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('citizen')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === 'citizen'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>👤</span>
                <span>{t('roleCitizen')}</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Universal Language Selector */}
              <LanguageSelector compact={false} />

              {/* Notifications Button */}
              {user && (
                <button
                  type="button"
                  onClick={onOpenNotifications}
                  className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Authentication state */}
              {user ? (
                <div className="flex items-center gap-2 pl-1 border-l border-stone-200">
                  <div className="hidden sm:flex flex-col text-right rtl:text-left">
                    <span className="text-xs font-bold text-stone-800 leading-tight">
                      {user.displayName || 'User'}
                    </span>
                    <span className="text-[10px] text-emerald-700 capitalize font-medium">
                      {role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    title={t('navLogout')}
                    className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('navLogin')}</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              )}

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-3">
            <div className="flex flex-col gap-1.5 p-1 bg-stone-100 rounded-xl">
              <span className="text-[10px] font-bold text-stone-500 uppercase px-2 pt-1">Select Role:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    switchRole('farmer');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                    currentRole === 'farmer' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-stone-700'
                  }`}
                >
                  👨‍🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchRole('citizen');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                    currentRole === 'citizen' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-stone-700'
                  }`}
                >
                  👤 Citizen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchRole('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-lg transition-all ${
                    currentRole === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-stone-700'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              {currentRole === 'farmer' ? (
                <>
                  <button
                    onClick={() => {
                      setCurrentTab('crop-recommendation');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
                  >
                    🌱 {t('navCropRec')}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('crop-scanner');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
                  >
                    📷 {t('navCropScan')}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('ai-assistant');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
                  >
                    🤖 {t('navAiAssistant')}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('my-produce');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
                  >
                    🧺 {t('navMyProduce')}
                  </button>
                </>
              ) : currentRole === 'citizen' ? (
                <>
                  <button
                    onClick={() => {
                      setCurrentTab('fresh-produce');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
                  >
                    🧺 {t('navExploreProduce')}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('saved');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 rounded-lg"
                  >
                    ❤️ {t('navSavedProduce')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setCurrentTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-left py-2 px-3 text-sm font-semibold text-amber-800 hover:bg-amber-50 rounded-lg"
                >
                  🛡️ {t('navReports')}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal for Sign In Options (Google + Hackathon Demo One-Click) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-600/20">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-serif">Welcome to FarmWise</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {t('tagline')}
              </p>
            </div>

            <div className="space-y-3">
              {/* Google Sign-in */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    await loginWithGoogle('farmer');
                    setAuthModalOpen(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-stone-300 hover:border-emerald-600 rounded-xl font-semibold text-stone-800 text-sm shadow-sm hover:shadow transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.25 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.07 0 12s.45 3.76 1.25 5.39l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                Continue with Google (Firebase)
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-white px-2 text-stone-400 font-semibold tracking-wider">
                    Or 1-Click Demo Profiles
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginDemo('farmer');
                    setAuthModalOpen(false);
                  }}
                  className="p-3 text-left border border-emerald-200 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                    <span>👨‍🌾</span> Farmer Demo
                  </div>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">Ravi Kumar (Groundnut)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginDemo('citizen');
                    setAuthModalOpen(false);
                  }}
                  className="p-3 text-left border border-sky-200 hover:border-sky-600 bg-sky-50/50 hover:bg-sky-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-sky-950">
                    <span>👤</span> Citizen Demo
                  </div>
                  <span className="text-[11px] text-sky-700 block mt-0.5">Priya Sharma (Local Buyer)</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 text-center mt-5">
              Secure Firebase Authentication. Your preferred language will be preserved across sessions.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
