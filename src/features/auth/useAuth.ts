import { create } from 'zustand';
import { auth } from '../../lib/firebase';
import {
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut, 
    onAuthStateChanged,
    updateProfile as firebaseUpdateProfile
} from 'firebase/auth';

interface User {
    id: string;
    email: string;
    full_name?: string;
    role?: 'farmer' | 'trader';
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string, role: string) => Promise<void>;
    register: (email: string, password: string, name: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (name: string) => void;
}

// Global initialization flag to prevent multiple listeners
let isAuthListenerSet = false;

export const useAuth = create<AuthState>((set) => {
    // Setup Firebase listener once
    if (!isAuthListenerSet) {
        isAuthListenerSet = true;
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // If we had stored the profile info like name/role, we could fetch it from firestore here
                const userRole = localStorage.getItem(`role_${firebaseUser.uid}`) as 'farmer' | 'trader' || 'farmer';
                const loginName = firebaseUser.email?.split('@')[0] || 'User';
                const calculatedName = firebaseUser.displayName || localStorage.getItem(`name_${firebaseUser.uid}`) || loginName;
                
                // Force sync the name local storage so TraderNetworkPage can read their "login name"
                localStorage.setItem(`name_${firebaseUser.uid}`, calculatedName);

                set({ 
                    user: { 
                        id: firebaseUser.uid, 
                        email: firebaseUser.email || '', 
                        full_name: calculatedName,
                        role: userRole
                    }, 
                    isLoading: false 
                });
            } else {
                set({ user: null, isLoading: false });
            }
        });
    }

    return {
        user: null, // Initially null, will be updated by onAuthStateChanged
        isLoading: true, // Start loading until Firebase responds
        
        login: async (email, password, role) => {
            set({ isLoading: true });
            try {
                const creds = await signInWithEmailAndPassword(auth, email, password);
                localStorage.setItem(`role_${creds.user.uid}`, role);
                // State updates via onAuthStateChanged
            } catch (error: any) {
                console.error('Login failed:', error);
                set({ isLoading: false });
                alert(`Login failed: ${error.message}`);
                throw error;
            }
        },

        register: async (email, password, name, role) => {
            set({ isLoading: true });
            try {
                const creds = await createUserWithEmailAndPassword(auth, email, password);
                
                // Physically save the typed name to their live Firebase account!
                if (auth.currentUser) {
                    await firebaseUpdateProfile(auth.currentUser, { displayName: name });
                }

                localStorage.setItem(`role_${creds.user.uid}`, role);
                localStorage.setItem(`name_${creds.user.uid}`, name);
                
                // Immediately patchzustand state so the UI snaps to the exact typed name instantly
                set(state => ({
                    user: state.user ? { ...state.user, full_name: name, role: role as any } : null
                }));
                // State updates via onAuthStateChanged
            } catch (error: any) {
                console.error('Registration failed:', error);
                set({ isLoading: false });
                alert(`Registration failed: ${error.message}`);
                throw error;
            }
        },

        logout: async () => {
            await firebaseSignOut(auth);
            // State updates via onAuthStateChanged
        },

        updateProfile: (name: string) => {
            set((state) => {
                if (!state.user) return state;
                return { user: { ...state.user, full_name: name } };
            });
            // Note: In real app, you likely want to updateProfile() on Firebase Auth or Firestore
        }
    };
});
