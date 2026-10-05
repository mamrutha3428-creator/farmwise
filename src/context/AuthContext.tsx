import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, FarmerProfile, UserRole } from '../types';
import { useI18n } from './I18nContext';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole;
  activeRole: UserRole;
  farmerProfile: FarmerProfile | null;
  loading: boolean;
  loginWithGoogle: (defaultRole?: UserRole) => Promise<void>;
  loginDemo: (role: UserRole) => void;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  setActiveRole: (role: UserRole) => void;
  updateFarmerProfile: (profile: Partial<FarmerProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { language, setLanguage } = useI18n();

  // Explicit, persistent activeRole state
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('farmwise_active_role');
      if (saved === 'farmer' || saved === 'citizen' || saved === 'admin') {
        return saved as UserRole;
      }
    } catch (e) {
      console.warn('Could not read farmwise_active_role:', e);
    }
    return 'farmer';
  });

  // Keep the latest role selection available to async Firebase callbacks.
  // This prevents an older authentication request from changing the UI
  // back to Farmer after the user has selected Citizen or Admin.
  const activeRoleRef = useRef<UserRole>(activeRole);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          // Check if user has an explicit active role in localStorage
          const savedActive = localStorage.getItem('farmwise_active_role') as UserRole | null;
          const chosenRole = (savedActive === 'farmer' || savedActive === 'citizen' || savedActive === 'admin')
            ? savedActive
            : 'farmer';

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            const finalRole = savedActive ? chosenRole : (data.role || 'farmer');
            const latestSavedRole = localStorage.getItem('farmwise_active_role') as UserRole | null;
            const effectiveRole =
              latestSavedRole === 'farmer' || latestSavedRole === 'citizen' || latestSavedRole === 'admin'
                ? latestSavedRole
                : finalRole;
            activeRoleRef.current = effectiveRole;
            setUser({ ...data, role: effectiveRole });
            setActiveRole(effectiveRole);
            localStorage.setItem('farmwise_active_role', effectiveRole);

            if (data.language && data.language !== language) {
              setLanguage(data.language);
            }
          } else {
            // New user registration
            const newUser: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Farmer Friend',
              photoURL: fbUser.photoURL || undefined,
              role: chosenRole,
              language,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userRef, newUser);
            const latestSavedRole = localStorage.getItem('farmwise_active_role') as UserRole | null;
            const effectiveRole =
              latestSavedRole === 'farmer' || latestSavedRole === 'citizen' || latestSavedRole === 'admin'
                ? latestSavedRole
                : chosenRole;
            activeRoleRef.current = effectiveRole;
            setUser({ ...newUser, role: effectiveRole });
            setActiveRole(effectiveRole);
            localStorage.setItem('farmwise_active_role', effectiveRole);
          }

          // Fetch farmer profile if farmer
          const farmerRef = doc(db, 'farmerProfiles', fbUser.uid);
          const fSnap = await getDoc(farmerRef);
          if (fSnap.exists()) {
            setFarmerProfile(fSnap.data() as FarmerProfile);
          } else {
            const defaultFarmerProfile: FarmerProfile = {
              userId: fbUser.uid,
              farmName: `${fbUser.displayName || 'Green Acres'} Farm`,
              locationName: 'Tirupati, Andhra Pradesh',
              district: 'Tirupati',
              state: 'Andhra Pradesh',
              farmSizeAcres: 3.5,
              soilType: 'Red Sandy Loam',
              waterSource: 'Borewell & Drip Irrigation',
              irrigationType: 'Drip System',
              currentCrops: 'Groundnut, Tomato, Red Gram',
              phone: '+91 98765 43210',
              showPhone: true,
              bio: 'Smallholder natural farmer practicing sustainable multi-cropping and soil revitalization.',
              farmingExperienceYears: 8,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(farmerRef, defaultFarmerProfile);
            setFarmerProfile(defaultFarmerProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        // If no firebaseUser and demo user in localStorage, restore
        const savedDemo = localStorage.getItem('farmwise_demo_user');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            const savedActive = localStorage.getItem('farmwise_active_role') as UserRole | null;
            const chosenRole = (savedActive === 'farmer' || savedActive === 'citizen' || savedActive === 'admin')
              ? savedActive
              : (parsed.user?.role || 'farmer');

            activeRoleRef.current = chosenRole;
            setUser({ ...parsed.user, role: chosenRole });
            setActiveRole(chosenRole);
            setFarmerProfile(parsed.farmerProfile);
          } catch (e) {
            setUser(null);
            setFarmerProfile(null);
          }
        } else {
          setUser(null);
          setFarmerProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync language changes to Firestore when authenticated
  useEffect(() => {
    if (user && user.language !== language) {
      setUser((prev) => (prev ? { ...prev, language } : null));
      if (firebaseUser) {
        updateDoc(doc(db, 'users', firebaseUser.uid), { language }).catch((err) =>
          console.warn('Could not sync language to user doc:', err)
        );
      } else {
        // Sync to demo localStorage
        const savedDemo = localStorage.getItem('farmwise_demo_user');
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          parsed.user.language = language;
          localStorage.setItem('farmwise_demo_user', JSON.stringify(parsed));
        }
      }
    }
  }, [language]);

  const loginWithGoogle = async (defaultRole: UserRole = 'farmer') => {
    setLoading(true);
    try {
      localStorage.removeItem('farmwise_demo_user');
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', result.user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const newUser: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Farm Friend',
          photoURL: result.user.photoURL || undefined,
          role: defaultRole,
          language,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = (roleToLogin: UserRole) => {
    setLoading(true);
    activeRoleRef.current = roleToLogin;
    setActiveRole(roleToLogin);
    try {
      localStorage.setItem('farmwise_active_role', roleToLogin);
    } catch (e) {}

    const demoId = roleToLogin === 'farmer' ? 'demo_farmer_ravi' : roleToLogin === 'citizen' ? 'demo_citizen_priya' : 'demo_admin';
    const demoUser: UserProfile = {
      uid: demoId,
      email: `${demoId}@farmwise.app`,
      displayName: roleToLogin === 'farmer' ? 'Ravi Kumar' : roleToLogin === 'citizen' ? 'Priya Sharma' : 'FarmWise Mod',
      role: roleToLogin,
      language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const demoFarmer: FarmerProfile = {
      userId: demoId,
      farmName: 'Ravi Organic Naturals',
      locationName: 'Tirupati, Andhra Pradesh',
      district: 'Tirupati',
      state: 'Andhra Pradesh',
      farmSizeAcres: 3,
      soilType: 'Red Loam with Organic Compost',
      waterSource: 'Borewell & Solar Pump',
      irrigationType: 'Micro Drip',
      currentCrops: 'Groundnut, Tomatoes, Moringa',
      phone: '+91 94401 23456',
      showPhone: true,
      bio: 'Practicing chemical-conscious natural farming for over 10 years. Direct farm-gate produce available in seasonal batches.',
      farmingExperienceYears: 10,
    };

    localStorage.setItem(
      'farmwise_demo_user',
      JSON.stringify({ user: demoUser, farmerProfile: demoFarmer })
    );
    setUser(demoUser);
    setFarmerProfile(demoFarmer);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('farmwise_demo_user');
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('SignOut warning:', err);
    }
    setUser(null);
    setFarmerProfile(null);
    setLoading(false);
  };

  const switchRole = async (newRole: UserRole) => {
    // Update the UI first. Role switching must never wait for Firebase.
    activeRoleRef.current = newRole;
    setActiveRole(newRole);

    try {
      localStorage.setItem('farmwise_active_role', newRole);
    } catch (e) {
      console.warn('Could not persist farmwise_active_role:', e);
    }

    // Keep the in-memory profile consistent with the selected experience.
    if (user) {
      const updated = { ...user, role: newRole, updatedAt: new Date().toISOString() };
      setUser(updated);

      // Persist to Firebase in the background. A Firestore failure must
      // never prevent the Citizen/Farmer/Admin dashboard from switching.
      if (firebaseUser) {
        try {
          await updateDoc(doc(db, 'users', firebaseUser.uid), { role: newRole });
        } catch (err) {
          console.warn('Could not update role in Firestore:', err);
        }
      } else {
        const savedDemo = localStorage.getItem('farmwise_demo_user');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            parsed.user.role = newRole;
            localStorage.setItem('farmwise_demo_user', JSON.stringify(parsed));
          } catch (e) {
            console.warn('Could not persist demo role:', e);
          }
        }
      }
    }
  };

  const updateFarmerProfile = async (profileData: Partial<FarmerProfile>) => {
    if (!user) return;
    const updated = {
      ...(farmerProfile || {}),
      ...profileData,
      userId: user.uid,
      updatedAt: new Date().toISOString(),
    } as FarmerProfile;

    setFarmerProfile(updated);

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'farmerProfiles', user.uid), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `farmerProfiles/${user.uid}`);
      }
    } else {
      const savedDemo = localStorage.getItem('farmwise_demo_user');
      if (savedDemo) {
        const parsed = JSON.parse(savedDemo);
        parsed.farmerProfile = updated;
        localStorage.setItem('farmwise_demo_user', JSON.stringify(parsed));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        role: activeRole,
        activeRole,
        farmerProfile,
        loading,
        loginWithGoogle,
        loginDemo,
        logout,
        switchRole,
        setActiveRole,
        updateFarmerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
