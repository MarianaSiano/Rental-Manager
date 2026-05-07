import React from "react";
import { motion } from "motion/react";
import { UserPlus, CheckCircle2, ShieldCheck, Database, LayoutGrid } from 'lucide-react';
import { Product } from '../types';
import { getProductIcon } from './Dashboard';

interface AdminPageProps {
    products: Product[];
    settings: any;
    regSuccess: boolean;
    onRegisterUser: (e: React.FormEvent) => void;
    onUpdateSettings: (e: React.FormEvent) => void;
    newName: string;
    setNewName: (val: string) => void;
    newEmail: string;
    setNewEmail: (val: string) => void;
    newPassword: string;
    setNewPassword: (val: string) => void;
    setSettings: (val: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
    products, settings, regSuccess, onRegisterUser, onUpdateSettings,
    newName, setNewName, newEmail, setNewEmail, newPassword, setNewPassword,
    setSettings
}) => {
    return (
        <motion.div
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
        >
            <div className="flex items-center gap-4 bg-brand-900 text-white p-8 rounded-[40px] shadow-2xl">
                <div className="p-4 bg-brand-700 rounded-3xl">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter">Central de Administração</h2>
                    <p className="text-brand-300 font-bold uppercase text-[10px] tracking-[0.3em]">Gestão de Usuários e Ativos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    {/* User Registration */}
                    <section className="bg-white rounded-[40px] p-10 shadow-sm border border-neutral-100">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-brand-50 rounded-2xl">
                                <UserPlus className="w-6 h-6 text-brand-600" />
                            </div>
                            <h3 className="text-2xl font-black text-brand-900">Novo Colaborador</h3>
                        </div>

                        <form onSubmit={onRegisterUser} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold"
                                    placeholder="Ex: João da Silva"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold"
                                    placeholder="email@empresa.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Senha Temporária</label>
                                <input
                                    type="text"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold"
                                    placeholder="Padrão: 123456"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20 active:scale-[0.98]"
                                >
                                    Cadastrar Agora
                                </button>
                            </div>
                        </form>
                        {regSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 font-bold"
                            >
                                <CheckCircle2 className="w-6 h-6" />
                                Usuário cadastrado com sucesso!
                            </motion.div>
                        )}
                    </section>

                    {/* Inventory Table */}
                    <section className="bg-white rounded-[40px] shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                            <div className="flex items-center gap-3">
                                <Database className="w-6 h-6 text-brand-600" />
                                <h3 className="text-xl font-black text-brand-900">Banco de Ativos</h3>
                            </div>
                            <div className="flex gap-3">
                                <div className="bg-white px-5 py-2.5 rounded-2xl border border-neutral-200 flex items-center gap-2.5 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">{products.filter(c => c.status === 'available').length} Livres</span>
                                </div>
                                <div className="bg-white px-5 py-2.5 rounded-2xl border border-neutral-200 flex items-center gap-2.5 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                    <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">{products.filter(c => c.status === 'rented').length} Ativos</span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white border-b border-neutral-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ativo</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Setor / Cat</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-brand-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-neutral-50 rounded-xl group-hover:bg-white transition-colors">
                                                        {getProductIcon(product.type)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-brand-900">{product.name}</p>
                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">ID: {product.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-bold text-neutral-600 bg-neutral-100/50 px-3 py-1 rounded-lg italic">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-100 text-brand-700'
                                                    }`}>
                                                    {product.status === 'available' ? 'Disponível' : 'Em Uso'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="text-brand-600 hover:text-brand-900 font-black text-[10px] uppercase tracking-widest py-2 px-4 border border-brand-100 rounded-xl bg-white hover:bg-brand-50 transition-all">
                                                    Gerenciar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Global Settings */}
                <div className="space-y-8">
                    <section className="bg-white rounded-[40px] p-10 shadow-sm border border-neutral-100 sticky top-24">
                        <div className="flex items-center gap-3 mb-8">
                            <LayoutGrid className="w-6 h-6 text-brand-600" />
                            <h3 className="text-xl font-black text-brand-900">Configurações</h3>
                        </div>

                        <form onSubmit={onUpdateSettings} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Local do Almoxarifado</label>
                                <input
                                    type="text"
                                    value={settings.return_location}
                                    onChange={(e) => setSettings({ ...settings, return_location: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-brand-500 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Horário de Corte</label>
                                <input
                                    type="time"
                                    value={settings.return_hour}
                                    onChange={(e) => setSettings({ ...settings, return_hour: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:border-brand-500 font-bold"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-brand-900 text-brand-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-brand-800 transition-all active:scale-[0.98]"
                            >
                                Salvar Alterações
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};