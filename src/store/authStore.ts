import { create } from 'zustand';
import { auth, db } from '../services/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface UserSession {
  uid: string;
  phone: string;
  name: string;
  role: 'customer' | 'admin';
  loginType: 'firebase' | 'mock' | 'admin';
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authReady: boolean; // true once Firebase has resolved initial auth state
  verificationId: string | null;
  sentPhone: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => void;
  sendOtp: (phone: string, verifier: RecaptchaVerifier | null) => Promise<boolean>;
  verifyOtp: (code: string, name?: string) => Promise<boolean>;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUserName: (name: string) => Promise<void>;
}

const loadSavedUser = (): UserSession | null => {
  try {
    const json = localStorage.getItem('jolly_cabs_user');
    if (!json) return null;
    return JSON.parse(json) as UserSession;
  } catch {
    localStorage.removeItem('jolly_cabs_user');
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => {
  return {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    authReady: false,
    verificationId: null,
    sentPhone: null,
    isLoading: false,
    error: null,

    initializeAuth: () => {
      // Check localStorage immediately for instant UI (mock / admin sessions)
      const savedUser = loadSavedUser();
      if (savedUser && (savedUser.loginType === 'mock' || savedUser.loginType === 'admin')) {
        set({
          user: savedUser,
          isAuthenticated: true,
          isAdmin: savedUser.role === 'admin',
          authReady: true
        });
        return;
      }

      // Subscribe to Firebase auth state — this handles Firebase sessions
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(userDocRef);
            let userName = savedUser?.name || 'Jolly Rider';
            let role: 'customer' | 'admin' = 'customer';

            if (snap.exists()) {
              const data = snap.data();
              userName = data.name || userName;
              role = data.role || 'customer';
            }

            const sessionUser: UserSession = {
              uid: firebaseUser.uid,
              phone: firebaseUser.phoneNumber || '',
              name: userName,
              role,
              loginType: 'firebase'
            };

            localStorage.setItem('jolly_cabs_user', JSON.stringify(sessionUser));
            set({
              user: sessionUser,
              isAuthenticated: true,
              isAdmin: role === 'admin',
              authReady: true
            });
          } catch (e) {
            console.error('Error fetching Firestore user on auth state:', e);
            // Fallback to savedUser if exists
            if (savedUser && savedUser.loginType === 'firebase') {
              set({
                user: savedUser,
                isAuthenticated: true,
                isAdmin: savedUser.role === 'admin',
                authReady: true
              });
            } else {
              set({ user: null, isAuthenticated: false, isAdmin: false, authReady: true });
            }
          }
        } else {
          // No Firebase session — clear unless mock/admin
          const current = loadSavedUser();
          if (current && (current.loginType === 'mock' || current.loginType === 'admin')) {
            set({
              user: current,
              isAuthenticated: true,
              isAdmin: current.role === 'admin',
              authReady: true
            });
          } else {
            localStorage.removeItem('jolly_cabs_user');
            set({ user: null, isAuthenticated: false, isAdmin: false, authReady: true });
          }
        }
      });
    },

    sendOtp: async (phone, verifier) => {
      set({ isLoading: true, error: null });
      try {
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+91' + formattedPhone.replace(/\D/g, '').slice(-10);
        }

        try {
          if (!verifier) throw new Error('reCAPTCHA not ready.');
          const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
          (window as any).confirmationResult = confirmationResult;
          (window as any).loginType = 'firebase';
          set({ verificationId: 'firebase_session', sentPhone: formattedPhone, isLoading: false });
          return true;
        } catch (firebaseErr: any) {
          console.warn('Firebase Phone Auth fallback:', firebaseErr.message);
          (window as any).confirmationResult = null;
          (window as any).loginType = 'mock';
          (window as any).mockOtpCode = '123456';
          set({ verificationId: 'mock_session', sentPhone: formattedPhone, isLoading: false });
          return true;
        }
      } catch (err: any) {
        set({ error: err.message || 'Failed to send OTP.', isLoading: false });
        return false;
      }
    },

    verifyOtp: async (code, name = 'Jolly Rider') => {
      set({ isLoading: true, error: null });
      try {
        const loginType = (window as any).loginType || 'mock';
        let phoneStr = get().sentPhone || '';
        let uid = 'mock_uid_' + Date.now();
        let role: 'customer' | 'admin' = 'customer';
        let resolvedName = name;

        if (loginType === 'firebase') {
          const confirmationResult = (window as any).confirmationResult;
          if (!confirmationResult) throw new Error('Session expired. Please request OTP again.');

          const result = await confirmationResult.confirm(code);
          const firebaseUser = result.user;
          if (!firebaseUser) throw new Error('Verification failed.');

          uid = firebaseUser.uid;
          phoneStr = firebaseUser.phoneNumber || phoneStr;

          try {
            const userDocRef = doc(db, 'users', uid);
            const snap = await getDoc(userDocRef);
            if (snap.exists()) {
              const data = snap.data();
              resolvedName = data.name || name;
              role = data.role || 'customer';
            } else {
              await setDoc(userDocRef, {
                uid,
                phone: phoneStr,
                name: resolvedName,
                role: 'customer',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            }
          } catch (fsErr) {
            console.error('Firestore error during verify:', fsErr);
          }
        } else {
          const expected = (window as any).mockOtpCode || '123456';
          if (code !== expected) {
            throw new Error('Invalid OTP. For demo mode enter: 123456');
          }
          try {
            const userDocRef = doc(db, 'users', uid);
            await setDoc(userDocRef, {
              uid,
              phone: phoneStr,
              name: resolvedName,
              role: 'customer',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } catch { /* offline — continue */ }
        }

        const newUser: UserSession = {
          uid,
          phone: phoneStr,
          name: resolvedName,
          role,
          loginType: loginType as 'firebase' | 'mock'
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
          msg = 'Invalid OTP. Please check the code sent to your phone.';
        }
        set({ error: msg, isLoading: false });
        return false;
      }
    },

    loginAdmin: async (username, password) => {
      set({ isLoading: true, error: null });
      try {
        await new Promise((r) => setTimeout(r, 800));
        const validCredentials =
          (username === 'admin' && password === 'jollyadmin') ||
          (username === 'admin@jollycabs.in' && password === 'admin123');

        if (validCredentials) {
          const adminUser: UserSession = {
            uid: 'admin_uid',
            phone: '9999999999',
            name: 'Jolly Admin',
            role: 'admin',
            loginType: 'admin'
          };
          localStorage.setItem('jolly_cabs_user', JSON.stringify(adminUser));
          set({ user: adminUser, isAuthenticated: true, isAdmin: true, isLoading: false });
          return true;
        } else {
          throw new Error('Invalid admin credentials.');
        }
      } catch (err: any) {
        set({ error: err.message || 'Admin login failed.', isLoading: false });
        return false;
      }
    },

    logout: () => {
      signOut(auth).catch(() => {});
      localStorage.removeItem('jolly_cabs_user');
      localStorage.removeItem('jolly_cabs_onboarding');
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        authReady: true,
        verificationId: null,
        sentPhone: null,
        error: null
      });
    },

    updateUserName: async (name: string) => {
      const { user } = get();
      if (!user) return;
      const updated = { ...user, name };
      localStorage.setItem('jolly_cabs_user', JSON.stringify(updated));
      set({ user: updated });
      try {
        await updateDoc(doc(db, 'users', user.uid), { name, updatedAt: new Date().toISOString() });
      } catch { /* offline */ }
    },

    clearError: () => set({ error: null })
  };
});
