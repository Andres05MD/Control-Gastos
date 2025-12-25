"use client";

import TransactionForm from "@/components/forms/TransactionForm";
import RecentTransactions from "@/components/ui/RecentTransactions";

export default function MovimientosPage() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/50 p-8 rounded-3xl shadow-xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10">
                    {/* We don't import icons here, but we can if needed. For now just text or reuse existing icons if imported. */}
                    {/* Actually let's import FiList or similar if not present, but for now I'll just use the gradient bg effect */}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Movimientos</h1>
                    <p className="text-slate-400 text-lg">Registra tus ingresos y gastos detalladamente.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Formulario */}
                <div className="lg:col-span-1">
                    <TransactionForm />
                </div>

                {/* Columna Derecha: Listado */}
                <div className="lg:col-span-2">
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
