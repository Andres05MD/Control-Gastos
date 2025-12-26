"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { FiTrendingUp, FiTrendingDown, FiTrash2, FiClock, FiEdit2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useEditTransaction } from "@/contexts/EditTransactionContext";

export default function RecentTransactions() {
    const { transactions, loading, deleteTransaction } = useTransactions();
    const { startEditing } = useEditTransaction();

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#374151",
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar",
            background: "#1f2937",
            color: "#fff",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await deleteTransaction(id);
                if (success) {
                    Swal.fire({
                        title: "¡Borrado!",
                        text: "El registro ha sido eliminado.",
                        icon: "success",
                        background: "#1f2937",
                        color: "#fff",
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-slate-600 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500 h-full border border-slate-700 border-dashed rounded-2xl bg-slate-800/50">
                <FiClock className="text-4xl mb-3 opacity-50" />
                <p>No hay movimientos recientes.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
                <h3 className="text-xl font-bold text-white flex items-center">
                    <FiClock className="mr-2 text-emerald-400" />
                    Historial Reciente
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4 text-left tracking-wider">Categoría / Detalle</th>
                            <th className="px-6 py-4 text-left tracking-wider">Fecha</th>
                            <th className="px-6 py-4 text-right tracking-wider">Monto</th>
                            <th className="px-6 py-4 text-right tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 ${t.type === 'ingreso' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {t.type === 'ingreso' ? <FiTrendingUp /> : <FiTrendingDown />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{t.category}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[150px]">{t.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                    {t.date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={`text-sm font-bold ${t.type === 'ingreso' ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {t.type === 'ingreso' ? '+' : '-'}${t.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => startEditing(t)}
                                            className="text-slate-500 hover:text-blue-400 transition-colors p-2 hover:bg-blue-500/10 rounded-lg"
                                            title="Editar"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                            title="Eliminar"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
