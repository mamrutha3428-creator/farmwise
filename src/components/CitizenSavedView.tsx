import React, { useState, useEffect } from 'react';
import { Bookmark, Heart, Trash2, MapPin, ExternalLink, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { getSavedItems, toggleSaveItem, deduplicateById } from '../services/dataService';
import { SavedItem } from '../types';

interface CitizenSavedViewProps {
  onNavigateToProduce: () => void;
}

export const CitizenSavedView: React.FC<CitizenSavedViewProps> = ({ onNavigateToProduce }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    setLoading(true);
    const userId = user?.uid || 'guest_citizen';
    const items = await getSavedItems(userId);
    setSaved(deduplicateById(items));
    setLoading(false);
  };

  useEffect(() => {
    loadSaved();
  }, [user]);

  const handleRemove = async (item: SavedItem) => {
    const userId = user?.uid || 'guest_citizen';
    await toggleSaveItem(userId, item.targetId, item.type, item.title, item.subtitle);
    await loadSaved();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
          <Bookmark className="w-3.5 h-3.5" />
          <span>My Bookmarks</span>
        </div>
        <h2 className="text-2xl font-bold font-serif">{t('navSavedProduce')}</h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
          Quickly access your saved farms, preferred local growers, and recurring harvests.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
          Loading saved items...
        </div>
      ) : saved.length === 0 ? (
        <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-stone-400">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <h4 className="text-base font-bold text-stone-800">{t('emptySaved')}</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Browse fresh produce from nearby smallholders and bookmark items to stay updated on harvest batches.
          </p>
          <button
            type="button"
            onClick={onNavigateToProduce}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
          >
            {t('navExploreProduce')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                    <span className="text-xs text-stone-500 block mt-0.5">{item.subtitle}</span>
                    <span className="text-[10px] text-stone-400 block mt-1">
                      Saved {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
