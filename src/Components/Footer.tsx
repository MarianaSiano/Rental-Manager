import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-neutral-200 mt-auto py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="flex items-center gap-2 text-brand-600 mb-2">
                            < ShieldCheck className="w-5 h-5" />
                            <span className="font-bold">Multisuporte Manager</span>
                        </div>
                        <p className="text-sm text-neutral-500 max-w-sm">
                            Sistema profissional para gestão de inventário, empréstimos e devoluções de equipamentos industriais e tecnológicos.
                        </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-3 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-brand-300" />
                            <span>Precisa de ajuda? Entre em contato com o TI</span>
                        </div>
                        <p>© 2026 Multisuporte. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};