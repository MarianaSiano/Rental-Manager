import React, { useState } from "react";
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface ProfileSettingsProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    name,
                    email,
                    currentPassword,
                    newPassword: newPassword || undefined
                })
            });

            const data = await res.json();

            if(res.ok) {
                setSuccess(true);
                onUpdateUser(data.user);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                setError(data.error || 'Erro ao atualizar o perfil');
            }
        } catch (err) {
            setError('Erro de conexão com o servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
        >
            <div className="bg-brand-900 text-white p-8 rounded-[40px] shadow-xl flex items-center gap-6">
                <div className="p-4 bg-brand-700 rounded-3xl">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter">Segurança da Conta</h2>
                    <p className="text-brand-300 font-bold uppercase text-[10px] tracking-[0.3em]">Proteja seus dados de acesso</p>
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-neutral-100">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Nome de Exibição</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-brand-500 font-bold transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">E-mail de Login</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-brand-500 font-bold transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-neutral-100">
                        <h3 className="text-sm font-black text-brand-900 uppercase tracking-widest mb-6">Alteração de Senha</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 text-amber-600">Senha Atual</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-brand-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-amber-50/30 border border-amber-100 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all"
                                        placeholder="Sua senha atual"
                                        required={newPassword.length > 0}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1 text-brand-500">Nova Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-brand-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-brand-50/30 border border-brand-100 rounded-2xl outline-none focus:border-brand-500 font-bold transition-all"
                                        placeholder="Deixe em branco para manter"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            Credenciais atualizadas com sucesso!
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Salvando...' : 'Confirmar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};