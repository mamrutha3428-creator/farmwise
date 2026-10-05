import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  ProduceListing,
  CropRecommendationRecord,
  CropScanRecord,
  NotificationItem,
  SavedItem,
  FarmingHistoryRecord,
  ListingReportRecord,
} from '../types';

const INITIAL_DEMO_PRODUCE: ProduceListing[] = [
  {
    id: 'prod-tomato-2',
    farmerId: 'farmer_lakshmi_44',
    farmerName: 'Lakshmi Devi',
    farmName: 'Chandragiri Green Valley Farm',
    title: 'Vine-Ripened Country Tomatoes (Desi Variety)',
    category: 'Vegetables',
    quantity: 240,
    unit: 'kg',
    pricePerUnit: 35,
    currency: '₹',
    harvestDate: '2026-10-05',
    locationName: 'Chandragiri, Chittoor',
    latitude: 13.5855,
    longitude: 79.3174,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    description: 'Plump, tangy desi tomatoes cultivated with vermicompost and drip irrigation. Picked fresh this morning.',
    status: 'available',
    phone: '+91 98480 87654',
    showPhone: true,
    distanceKm: 8.2,
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    id: 'prod-rice-3',
    farmerId: 'farmer_venkat_88',
    farmerName: 'Venkat Reddy',
    farmName: 'Sri Venkateswara Agrifarm',
    title: 'Sona Masuri Traditional Unpolished Rice',
    category: 'Grains & Pulses',
    quantity: 1200,
    unit: 'kg',
    pricePerUnit: 68,
    currency: '₹',
    harvestDate: '2026-09-28',
    locationName: 'Renigunta, Tirupati',
    latitude: 13.6521,
    longitude: 79.5168,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'Aromatic, single-polish nutritious Sona Masuri paddy milled carefully. High fiber, direct from paddy fields.',
    status: 'available',
    phone: '+91 97000 11223',
    showPhone: true,
    distanceKm: 4.1,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 7).toISOString(),
  },
  {
    id: 'prod-chilli-5',
    farmerId: 'farmer_subba_31',
    farmerName: 'Subba Rao',
    farmName: 'Subba Red Soil Farms',
    title: 'Guntur Sannam Red Chillies (Sun-Dried)',
    category: 'Spices & Herbs',
    quantity: 350,
    unit: 'kg',
    pricePerUnit: 220,
    currency: '₹',
    harvestDate: '2026-09-20',
    locationName: 'Madanapalle, Andhra Pradesh',
    latitude: 13.5504,
    longitude: 78.5034,
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant natural red color, deep pungency, sorted by hand. Whole pods in 25kg gunny bags.',
    status: 'available',
    phone: '+91 94900 66778',
    showPhone: true,
    distanceKm: 19.0,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 14).toISOString(),
  },
];

// Local storage key for fallback / offline resilience
const LOCAL_PRODUCE_KEY = 'farmwise_local_produce';
const LOCAL_NOTIFS_KEY = 'farmwise_local_notifs';
const LOCAL_SAVED_KEY = 'farmwise_local_saved';
const LOCAL_HISTORY_KEY = 'farmwise_local_history';
const LOCAL_RECS_KEY = 'farmwise_local_recs';
const LOCAL_SCANS_KEY = 'farmwise_local_scans';
const LOCAL_REPORTS_KEY = 'farmwise_local_reports';

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export function createUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function deduplicateById<T extends { id?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const res: T[] = [];
  for (const item of items) {
    if (item && item.id) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        res.push(item);
      }
    } else if (item) {
      res.push(item);
    }
  }
  return res;
}

// 1. Produce Listings
export async function getProduceListings(): Promise<ProduceListing[]> {
  try {
    const colRef = collection(db, 'produceListings');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = deduplicateById(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProduceListing)));
      // Save locally as cache
      setLocal(LOCAL_PRODUCE_KEY, items);
      return items;
    }
  } catch (err) {
    console.warn('Firestore produce fetch failed, using local cache:', err);
  }

  // Fallback to local storage or initial demo produce
  let local = deduplicateById(getLocal<ProduceListing[]>(LOCAL_PRODUCE_KEY, []));
  if (local.length === 0) {
    local = deduplicateById(INITIAL_DEMO_PRODUCE);
    setLocal(LOCAL_PRODUCE_KEY, local);
  }
  return local;
}

export async function addProduceListing(listing: Omit<ProduceListing, 'id'>): Promise<ProduceListing> {
  const newId = createUniqueId('prod');
  const fullListing: ProduceListing = {
    ...listing,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'produceListings', newId);
    await setDoc(docRef, fullListing);
  } catch (err) {
    console.warn('Saving produce to Firestore failed, saving locally:', err);
  }

  // Also update local cache without duplicate
  const local = deduplicateById(getLocal<ProduceListing[]>(LOCAL_PRODUCE_KEY, INITIAL_DEMO_PRODUCE));
  const filtered = local.filter((p) => p.id !== newId);
  const updated = deduplicateById([fullListing, ...filtered]);
  setLocal(LOCAL_PRODUCE_KEY, updated);

  return fullListing;
}

