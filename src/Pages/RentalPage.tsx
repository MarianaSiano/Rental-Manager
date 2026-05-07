import React from "react";
import { motion } from "motion/react";
import { Plus, Info } from 'lucide-react';
import { Product } from '../types';
import { getProductIcon } from "./Dashboard";

interface RentalPageProps {
    products: Product[];
    settings: any;
    onRent: (productId: string) => void;
}

export const RentalPage: React.FC<RentalPageProps> = ({ products, settings, onRent }) => {
    const availableProducts = products.filter(p => p.status === 'available');

    return (
        <motion.div
            key="rent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="bg-brand-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-500/20">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-3 tracking-tighter">Solicitar Ativo</h2>
                    <p className="text-brand-100 text-lg max-w-xl font-medium">Garanta as ferramentas e EPIs necessários para seu setor com agilidade e controle.</p>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-brand-900 flex items-center gap-3 italic">
                            Inventário Disponível
                            <span className="text-sm font-bold bg-brand-100 text-brand-600 px-3 py-1 rounded-full not-italic tracking-normal">
                                {availableProducts.length} itens
                            </span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {availableProducts.map(product => (
                            <motion.button
                                key={product.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onRent(product.id)}
                                className="p-8 bg-white rounded-3xl border-2 border-neutral-100 hover:border-brand-400 hover:shadow-2xl transition-all text-left relative group overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-[60px] -translate-y-4 translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-4 bg-brand-50 rounded-2xl group-hover:bg-brand-900 group-hover:text-white transition-colors">
                                            {getProductIcon(product.type)}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                                            #{product.id}
                                        </span>
                                    </div>

                                    <p className="text-xs font-black text-brand-300 uppercase tracking-widest mb-1">{product.category}</p>
                                    <p className="text-2xl font-black text-brand-900 tracking-tight leading-none group-hover:text-brand-600 transition-colors">
                                        {product.name}
                                    </p>

                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase">Status: OK</span>
                                        <div className="flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest">
                                            Reservar <Plus className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100 sticky top-24">
                        <h3 className="font-black text-brand-900 text-xl mb-6 flex items-center gap-2 italic">
                            Termos de Uso
                            <Info className="w-5 h-5 text-brand-400 not-italic" />
                        </h3>
                        <div className="space-y-6">
                            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2">Ponto de Retirada</p>
                                <p className="text-sm text-brand-900 font-bold leading-tight">{settings.return_location}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500 font-medium">Prazo de Sinal (50%)</span>
                                    <span className="text-brand-900 font-black italic">Imediato</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500 font-medium">Taxa de Operação</span>
                                    <span className="text-brand-900 font-black italic">Fixa</span>
                                </div>
                                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                                    <span className="text-brand-600 font-black text-xs uppercase">Pagamento</span>
                                    <span className="text-brand-900 font-black text-lg italic uppercase">Na Retirada</span>
                                </div>
                            </div>

                            <div className="p-4 bg-brand-900 rounded-2xl">
                                <p className="text-[10px] text-brand-100 font-medium leading-relaxed">
                                    * A não devolução no horário estabelecido resultará em suspensão temporária do usuário no sistema.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};