import { useEffect } from 'react';
import { useAuth } from './features/auth/useAuth';
import { LoginPage } from './features/auth/LoginPage';
import { Dashboard } from './features/dashboard/Dashboard';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    const { user, isLoading } = useAuth();

    // Optional: Auto-login logic could go here if checking session
    // For now, mock starts null.

    if (isLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div></div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
