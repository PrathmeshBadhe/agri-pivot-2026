import { create } from 'zustand';
import { supabase } from '../../lib/supabase';

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
    logout: () => Promise<void>;
    updateProfile: (name: string) => void;
}

const getStoredUser = (): User | null => {
    try {
        const stored = localStorage.getItem('agri_user');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const useAuth = create<AuthState>((set) => ({
    user: getStoredUser(),
    isLoading: false,
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.user) {
                const newUser: User = {
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: data.user.user_metadata?.full_name,
                    role: data.user.user_metadata?.role as 'farmer' | 'trader' | undefined,
                };
                localStorage.setItem('agri_user', JSON.stringify(newUser));
                set({ user: newUser });
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Use farmer@agri.com / demo');
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('agri_user');
        set({ user: null });
    },
    updateProfile: (name: string) => {
        set((state) => {
            if (!state.user) return state;
            const updatedUser = { ...state.user, full_name: name };
            localStorage.setItem('agri_user', JSON.stringify(updatedUser));
            return { user: updatedUser };
        });
    }
}));
