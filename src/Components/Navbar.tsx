import React from "react";
import { Package, LogOut } from "lucide-react";
import { User } from '../types';

interface NavbarProps {
    user: User;
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
    return (
        <nav className="bg-brand-800 text-white sticky top-0 z-50 shadow-lg border-b border-brand-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="p-2 bg-brand-400 rounded-lg group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight hidden sm:block">Multisuporte</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold">{user.name}</p>
                            <p className="text-[10px] uppercase font-bold text-brand-200">
                                {user.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                            </p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2.5 bg-brand-700 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all active:scale-95 group"
                            title="Sair do sistema"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};