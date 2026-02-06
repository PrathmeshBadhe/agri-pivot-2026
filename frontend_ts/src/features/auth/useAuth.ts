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
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.user) {
                set({
                    user: {
                        id: data.user.id,
                        email: data.user.email!,
                        full_name: data.user.user_metadata?.full_name,
                        role: data.user.user_metadata?.role as 'farmer' | 'trader' | undefined,
                    }
                });
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
        set({ user: null });
    },
}));
