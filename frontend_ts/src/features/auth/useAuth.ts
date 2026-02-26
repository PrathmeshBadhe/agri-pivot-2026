import { create } from 'zustand';

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

const DEMO_CREDENTIALS = {
    email: 'farmer@agri.com',
    password: 'demo',
    user: {
        id: 'demo-user-001',
        email: 'farmer@agri.com',
        full_name: 'Agri Farmer',
        role: 'farmer' as const,
    },
};

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
            // Simulate network delay
            await new Promise((r) => setTimeout(r, 600));

            if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
                const newUser: User = { ...DEMO_CREDENTIALS.user };
                localStorage.setItem('agri_user', JSON.stringify(newUser));
                set({ user: newUser });
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Use farmer@agri.com / demo');
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
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
