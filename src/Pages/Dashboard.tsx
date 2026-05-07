import React from "react";
import { motion } from "motion/react";
import { Clock, Calendar, Box, Shield, Wrench, PcCase, Package, CheckCircle2 } from "lucide-react";
import { User, Product, Rental } from '../types';

interface DashboardProps {
    user: User;
    rentals: Rental[];
    products: Product[];
    onReturn: (rentalId: string) => void;
}

export const getProductIcon = (type: string) => {
    switch (type) {
        case 'equipamento':
            return <Wrench className="w-6 h-6 text-brand-500" />;
        case 'epi':
            return <Shield className="w-6 h-6 text-emerald-500" />;
        case 'tecnologia':
            return <PcCase className="w-6 h-6 text-brand-300" />;
        case 'outros':
            return <Package className="w-6 h-6 text-amber-500" />;
        default:
            return <Box className="w-6 h-6 text-neutral-400" />;
    }
};

export const Dashboard: React.FC<DashboardProps> = ({ user, rentals, products, onReturn }) => {
    const filteredRentals = rentals.filter(r => user.role === 'admin' || r.userId === user.id);

    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-neutral-200">
                <div>
                    <h2 className="text-2xl font-black text-brand-900 tracking-tight">
                        {user.role === 'admin' ? 'Controle Geral de Ativos' : 'Suas Movimentações'}
                    </h2>
                    <p className="text-neutral-500 text-sm mt-1">Acompanhe aqui o status de todos os itens em uso.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRentals.map(rental => {
                    const product = products.find(p => p.id === rental.productId);
                    const isActive = rental.status === 'active';

                    return (
                        <motion.div
                            key={rental.id}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 hover:shadow-xl hover:shadow-brand-500/5 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-neutral-50 rounded-2xl">
                                    {product ? getProductIcon(product.type) : <Box className="w-6 h-6 text-neutral-400" />}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                                    }`}>
                                    {isActive ? 'Em Uso' : 'Devolvido'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-brand-300 uppercase tracking-tighter mb-1">
                                        {product?.category || '---'}
                                    </p>
                                    <p className="text-xl font-black text-brand-900 leading-tight">
                                        {product?.name || 'Item não encontrado'}
                                    </p>
                                </div>

                                <div className="space-y-2.5 pt-4 border-t border-neutral-50">
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <Clock className="w-4 h-4 text-brand-400" />
                                        <span className="text-sm font-medium">Início: {new Date(rental.startTime).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <Calendar className="w-4 h-4 text-brand-400" />
                                        <span className="text-sm font-medium">Prazo: {new Date(rental.endTime).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-2">
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Pagamento</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest py-0.5 px-2 rounded ${rental.remainingPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {rental.remainingPaid ? 'Finalizado' : 'Restante Pendente'}
                                        </span>
                                    </div>
                                </div>

                                {isActive && user.role === 'admin' && (
                                    <button
                                        onClick={() => onReturn(rental.id)}
                                        className="w-full mt-2 py-4 bg-brand-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-700 transition-all active:scale-[0.98] shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Registrar Devolução
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
                {filteredRentals.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-white rounded-[40px] border-4 border-dashed border-neutral-100">
                        <Box className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
                        <p className="text-neutral-400 font-bold text-lg">Nenhum registro encontrado ainda.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};