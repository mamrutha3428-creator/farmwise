import React, { useState } from 'react';
import { User, MapPin, Phone, Sprout, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

export const FarmProfileSettings: React.FC = () => {
  const { farmerProfile, updateFarmerProfile, user } = useAuth();
  const { t } = useI18n();

  const [farmName, setFarmName] = useState(farmerProfile?.farmName || '');
  const [locationName, setLocationName] = useState(farmerProfile?.locationName || '');
  const [district, setDistrict] = useState(farmerProfile?.district || 'Tirupati');
  const [state, setState] = useState(farmerProfile?.state || 'Andhra Pradesh');
  const [farmSizeAcres, setFarmSizeAcres] = useState<number>(farmerProfile?.farmSizeAcres || 3);
  const [soilType, setSoilType] = useState(farmerProfile?.soilType || 'Red Sandy Loam');
  const [waterSource, setWaterSource] = useState(farmerProfile?.waterSource || 'Borewell & Drip Irrigation');
  const [irrigationType, setIrrigationType] = useState(farmerProfile?.irrigationType || 'Drip System');
  const [currentCrops, setCurrentCrops] = useState(farmerProfile?.currentCrops || 'Groundnut, Tomato');
  const [phone, setPhone] = useState(farmerProfile?.phone || '+91 94401 23456');
  const [showPhone, setShowPhone] = useState(farmerProfile?.showPhone ?? true);
  const [bio, setBio] = useState(farmerProfile?.bio || '');
  const [experience, setExperience] = useState<number>(farmerProfile?.farmingExperienceYears || 8);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFarmerProfile({
      farmName,
      locationName,
      district,
      state,
      farmSizeAcres,
      soilType,
      waterSource,
      irrigationType,
      currentCrops,
      phone,
      showPhone,
      bio,
      farmingExperienceYears: experience,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Agricultural Identity</span>
        </div>
        <h2 className="text-2xl font-bold font-serif">{t('navMyFarm')}</h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
          Maintain your farm details. These parameters automatically feed into Gemini AI for contextual crop recommendations and disease diagnosis.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelFarmName')}</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelLocation')}</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelLandSize')}</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={farmSizeAcres}
                onChange={(e) => setFarmSizeAcres(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelSoilType')}</label>
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Water Source</label>
              <input
                type="text"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelIrrigation')}</label>
              <input
                type="text"
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelCurrentCrops')}</label>
              <input
                type="text"
                value={currentCrops}
                onChange={(e) => setCurrentCrops(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelExperience')}</label>
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Farm Bio & Farming Philosophy</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Practicing chemical-free natural farming with drip lines, vermicompost, and intercropping..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('labelPhone')}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl max-w-sm"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>{t('labelShowPhone')}</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Profile updated successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t('actionSaveProfile')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
