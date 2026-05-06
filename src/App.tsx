import React, { useState, useEffect } from 'react';
import {
    Wrench,
    User as UserIcon,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    LogOut,
    Plus,
    ArrowRightLeft,
    DollarSign,
    Mail,
    Lock,
    UserPlus,
    Package,
    Shield,
    PcCase,
    Box,
    LayoutDashboard,
    Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Product, Rental } from './types';

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [settings, setSettings] = useState<any>({ return_hour: '08:00', return_location: '', semester_label: '' });
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'dashboard' | 'rent' | 'admin'>('dashboard');

    // Login states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
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
                alert('Configurações atualizadas com sucesso!');
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

    const getProductIcon = (type: string) => {
        switch (type) {
            case 'equipamento': return <Wrench className="w-6 h-6 text-blue-600" />;
            case 'epi': return <Shield className="w-6 h-6 text-emerald-600" />;
            case 'tecnologia': return <PcCase className="w-6 h-6 text-purple-600" />;
            case 'outros': return <Package className="w-6 h-6 text-amber-600" />;
            default: return <Box className="w-6 h-6 text-neutral-600" />;
        }
    };

    if(!user) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-neutral-100"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-blue-50 rounded-full">
                            <Package className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-center text-neutral-900 mb-2">Multisuporte Manager</h1>
                    <p className="text-neutral-500 text-center mb-8">Gestão Integrada de Equipamentos e Materiais</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {loginError && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            Entrar no Sistema
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-neutral-100">
                        <p className="text-xs text-center text-neutral-400">
                            Dica: Use admin@empresa.com / admin123 para testar como administrador.
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-neutral-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Package className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-bold text-neutral-900 hidden sm:block">Multisuporte</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                                <p className="text-xs text-neutral-500 capitalize">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
                            </div>
                            <button
                                onClick={() => setUser(null)}
                                className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-neutral-200/50 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                    >
                        Dashboard
                    </button>
                    {user.role === 'user' && (
                        <button
                            onClick={() => setView('rent')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'rent' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                        >
                            Novo Aluguel
                        </button>
                    )}
                    {user.role === 'admin' && (
                        <button
                            onClick={() => setView('admin')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${view === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}
                        >
                            Gerenciamento
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {view === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-neutral-900">
                                {user.role === 'admin' ? 'Todos os Aluguéis' : 'Seus Aluguéis'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rentals.filter(r => user.role === 'admin' || r.userId === user.id).map(rental => {
                                    const product = products.find(p => p.id === rental.productId);
                                    return (
                                        <div key={rental.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-neutral-50 rounded-xl">
                                                    {product ? getProductIcon(product.type) : <Box className="w-6 h-6 text-neutral-400" />}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${rental.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                                                    }`}>
                                                    {rental.status === 'active' ? 'Em Uso' : 'Devolvido'}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="font-bold text-neutral-900">{product?.name || 'Produto Carregando...'}</p>
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-sm">Início: {new Date(rental.startTime).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-sm">Vence: {new Date(rental.endTime).toLocaleTimeString()}</span>
                                                </div>

                                                <div className="pt-4 border-t border-neutral-50">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm text-neutral-500">Sinal (50%)</span>
                                                        <span className="text-sm font-bold text-green-600">Pago</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-neutral-500">Restante (50%)</span>
                                                        <span className={`text-sm font-bold ${rental.remainingPaid ? 'text-green-600' : 'text-amber-600'}`}>
                                                            {rental.remainingPaid ? 'Pago' : 'Pendente na Entrega'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {rental.status === 'active' && user.role === 'admin' && (
                                                    <button
                                                        onClick={() => handleReturn(rental.id)}
                                                        className="w-full mt-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                                                    >
                                                        Confirmar Devolução
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {rentals.length === 0 && (
                                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-neutral-200">
                                        <p className="text-neutral-500">Nenhum aluguel encontrado.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {view === 'rent' && (
                        <motion.div
                            key="rent"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="bg-blue-600 rounded-3xl p-8 text-white">
                                <h2 className="text-3xl font-bold mb-2">Solicitar Material</h2>
                                <p className="text-blue-100">Selecione os equipamentos ou EPIs necessários para sua atividade.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-xl font-bold text-neutral-900">Produtos Disponíveis</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {products.filter(c => c.status === 'available').map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleRent(product.id)}
                                                className="p-6 bg-white rounded-2xl border-2 border-transparent hover:border-blue-600 hover:shadow-lg transition-all text-left group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-3 bg-neutral-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                                        {getProductIcon(product.type)}
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                                                        {product.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-500 font-bold mb-1">ID: {product.id}</p>
                                                <p className="text-lg font-bold text-neutral-900">{product.name}</p>
                                                <p className="text-xs text-neutral-400 mt-1">
                                                    Consulte a duração máxima permitida para este item.
                                                </p>
                                                <div className="mt-4 flex items-center gap-1 text-blue-600 font-bold text-sm">
                                                    Alugar Agora <Plus className="w-4 h-4" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                                        <h3 className="font-bold text-neutral-900 mb-4">Resumo do Pagamento</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-neutral-600 mb-4">
                                                <span className="text-sm">Os valores e prazos são definidos conforme a categoria do produto.</span>
                                            </div>
                                            <div className="flex justify-between text-neutral-600">
                                                <span>Valor do Sinal</span>
                                                <span className="font-bold">50% do total</span>
                                            </div>
                                            <div className="flex justify-between text-blue-600 font-bold pt-3 border-t border-neutral-50">
                                                <span>Pagamento Inicial</span>
                                                <span>No balcão</span>
                                            </div>
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Local de Entrega/Devolução</p>
                                                <p className="text-sm text-blue-900 font-medium">{settings.return_location}</p>
                                            </div>
                                            <p className="text-xs text-neutral-400 mt-4 italic">
                                                * O pagamento ou sinal deve ser realizado no ato da retirada.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'admin' && (
                        <motion.div
                            key="admin"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-12"
                        >
                            {/* User Registration Section */}
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <UserPlus className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-neutral-900">Cadastrar Novo Usuário</h2>
                                </div>

                                <form onSubmit={handleRegisterUser} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Nome Completo</label>
                                        <input
                                            type="text"
                                            required
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Nome do usuário"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">E-mail</label>
                                        <input
                                            type="email"
                                            required
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="usuario@empresa.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Senha Temporária</label>
                                        <input
                                            type="text"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Senha inicial"
                                        />
                                    </div>
                                    <div className="md:col-span-3 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
                                        >
                                            Cadastrar Usuário
                                        </button>
                                    </div>
                                </form>
                                {regSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        Usuário cadastrado com sucesso!
                                    </motion.div>
                                )}
                            </section>

                            {/* Inventory Section */}
                            <section className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-neutral-900">Controle de Inventário</h2>
                                    <div className="flex gap-4">
                                        <div className="bg-white px-4 py-2 rounded-lg border border-neutral-200 flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium">{products.filter(c => c.status === 'available').length} Disponíveis</span>
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-lg border border-neutral-200 flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-medium">{products.filter(c => c.status === 'rented').length} Alugados</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-neutral-50 border-b border-neutral-200">
                                            <tr>
                                                <th className="px-6 py-4 text-sm font-bold text-neutral-500 uppercase">Produto</th>
                                                <th className="px-6 py-4 text-sm font-bold text-neutral-500 uppercase">Categoria</th>
                                                <th className="px-6 py-4 text-sm font-bold text-neutral-500 uppercase">Status</th>
                                                <th className="px-6 py-4 text-sm font-bold text-neutral-500 uppercase">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {products.map(product => (
                                                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {getProductIcon(product.type)}
                                                            <div>
                                                                <p className="font-medium text-neutral-900">{product.name}</p>
                                                                <p className="text-xs text-neutral-400">ID: {product.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-neutral-600 text-sm">{product.category}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${product.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {product.status === 'available' ? 'Disponível' : 'Alugado'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}