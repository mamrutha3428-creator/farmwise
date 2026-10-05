import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Phone,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  X,
  ExternalLink,
  ShieldAlert,
  Sprout,
  Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import {
  getProduceListings,
  toggleSaveItem,
  getSavedItems,
  submitListingReport,
  deduplicateById,
} from '../services/dataService';
import { ProduceListing, SavedItem } from '../types';

export const CitizenDiscoveryView: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useI18n();

  const [produce, setProduce] = useState<ProduceListing[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'nearest' | 'priceAsc' | 'recent'>('nearest');

  // Modals
  const [selectedProduce, setSelectedProduce] = useState<ProduceListing | null>(null);
  const [farmModalProduce, setFarmModalProduce] = useState<ProduceListing | null>(null);
  const [reportModalProduce, setReportModalProduce] = useState<ProduceListing | null>(null);
  const [reportReason, setReportReason] = useState<'incorrect_info' | 'suspicious' | 'inappropriate' | 'other'>('incorrect_info');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const listings = await getProduceListings();
    setProduce(deduplicateById(listings));

    const userId = user?.uid || 'guest_citizen';
    const saved = await getSavedItems(userId);
    setSavedItems(deduplicateById(saved));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleToggleFavorite = async (item: ProduceListing) => {
    const userId = user?.uid || 'guest_citizen';
    await toggleSaveItem(
      userId,
      item.id,
      'produce',
      item.title,
      `${item.farmName} • ${item.quantity} ${item.unit}`,
      item.imageUrl
    );
    const updated = await getSavedItems(userId);
    setSavedItems(deduplicateById(updated));
  };

  const isFavorite = (targetId: string) => {
    return savedItems.some((s) => s.targetId === targetId);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalProduce) return;

    await submitListingReport({
      reporterId: user?.uid || 'guest_citizen',
      reporterEmail: user?.email,
      produceId: reportModalProduce.id,
      produceTitle: reportModalProduce.title,
      reason: reportReason,
      details: reportDetails || 'Listing reported by community buyer',
      status: 'pending',
    });

    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalProduce(null);
      setReportSubmitted(false);
      setReportDetails('');
    }, 2000);
  };

  // Filter and sort produce
  const filteredProduce = produce
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.locationName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'nearest') {
        return (a.distanceKm || 10) - (b.distanceKm || 10);
      }
      if (sortBy === 'priceAsc') {
        return a.pricePerUnit - b.pricePerUnit;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains & Pulses', 'Oilseeds', 'Spices & Herbs'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
          <Sprout className="w-3.5 h-3.5" />
          <span>Local Farm-to-Kitchen Connection</span>
        </div>
        <h2 className="text-2xl font-bold font-serif">{t('citizenFreshHeading')}</h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
          {t('citizenSubheading')}
        </p>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 pt-5 border-t border-emerald-700/60">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('actionSearch')}
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 text-xs bg-emerald-950/50 border border-emerald-600/50 rounded-2xl text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-emerald-950/50 border border-emerald-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-emerald-900 text-white">
                  {cat === 'All' ? t('citizenFilterAll') : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 text-xs bg-emerald-950/50 border border-emerald-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="nearest" className="bg-emerald-900 text-white">
                {t('citizenSortNearest')}
              </option>
              <option value="priceAsc" className="bg-emerald-900 text-white">
                {t('citizenSortPriceLow')}
              </option>
              <option value="recent" className="bg-emerald-900 text-white">
                {t('citizenSortRecent')}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Direct Connection Notice Banner (Mandatory Requirement 3) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">{t('citizenDirectNotice')}</strong>
        </div>
      </div>

      {/* Produce Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
          Finding nearby farm produce...
        </div>
      ) : filteredProduce.length === 0 ? (
        <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200 space-y-2">
          <p className="text-sm font-bold text-stone-800">{t('citizenNoProduce')}</p>
          <p className="text-xs text-stone-500">
            Try clearing your search term or selecting another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProduce.map((item, idx) => {
            const favorited = isFavorite(item.id);
            return (
              <div
                key={`${item.id}-${idx}`}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video bg-stone-100 overflow-hidden">
                    <img
                      src={
                        item.imageUrl ||
                        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Bookmark favorite */}
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(item)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        favorited
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 hover:bg-white text-stone-600'
                      }`}
                      title={favorited ? 'Saved' : t('actionSaveProduce')}
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                    </button>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                          item.status === 'available'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-800 text-white'
                        }`}
                      >
                        {item.status === 'available' ? t('statusAvailable') : t('statusSold')}
                      </span>
                    </div>

                    {/* Distance Badge */}
                    {item.distanceKm && (
                      <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{item.distanceKm} km away</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                        <span>{item.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 mt-0.5 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                        <span>👨‍🌾 {item.farmerName}</span>
                        <span>•</span>
                        <span className="font-semibold text-stone-700">{item.farmName}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Available</span>
                        <span className="font-extrabold text-stone-800 text-sm">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Approx. Price</span>
                        <span className="font-extrabold text-emerald-800 text-sm">
                          {item.currency}{item.pricePerUnit} / {item.unit}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFarmModalProduce(item)}
                    className="text-xs font-semibold text-stone-600 hover:text-emerald-700 py-2 px-1 underline"
                  >
                    {t('actionViewFarm')}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReportModalProduce(item)}
                      title={t('actionReportListing')}
                      className="p-2 text-stone-400 hover:text-amber-600 hover:bg-stone-50 rounded-xl transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProduce(item)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('actionContactFarmer')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct Contact Modal */}
      {selectedProduce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setSelectedProduce(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                {t('actionContactFarmer')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Connect directly with {selectedProduce.farmerName} from {selectedProduce.farmName}
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-stone-500">Inquiring about:</span>
                <span className="font-bold text-stone-900">{selectedProduce.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Available:</span>
                <span className="font-bold text-stone-900">
                  {selectedProduce.quantity} {selectedProduce.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Price:</span>
                <span className="font-bold text-emerald-800">
                  {selectedProduce.currency}{selectedProduce.pricePerUnit} / {selectedProduce.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Location:</span>
                <span className="font-bold text-stone-900">{selectedProduce.locationName}</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Call Farmer */}
              <a
                href={`tel:${selectedProduce.phone || '+919440123456'}`}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call {selectedProduce.phone || '+91 94401 23456'}</span>
              </a>

              {/* WhatsApp Message */}
              <a
                href={`https://wa.me/${(selectedProduce.phone || '+919440123456').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Namaste ${selectedProduce.farmerName}, I saw your listing for "${selectedProduce.title}" on FarmWise. I would like to inquire about purchasing some produce directly.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('actionWhatsApp')}</span>
              </a>
            </div>

            <p className="text-[11px] text-stone-400 text-center mt-5 leading-relaxed">
              FarmWise facilitates direct farmer-to-citizen connection without handling transactions, delivery, or commissions.
            </p>
          </div>
        </div>
      )}

      {/* Farm Profile Details Modal */}
      {farmModalProduce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setFarmModalProduce(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                👨‍🌾
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  {farmModalProduce.farmName}
                </h3>
                <p className="text-xs text-stone-500">
                  Grower: {farmModalProduce.farmerName} • 📍 {farmModalProduce.locationName}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-800 block text-xs">Farm Overview:</span>
                <p className="text-stone-600 leading-relaxed">
                  Family-operated smallholder farm utilizing organic matter soil building, drip lines, and integrated biological pest management.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Distance</span>
                  <span className="font-bold text-stone-800">{farmModalProduce.distanceKm || '6'} km away</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Farming Style</span>
                  <span className="font-bold text-emerald-800">Natural / Conscious</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = farmModalProduce;
                    setFarmModalProduce(null);
                    setSelectedProduce(target);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  {t('actionContactFarmer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Suspicious Listing Modal (Section 30) */}
      {reportModalProduce && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setReportModalProduce(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3 text-amber-700">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold font-serif">{t('actionReportListing')}</h3>
            </div>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs text-emerald-900 space-y-1">
                <p className="font-bold">{t('reportSuccess')}</p>
                <p className="text-[11px] text-stone-500">Our moderators will review this listing shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <p className="text-stone-600">
                  Help maintain trust on FarmWise. Report inaccuracies or suspicious claims for: <strong>{reportModalProduce.title}</strong>
                </p>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="incorrect_info">Incorrect Location or Pricing</option>
                    <option value="suspicious">Suspicious / Fraudulent Listing</option>
                    <option value="inappropriate">Inappropriate Content or Photos</option>
                    <option value="other">Other Concern</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Additional Details</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe what seemed inaccurate or suspicious..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalProduce(null)}
                    className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    {t('actionCancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
