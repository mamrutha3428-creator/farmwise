export type UserRole = 'farmer' | 'citizen' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProfile {
  userId: string;
  farmName: string;
  locationName: string;
  district?: string;
  state?: string;
  farmSizeAcres: number;
  soilType: string;
  waterSource: string;
  irrigationType: string;
  currentCrops: string;
  phone: string;
  showPhone: boolean;
  bio?: string;
  farmingExperienceYears?: number;
  certifications?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  title: string;
  category: 'Vegetables' | 'Fruits' | 'Grains & Pulses' | 'Oilseeds' | 'Spices & Herbs' | 'Other';
  quantity: number;
  unit: string;
  pricePerUnit: number;
  currency: string;
  harvestDate: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  description: string;
  status: 'available' | 'sold' | 'unavailable';
  phone?: string;
  showPhone?: boolean;
  distanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendedCrop {
  id: string;
  cropName: string;
  scientificName?: string;
  suitabilityScore: number;
  weatherSuitability: string;
  soilCompatibility: string;
  waterRequirement: string;
  riskLevel: string;
  durationDays: string;
  expectedYield: string;
  estimatedProfit: string;
  whyThisCrop: string[];
  bestSowingWindow?: string;
  keyTips?: string;
}

export interface CropRecommendationRecord {
  id?: string;
  userId: string;
  location: string;
  soilType: string;
  season: string;
  landSize: number;
  waterAvailability: string;
  recommendations: RecommendedCrop[];
  climateAdvice?: string;
  disclaimer?: string;
  createdAt: string;
}

export interface CropScanRecord {
  id?: string;
  userId: string;
  cropName: string;
  imageUrl: string;
  issueDetected: string;
  scientificName?: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  observedSymptoms: string;
  possibleCauses: string;
  recommendedSteps: string[];
  cautionNote?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'recommendation' | 'scan' | 'produce' | 'weather' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SavedItem {
  id: string;
  userId: string;
  targetId: string;
  type: 'farm' | 'produce';
  title: string;
  subtitle: string;
  imageUrl?: string;
  createdAt: string;
}

export interface FarmingHistoryRecord {
  id: string;
  userId: string;
  year: string;
  season: string;
  cropName: string;
  areaAcres: number;
  harvestYield: string;
  notes?: string;
  createdAt: string;
}

export interface ListingReportRecord {
  id?: string;
  reporterId: string;
  reporterEmail?: string;
  produceId: string;
  produceTitle: string;
  reason: 'incorrect_info' | 'suspicious' | 'inappropriate' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}
