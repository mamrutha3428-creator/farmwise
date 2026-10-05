import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
  Calendar,
  MapPin,
  Phone,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import {
  getProduceListings,
  addProduceListing,
  updateProduceListing,
  deleteProduceListing,
  deduplicateById,
} from '../services/dataService';
import { ProduceListing } from '../types';

export const MyProduceView: React.FC = () => {
  const { user, farmerProfile } = useAuth();
  const { t } = useI18n();

  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProduceListing['category']>('Vegetables');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState<number>(50);
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState(farmerProfile?.locationName || 'Tirupati, Andhra Pradesh');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(farmerProfile?.phone || '+91 94401 23456');
  const [showPhone, setShowPhone] = useState(true);
  const [status, setStatus] = useState<'available' | 'sold' | 'unavailable'>('available');

  const loadListings = async () => {
    setLoading(true);
    const all = await getProduceListings();
    const myId = user?.uid || 'demo_farmer_ravi';
    // Show user's listings, or if demo farmer show demo listings
    const filtered = all.filter((p) => p.farmerId === myId || (myId.startsWith('demo') && p.farmerId === 'demo_farmer_ravi'));
    setListings(deduplicateById(filtered));
    setLoading(false);
  };

  useEffect(() => {
    loadListings();
  }, [user]);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Vegetables');
    setQuantity(100);
    setUnit('kg');
    setPricePerUnit(50);
    setHarvestDate(new Date().toISOString().split('T')[0]);
    setLocationName(farmerProfile?.locationName || 'Tirupati, Andhra Pradesh');
    setImageUrl('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80');
    setDescription('Freshly harvested from natural farm beds.');
    setStatus('available');
    setModalOpen(true);
  };

  const openEditModal = (item: ProduceListing) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setPricePerUnit(item.pricePerUnit);
    setHarvestDate(item.harvestDate);
    setLocationName(item.locationName);
    setImageUrl(item.imageUrl || '');
    setDescription(item.description);
    setPhone(item.phone || farmerProfile?.phone || '');
    setShowPhone(item.showPhone ?? true);
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      await updateProduceListing(editingId, {
        title,
        category,
        quantity,
        unit,
        pricePerUnit,
        harvestDate,
        locationName,
        imageUrl: imageUrl || undefined,
        description,
        phone,
        showPhone,
        status,
      });
    } else {
      await addProduceListing({
        farmerId: user?.uid || 'demo_farmer_ravi',
        farmerName: user?.displayName || 'Ravi Kumar',
        farmName: farmerProfile?.farmName || 'Ravi Organic Naturals',
        title,
        category,
        quantity,
        unit,
        pricePerUnit,
        currency: '₹',
        harvestDate,
        locationName,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
        description,
        status,
        phone,
        showPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    setModalOpen(false);
    await loadListings();
  };

  const handleToggleStatus = async (item: ProduceListing) => {
    const nextStatus = item.status === 'available' ? 'sold' : 'available';
    await updateProduceListing(item.id, { status: nextStatus });
    await loadListings();
  };

  const handleDelete = async (id: string) => {
    await deleteProduceListing(id);
    await loadListings();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Farm-Gate Produce Registry</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">{t('navMyProduce')}</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            List harvested crops to make them directly discoverable by nearby citizens. No middleman commissions or fees.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('actionAddProduce')}</span>
        </button>
      </div>

      {/* Produce Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 bg-white rounded-3xl border border-stone-200">
          Loading your produce listings...
        </div>
      ) : listings.length === 0 ? (
        <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto text-emerald-600">
            <Package className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-stone-800">No Produce Listed Yet</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Add your groundnuts, tomatoes, rice, or seasonal fruits so citizens nearby can find and contact you directly.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            {t('actionAddProduce')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-stone-100 overflow-hidden">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                        item.status === 'available'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-800 text-white'
                      }`}
                    >
                      {item.status === 'available' ? t('statusAvailable') : t('statusSold')}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 backdrop-blur-sm text-stone-700">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-stone-900 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.locationName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Available</span>
                      <span className="font-extrabold text-stone-800">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Price</span>
                      <span className="font-extrabold text-emerald-800">
                        {item.currency}{item.pricePerUnit} / {item.unit}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                    item.status === 'available'
                      ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                      : 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {item.status === 'available' ? t('actionMarkSold') : t('actionMarkAvailable')}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                    title={t('actionEditProduce')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title={t('actionDelete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Produce Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 font-serif mb-4">
              {editingId ? t('actionEditProduce') : t('actionAddProduce')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('labelProduceTitle')} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Groundnut (Kadiri-6) / Desi Tomatoes"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Spices & Herbs">Spices & Herbs</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="available">Available Now</option>
                    <option value="sold">Sold Out</option>
                    <option value="unavailable">Temporarily Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('labelQuantity')} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, quintal, bags"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('labelPrice')} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('labelHarvestDate')}
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('labelLocation')}
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  {t('labelDescription')}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Quality grade, variety, moisture content, pickup arrangements..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    {t('labelPhone')}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
                  <input
                    type="checkbox"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t('labelShowPhone')}</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {t('actionCancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  {editingId ? 'Save Changes' : t('actionAddProduce')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
