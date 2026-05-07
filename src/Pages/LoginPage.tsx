import React, { useState } from "react";
import { motion, setFeatureDefinitions } from "motion/react";
import { Package, Mail, Lock, AlertCircle } from "lucide-react";

interface LoginPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
    error: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onLogin(email, password);
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-700 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-brand-50 rounded-2xl mb-4">
                        <Package className="w-10 h-10 text-brand-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">Login Portal</h1>
                    <p className="text-neutral-500 mt-2">Gerenciamento Multisuporte</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 ml-1">Usuário / E-mail</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-brand-500 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                                placeholder="seu@trabalho.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 ml-1">Senha de Acesso</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-brand-500 transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3 font-medium"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold shadow-xl shadow-brand-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                    >
                        {isSubmitting ? 'Verificando...' : 'Acessar Painel'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-neutral-100">
                    <p className="text-xs text-center text-neutral-400 leading-relaxed">
                        Painel Administrativo: <span className="text-neutral-600 font-bold">admin@empresa.com</span><br />
                        Senha Padrão: <span className="text-neutral-600 font-bold">admin123</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}