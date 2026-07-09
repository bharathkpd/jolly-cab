import { create } from 'zustand';
import { auth, db } from '../services/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserSession {
  phone: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  verificationId: string | null;
  sentPhone: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendOtp: (phone: string, verifier: any) => Promise<boolean>;
  verifyOtp: (code: string, name?: string) => Promise<boolean>;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize from localStorage for persistence
  const savedUserJson = localStorage.getItem('jolly_cabs_user');
  let savedUser: UserSession | null = null;
  if (savedUserJson) {
    try {
      savedUser = JSON.parse(savedUserJson);
    } catch (e) {
      localStorage.removeItem('jolly_cabs_user');
    }
  }

  return {
    user: savedUser,
    isAuthenticated: !!savedUser,
    isAdmin: savedUser?.role === 'admin',
    verificationId: null,
    sentPhone: null,
    isLoading: false,
    error: null,

    sendOtp: async (phone, verifier) => {
      set({ isLoading: true, error: null });
      try {
        // Format phone to standard E.164 (+91 followed by 10 digits)
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+91' + formattedPhone.replace(/\D/g, '').slice(-10);
        }

        const BYPASS_FIREBASE_AUTH = true; // Set to false to re-enable live Firebase Phone OTP

        if (BYPASS_FIREBASE_AUTH) {
          const newUser: UserSession = {
            phone: formattedPhone,
            name: 'Jolly Rider',
            role: 'customer'
          };
          localStorage.setItem('jolly_cabs_user', JSON.stringify(newUser));
          set({
            user: newUser,
            isAuthenticated: true,
            isAdmin: false,
            verificationId: null,
            sentPhone: null,
            isLoading: false
          });
          return true;
        }

        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
        (window as any).confirmationResult = confirmationResult;

        set({
          verificationId: 'firebase_session',
          sentPhone: phone,
          isLoading: false
        });
        return true;
      } catch (err: any) {
        let msg = err.message || 'Failed to send OTP.';
        if (err.code === 'auth/invalid-phone-number') {
          msg = 'Please enter a valid 10-digit mobile number.';
        }
        set({ error: msg, isLoading: false });
        return false;
      }
    },

    verifyOtp: async (code, name = 'Jolly Rider') => {
      set({ isLoading: true, error: null });
      try {
        const confirmationResult = (window as any).confirmationResult;
        if (!confirmationResult) {
          throw new Error('Session expired. Please request OTP again.');
        }

        const result = await confirmationResult.confirm(code);
        const firebaseUser = result.user;
        if (!firebaseUser) {
          throw new Error('Verification failed. Invalid user session.');
        }

        // Fetch or create user in Firestore users collection
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        
        let userName = name.trim() || 'Jolly Rider';
        let role: 'customer' | 'admin' = 'customer';

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          if (userData.name) {
            userName = userData.name;
          }
          if (userData.role) {
            role = userData.role;
          }
        } else {
          // Store every authenticated user in the users collection
          await setDoc(userDocRef, {
            uid: firebaseUser.uid,
            phone: firebaseUser.phoneNumber || '',
            name: userName,
            role: 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        const newUser: UserSession = {
          phone: firebaseUser.phoneNumber || '',
          name: userName,
          role: role
        };

        localStorage.setItem('jolly_cabs_user', JSON.stringify(newUser));

        set({
          user: newUser,
          isAuthenticated: true,
          isAdmin: role === 'admin',
          verificationId: null,
          sentPhone: null,
          isLoading: false
        });
        return true;
      } catch (err: any) {
        let msg = err.message || 'OTP verification failed.';
        if (err.code === 'auth/invalid-verification-code') {
          msg = 'Invalid OTP. Please enter the correct 6-digit code sent to your mobile.';
        }
        set({ error: msg, isLoading: false });
        return false;
      }
    },

    loginAdmin: async (username, password) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (
          (username === 'admin' && password === 'jollyadmin') ||
          (username === 'admin@jollycabs.in' && password === 'admin123')
        ) {
          const adminUser: UserSession = {
            phone: '9999999999',
            name: 'Jolly Admin Manager',
            role: 'admin'
          };
          localStorage.setItem('jolly_cabs_user', JSON.stringify(adminUser));
          set({
            user: adminUser,
            isAuthenticated: true,
            isAdmin: true,
            isLoading: false
          });
          return true;
        } else {
          throw new Error('Invalid Admin credentials.');
        }
      } catch (err: any) {
        set({ error: err.message || 'Admin login failed.', isLoading: false });
        return false;
      }
    },

    logout: () => {
      signOut(auth).catch(() => {});
      localStorage.removeItem('jolly_cabs_user');
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        verificationId: null,
        sentPhone: null,
        error: null
      });
    },

    clearError: () => set({ error: null })
  };
});

// Subscribe to Firebase Auth changes immediately to keep session active
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      let userName = 'Jolly Rider';
      let role: 'customer' | 'admin' = 'customer';
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        userName = userData.name || 'Jolly Rider';
        role = userData.role || 'customer';
      }
      
      const newUser = {
        phone: firebaseUser.phoneNumber || '',
        name: userName,
        role: role
      };
      
      localStorage.setItem('jolly_cabs_user', JSON.stringify(newUser));
      useAuthStore.setState({
        user: newUser,
        isAuthenticated: true,
        isAdmin: role === 'admin',
        isLoading: false
      });
    } catch (e) {
      console.error('Error fetching Firestore user session:', e);
    }
  } else {
    // Keep local session if it's admin (mock admin bypass)
    const savedUserJson = localStorage.getItem('jolly_cabs_user');
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        if (savedUser.role === 'admin') {
          useAuthStore.setState({
            user: savedUser,
            isAuthenticated: true,
            isAdmin: true
          });
          return;
        }
      } catch (e) {}
    }
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isAdmin: false
    });
  }
});
