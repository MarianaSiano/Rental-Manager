import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { User, Product, Rental } from './types';
import { Navbar } from './Components/Navbar';
import { Footer } from './Components/Footer';
import { LoginPage } from './Pages/LoginPage';
import { Dashboard } from './Pages/Dashboard';
import { RentalPage } from './Pages/RentalPage';
import { AdminPage } from './Pages/AdminPage';
import { ProfileSettings } from './Components/ProfileSettings';

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [settings, setSettings] = useState<any>({ return_hour: '08:00', return_location: '', semester_label: '' });
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'dashboard' | 'rent' | 'admin' | 'profile'>('dashboard');

    // Login states
    const [loginError, setLoginError] = useState('');

    // Admin: New User states
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [regSuccess, setRegSuccess] = useState(false);

    useEffect(() => {
        if(user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [productsRes, rentalsRes, settingsRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/rentals'),
                fetch('/api/settings')
            ]);
            const productsData = await productsRes.json();
            const rentalsData = await rentalsRes.json();
            const settingsData = await settingsRes.json();
            setProducts(productsData);
            setRentals(rentalsData);
            setSettings(settingsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (email: string, password: string) => {
        setLoginError('');
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if(res.ok) {
                setUser(data);
            } else {
                setLoginError(data.error || 'Erro ao entrar');
            }
        } catch (error) {
            setLoginError('Erro de conexão com o servidor');
        }
    };

    const handleRegisterUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegSuccess(false);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user?.id,
                    name: newName,
                    email: newEmail,
                    password: newPassword
                })
            });
            if(res.ok) {
                setRegSuccess(true);
                setNewName('');
                setNewEmail('');
                setNewPassword('');
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user?.id,
                    ...settings
                })
            });
            if(res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const handleRent = async (productId: string) => {
        try {
            const res = await fetch('/api/rentals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    productId,
                    startTime: new Date().toISOString(),
                })
            });
            if(res.ok) {
                await fetchData();
                setView('dashboard');
            }
        } catch (error) {
            console.error('Error renting product:', error);
        }
    };

    const handleReturn = async (rentalId: string) => {
        try {
            const res = await fetch(`/api/rentals/${rentalId}/return`, {
                method: 'POST'
            });
            if(res.ok) {
                await fetchData();
            }
        } catch (error) {
            console.error('Error returning product:', error);
        }
    };

    if(!user) {
        return <LoginPage onLogin={handleLogin} error={loginError} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 selection:bg-brand-100 selection:text-brand-900">
            <Navbar user={user} onLogout={() => setUser(null)} />

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-12 bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl w-fit shadow-sm border border-neutral-200 mx-auto sm:mx-0">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'dashboard'
                                ? 'bg-brand-800 text-white shadow-xl shadow-brand-500/10'
                                : 'text-neutral-500 hover:text-brand-600'
                            }`}
                    >
                        Monitorar
                    </button>

                    {user.role === 'admin' ? (
                        <button
                            onClick={() => setView('admin')}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'admin'
                                    ? 'bg-brand-800 text-white shadow-xl shadow-brand-500/10'
                                    : 'text-neutral-500 hover:text-brand-600'
                                }`}
                        >
                            Gestão
                        </button>
                    ) : (
                        <button
                            onClick={() => setView('rent')}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'rent'
                                    ? 'bg-brand-800 text-white shadow-xl shadow-brand-500/10'
                                    : 'text-neutral-500 hover:text-brand-600'
                                }`}
                        >
                            Novo Ativo
                        </button>
                    )}

                    <button
                        onClick={() => setView('profile')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'profile'
                                ? 'bg-brand-800 text-white shadow-xl shadow-brand-500/10'
                                : 'text-neutral-500 hover:text-brand-600'
                            }`}
                    >
                        Perfil
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'dashboard' && (
                        <Dashboard
                            user={user}
                            rentals={rentals}
                            products={products}
                            onReturn={handleReturn}
                        />
                    )}

                    {view === 'rent' && (
                        <RentalPage
                            products={products}
                            settings={settings}
                            onRent={handleRent}
                        />
                    )}

                    {view === 'admin' && (
                        <AdminPage
                            products={products}
                            settings={settings}
                            regSuccess={regSuccess}
                            onRegisterUser={handleRegisterUser}
                            onUpdateSettings={handleUpdateSettings}
                            newName={newName}
                            setNewName={setNewName}
                            newEmail={newEmail}
                            setNewEmail={setNewEmail}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            setSettings={setSettings}
                        />
                    )}

                    {view === 'profile' && (
                        <ProfileSettings
                            user={user}
                            onUpdateUser={(updatedUser) => setUser(updatedUser)}
                        />
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