export async function updateProduceListing(id: string, updates: Partial<ProduceListing>): Promise<void> {
  try {
    const docRef = doc(db, 'produceListings', id);
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Update produce in Firestore failed, updating local cache:', err);
  }

  const local = deduplicateById(getLocal<ProduceListing[]>(LOCAL_PRODUCE_KEY, INITIAL_DEMO_PRODUCE));
  const updated = deduplicateById(local.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)));
  setLocal(LOCAL_PRODUCE_KEY, updated);
}

export async function deleteProduceListing(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'produceListings', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Delete produce from Firestore failed, removing locally:', err);
  }

  const local = deduplicateById(getLocal<ProduceListing[]>(LOCAL_PRODUCE_KEY, INITIAL_DEMO_PRODUCE));
  setLocal(
    LOCAL_PRODUCE_KEY,
    deduplicateById(local.filter((p) => p.id !== id))
  );
}

// 2. Crop Recommendations
export async function saveCropRecommendation(rec: CropRecommendationRecord): Promise<void> {
  const id = createUniqueId('rec');
  const record = { ...rec, id };

  try {
    const docRef = doc(db, 'cropRecommendations', id);
    await setDoc(docRef, record);
  } catch (err) {
    console.warn('Saving recommendation in Firestore failed:', err);
  }

  const local = deduplicateById(getLocal<CropRecommendationRecord[]>(LOCAL_RECS_KEY, []));
  setLocal(LOCAL_RECS_KEY, deduplicateById([record, ...local]));
}

export async function getUserRecommendations(userId: string): Promise<CropRecommendationRecord[]> {
  try {
    const colRef = collection(db, 'cropRecommendations');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return deduplicateById(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CropRecommendationRecord)));
    }
  } catch (err) {
    console.warn('Fetching recommendations failed:', err);
  }

  const local = deduplicateById(getLocal<CropRecommendationRecord[]>(LOCAL_RECS_KEY, []));
  return local.filter((r) => r.userId === userId);
}

// 3. Crop Scans
export async function saveCropScan(scan: CropScanRecord): Promise<void> {
  const id = createUniqueId('scan');
  const record = { ...scan, id };

  try {
    const docRef = doc(db, 'cropScans', id);
    await setDoc(docRef, record);
  } catch (err) {
    console.warn('Saving scan in Firestore failed:', err);
  }

  const local = deduplicateById(getLocal<CropScanRecord[]>(LOCAL_SCANS_KEY, []));
  setLocal(LOCAL_SCANS_KEY, deduplicateById([record, ...local]));
}

export async function getUserCropScans(userId: string): Promise<CropScanRecord[]> {
  try {
    const colRef = collection(db, 'cropScans');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return deduplicateById(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CropScanRecord)));
    }
  } catch (err) {
    console.warn('Fetching scans failed:', err);
  }

  const local = deduplicateById(getLocal<CropScanRecord[]>(LOCAL_SCANS_KEY, []));
  return local.filter((s) => s.userId === userId);
}

// 4. Notifications
export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  const demoNotifs: NotificationItem[] = [
    {
      id: 'notif-1',
      userId,
      title: 'Optimal Sowing Window Approaching',
      message: 'Groundnut and pulse sowing window starts next week following favorable soil moisture reports.',
      type: 'weather',
      isRead: false,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    },
    {
      id: 'notif-2',
      userId,
      title: 'Produce Listing Published',
      message: 'Your listing for "Fresh Pod Groundnuts" is live and visible to nearby citizens in Tirupati.',
      type: 'produce',
      isRead: true,
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    },
    {
      id: 'notif-3',
      userId,
      title: 'Spray Advisory: Rain Expected',
      message: 'Meteorological sensors forecast rain tomorrow evening. Hold off on bio-fungicide sprays.',
      type: 'weather',
      isRead: false,
      createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
    },
  ];

  try {
    const colRef = collection(db, 'notifications');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return deduplicateById(snap.docs.map((d) => ({ id: d.id, ...d.data() } as NotificationItem)));
    }
  } catch (err) {
    console.warn('Fetching notifications failed:', err);
  }

  const local = deduplicateById(getLocal<NotificationItem[]>(LOCAL_NOTIFS_KEY, demoNotifs));
  return local.filter((n) => n.userId === userId || n.userId.startsWith('demo'));
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { isRead: true });
  } catch (err) {
    console.warn('Mark notif read failed:', err);
  }

  const local = deduplicateById(getLocal<NotificationItem[]>(LOCAL_NOTIFS_KEY, []));
  const updated = deduplicateById(local.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  setLocal(LOCAL_NOTIFS_KEY, updated);
}

// 5. Saved Items (Farms / Produce)
export async function getSavedItems(userId: string): Promise<SavedItem[]> {
  try {
    const colRef = collection(db, 'savedItems');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return deduplicateById(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedItem)));
    }
  } catch (err) {
    console.warn('Fetching saved items failed:', err);
  }

  const local = deduplicateById(getLocal<SavedItem[]>(LOCAL_SAVED_KEY, []));
  return local.filter((s) => s.userId === userId);
}

