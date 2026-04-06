// This is a ROBUST MOCK wrapper for Supabase.
// It allows the UI to be fully developed and tested without requiring a real backend connection immediately.

export const supabase = {
    auth: {
        signInWithPassword: async ({ email, password }: any) => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            if (email === "farmer@agri.com" && password === "demo") {
                return {
                    data: {
                        user: {
                            id: "user_123",
                            email: "farmer@agri.com",
                            user_metadata: { full_name: "Rajesh Kumar", role: "farmer" }
                        },
                        session: { access_token: "mock_token" }
                    },
                    error: null
                };
            }
            return { data: { user: null, session: null }, error: { message: "Invalid credentials" } };
        },
        signOut: async () => {
            return { error: null };
        },
        getUser: async () => {
            // Return null to simulate "not logged in" by default, or check local storage if we were real
            return { data: { user: null }, error: null };
        }
    },
    from: (table: string) => {
        return {
            select: (_columns: string) => {
                // Return a promise that resolves to mock data based on table
                return Promise.resolve({ data: getMockData(table), error: null });
            },
            insert: (data: any) => Promise.resolve({ data, error: null })
        };
    }
};

function getMockData(table: string) {
    if (table === 'market_data') {
        return [
            { date: '2026-02-01', price: 2400, commodity: 'Onion', mandi: 'Pune' },
            { date: '2026-02-02', price: 2450, commodity: 'Onion', mandi: 'Pune' },
        ];
    }
    return [];
}
