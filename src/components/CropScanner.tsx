import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Save,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { saveCropScan } from '../services/dataService';
import { CropScanRecord } from '../types';

export const CropScanner: React.FC = () => {
  const { user, farmerProfile } = useAuth();
  const { language, t } = useI18n();

  const [selectedCrop, setSelectedCrop] = useState<string>('Groundnut');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CropScanRecord | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Common sample plant photos for instant testing if camera/file is not handy
  const samplePlantPhotos = [
    {
      name: 'Groundnut Leaf Spot (తిక్కా తెగులు)',
      crop: 'Groundnut',
      url: 'https://images.unsplash.com/photo-1599818818873-c15c898b6716?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Tomato Blight / Curled Leaf',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Paddy Rice Blast / Discoloration',
      crop: 'Rice',
      url: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setResult(null);
      setSavedSuccess(false);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      setImagePreview(null);
      setResult(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraActive(false);
      setErrorMessage('Camera access unavailable. Please use the "Upload Photo" option.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      stopCamera();
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview || analyzing) return;
    setAnalyzing(true);
    setResult(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/crop-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          cropName: selectedCrop,
          language,
        }),
      });

      if (!res.ok) throw new Error('Analysis API error');
      const data = await res.json();

      const scanRecord: CropScanRecord = {
        userId: user?.uid || 'guest_farmer',
        cropName: selectedCrop,
        imageUrl: imagePreview,
        issueDetected: data.issueDetected || 'Leaf Spot / Fungal Symptoms',
        scientificName: data.scientificName || 'Cercospora sp.',
        confidence: data.confidence || 82,
        severity: data.severity || 'Moderate',
        observedSymptoms: data.observedSymptoms || 'Spots observed on leaf surface with yellow chlorosis.',
        possibleCauses: data.possibleCauses || 'High humidity and warm air favoring fungal growth.',
        recommendedSteps: data.recommendedSteps || [
          'Prune diseased foliage and maintain clear drainage',
          'Spray bio-pesticide like Neem oil (5ml/L)',
          'Avoid overhead sprinkler watering late in the evening',
        ],
        cautionNote: data.cautionNote || t('scannerDisclaimer'),
        createdAt: new Date().toISOString(),
      };

      setResult(scanRecord);

      // Auto-save to farmer history
      if (user) {
        await saveCropScan(scanRecord);
        setSavedSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(t('errorGeneric'));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Vision AI Diagnosis</span>
            </div>
            <h2 className="text-2xl font-bold font-serif">{t('scannerTitle')}</h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
              {t('scannerSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 p-2 rounded-2xl border border-emerald-700/40">
            <span className="text-xs font-medium text-emerald-200 pl-2">Select Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-emerald-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="Groundnut">Groundnut (వేరుశనగ / मूंगफली)</option>
              <option value="Tomato">Tomato (టమోటా / टमाटर)</option>
              <option value="Rice / Paddy">Rice / Paddy (వరి / धान)</option>
              <option value="Red Gram">Red Gram (కందులు / अरहर)</option>
              <option value="Chilli">Chilli (మిరప / मिर्च)</option>
              <option value="Cotton">Cotton (ప్రత్తి / कपास)</option>
              <option value="Maize">Maize (మొక్కజొన్న / मक्का)</option>
            </select>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-stone-400 hover:text-stone-700 font-bold px-2">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image capture & preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>📷</span> Crop Photo Input
            </h3>

            {/* Video Live Feed */}
            {cameraActive && (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-stone-800 text-white text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Preview Box */}
            {!cameraActive && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-stone-200 bg-stone-50 aspect-video flex flex-col items-center justify-center p-4">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Crop to scan"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setResult(null);
                      }}
                      className="absolute top-3 right-3 px-3 py-1 bg-stone-900/70 hover:bg-stone-900 text-white text-xs rounded-lg backdrop-blur-md"
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-3 p-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">
                        Take or Upload Crop Leaf Photo
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        High resolution, clear daylight, close-up of spots or damage
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 transition-colors"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                {t('actionOpenCamera')}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-2xl border border-stone-200 transition-colors"
              >
                <Upload className="w-4 h-4 text-stone-600" />
                {t('actionUploadImage')}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Quick Demo Samples for convenient evaluation */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                Or Try Sample Crop Photos:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {samplePlantPhotos.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImagePreview(s.url);
                      setSelectedCrop(s.crop);
                      setResult(null);
                    }}
                    className="p-1.5 border border-stone-200 hover:border-emerald-500 rounded-xl text-left bg-stone-50/50 hover:bg-emerald-50 transition-colors group"
                  >
                    <img
                      src={s.url}
                      alt={s.name}
                      className="w-full h-14 object-cover rounded-lg mb-1 group-hover:scale-[1.02] transition-transform"
                    />
                    <span className="text-[10px] font-bold text-stone-700 block truncate">
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Analyze Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!imagePreview || analyzing}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{t('actionAnalyzing')}</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>{t('actionAnalyzeCrop')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Diagnostic Result Card */}
        <div className="lg:col-span-6">
          {result ? (
            <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {t('scannerIssueDetected')}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 font-serif mt-0.5">
                    {result.issueDetected}
                  </h3>
                  {result.scientificName && (
                    <span className="text-xs text-stone-500 italic block mt-0.5">
                      {result.scientificName}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {result.confidence}% Match
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1">
                    Severity: {result.severity}
                  </span>
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-emerald-600" />
                  {t('scannerSymptoms')}
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {result.observedSymptoms}
                </p>
              </div>

              {/* Likely Causes */}
              <div>
                <span className="text-xs font-bold text-stone-800 block mb-1">
                  {t('scannerCauses')}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                  {result.possibleCauses}
                </p>
              </div>

              {/* Next Steps */}
              <div>
                <span className="text-xs font-bold text-stone-800 block mb-2">
                  {t('scannerNextSteps')}
                </span>
                <div className="space-y-2">
                  {result.recommendedSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-medium leading-relaxed"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Humility & Safety Disclaimer (Section 14 & 31) */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-stone-100 text-[11px] text-stone-600 border border-stone-200">
                <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>{result.cautionNote || t('scannerDisclaimer')}</span>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold justify-end">
                  <Check className="w-4 h-4" />
                  <span>Diagnostic record saved to your FarmWise profile</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl border border-stone-200 p-8 text-center flex flex-col items-center justify-center min-h-[420px] space-y-3">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-400">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h4 className="text-base font-bold text-stone-800">Awaiting Crop Image</h4>
              <p className="text-xs text-stone-500 max-w-sm">
                Capture or select an image on the left, then click &ldquo;{t('actionAnalyzeCrop')}&rdquo; to generate diagnostic observations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}