export async function toggleSaveItem(
  userId: string,
  targetId: string,
  type: 'farm' | 'produce',
  title: string,
  subtitle: string,
  imageUrl?: string
): Promise<boolean> {
  const local = deduplicateById(getLocal<SavedItem[]>(LOCAL_SAVED_KEY, []));
  const existingIndex = local.findIndex((s) => s.userId === userId && s.targetId === targetId);

  if (existingIndex >= 0) {
    // Remove
    const toRemove = local[existingIndex];
    local.splice(existingIndex, 1);
    setLocal(LOCAL_SAVED_KEY, deduplicateById(local));
    try {
      await deleteDoc(doc(db, 'savedItems', toRemove.id));
    } catch (e) {
      console.warn('Delete saved item in Firestore failed:', e);
    }
    return false; // now unsaved
  } else {
    // Add
    const newId = createUniqueId('saved');
    const newItem: SavedItem = {
      id: newId,
      userId,
      targetId,
      type,
      title,
      subtitle,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    local.unshift(newItem);
    setLocal(LOCAL_SAVED_KEY, deduplicateById(local));
    try {
      await setDoc(doc(db, 'savedItems', newId), newItem);
    } catch (e) {
      console.warn('Save item in Firestore failed:', e);
    }
    return true; // now saved
  }
}

// 6. Farming Journey History
export async function getFarmingHistory(userId: string): Promise<FarmingHistoryRecord[]> {
  const defaultHistory: FarmingHistoryRecord[] = [
    {
      id: 'hist-1',
      userId,
      year: '2025-26',
      season: 'Kharif',
      cropName: 'Groundnut (Kadiri-6)',
      areaAcres: 2.5,
      harvestYield: '36 Quintals (14.4 q/acre)',
      notes: 'Applied Trichoderma seed treatment and vermicompost. High pod filling and zero root rot.',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 120).toISOString(),
    },
    {
      id: 'hist-2',
      userId,
      year: '2025-26',
      season: 'Rabi',
      cropName: 'Country Tomato (Desi)',
      areaAcres: 1.0,
      harvestYield: '22 Tons',
      notes: 'Inter-cropped with marigold for nematode and borer control. Sold directly to local buyers via FarmWise.',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 45).toISOString(),
    },
    {
      id: 'hist-3',
      userId,
      year: '2024-25',
      season: 'Kharif',
      cropName: 'Red Gram (Pigeon Pea)',
      areaAcres: 2.0,
      harvestYield: '18 Quintals',
      notes: 'Rainfed parcel with high soil nitrogen enhancement for following season.',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 380).toISOString(),
    },
  ];

  try {
    const colRef = collection(db, 'farmingHistory');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return deduplicateById(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FarmingHistoryRecord)));
    }
  } catch (err) {
    console.warn('Fetching farming history failed:', err);
  }

  const local = deduplicateById(getLocal<FarmingHistoryRecord[]>(LOCAL_HISTORY_KEY, defaultHistory));
  return local.filter((h) => h.userId === userId || h.userId.startsWith('demo'));
}

export async function addFarmingHistory(record: Omit<FarmingHistoryRecord, 'id' | 'createdAt'>): Promise<void> {
  const id = createUniqueId('hist');
  const full: FarmingHistoryRecord = {
    ...record,
    id,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'farmingHistory', id), full);
  } catch (err) {
    console.warn('Add farming history failed in Firestore:', err);
  }

  const local = deduplicateById(getLocal<FarmingHistoryRecord[]>(LOCAL_HISTORY_KEY, []));
  setLocal(LOCAL_HISTORY_KEY, deduplicateById([full, ...local]));
}

// 7. Listing Reports (Citizen Protection & Admin Moderation)
export async function submitListingReport(report: Omit<ListingReportRecord, 'id' | 'createdAt'>): Promise<void> {
  const id = createUniqueId('rep');
  const full: ListingReportRecord = {
    ...report,
    id,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'listingReports', id), full);
  } catch (err) {
    console.warn('Submit report in Firestore failed:', err);
  }

  const local = deduplicateById(getLocal<ListingReportRecord[]>(LOCAL_REPORTS_KEY, []));
  setLocal(LOCAL_REPORTS_KEY, deduplicateById([full, ...local]));
}

export async function getListingReports(): Promise<ListingReportRecord[]> {
  try {
    const colRef = collection(db, 'listingReports');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return deduplicateById(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ListingReportRecord)));
    }
  } catch (err) {
    console.warn('Fetching listing reports failed:', err);
  }

  return deduplicateById(getLocal<ListingReportRecord[]>(LOCAL_REPORTS_KEY, [
    {
      id: 'rep-demo-1',
      reporterId: 'citizen-demo-4',
      produceId: 'prod-chilli-5',
      produceTitle: 'Guntur Sannam Red Chillies',
      reason: 'incorrect_info',
      details: 'Farmer updated pickup location to a different village not listed on profile.',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    },
  ]));
}
