import { create } from 'zustand';
import { auth } from '../../lib/firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut, 
    onAuthStateChanged 
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
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
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
                set({ 
                    user: { 
                        id: firebaseUser.uid, 
                        email: firebaseUser.email || '', 
                        full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                        role: 'farmer'
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
        
        login: async (email, password) => {
            set({ isLoading: true });
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // State updates via onAuthStateChanged
            } catch (error: any) {
                console.error('Login failed:', error);
                set({ isLoading: false });
                alert(`Login failed: ${error.message}`);
                throw error;
            }
        },

        register: async (email, password, _name) => {
            set({ isLoading: true });
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                // Ideally, you update the firebase profile here with the name.
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
