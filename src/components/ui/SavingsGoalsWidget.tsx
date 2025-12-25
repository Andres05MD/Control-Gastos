"use client";

import { useGoals, Goal } from "@/hooks/useGoals";
import Swal from "sweetalert2";
import { FiTarget, FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";

export default function SavingsGoalsWidget({ bcvRate }: { bcvRate: number }) {
    const { goals, loading, addGoal, deleteGoal, updateGoalProgress } = useGoals();

    const handleAddGoal = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Nueva Meta de Ahorro',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Nombre de la meta">' +
                '<input id="swal-input2" class="swal2-input" type="number" placeholder="Monto Objetivo ($)">',
            focusConfirm: false,
            background: "#1f2937",
            color: "#fff",
            showCancelButton: true,
            confirmButtonText: 'Crear Meta',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            preConfirm: () => {
                return [
                    (document.getElementById('swal-input1') as HTMLInputElement).value,
                    (document.getElementById('swal-input2') as HTMLInputElement).value
                ]
            }
        });

        if (formValues && formValues[0] && formValues[1]) {
            await addGoal(formValues[0], parseFloat(formValues[1]));
            Swal.fire({
                icon: 'success',
                title: 'Meta creada',
                timer: 1500,
                showConfirmButton: false,
                background: "#1f2937",
                color: "#fff",
            });
        }
    };

    const handleUpdateProgress = async (goal: Goal) => {
        const { value: amount } = await Swal.fire({
            title: `Actualizar Ahorro: ${goal.name}`,
            input: 'number',
            inputLabel: 'Monto ahorrado actual ($)',
            inputValue: goal.currentAmount,
            showCancelButton: true,
            background: "#1f2937",
            color: "#fff",
            confirmButtonColor: '#10b981',
            inputValidator: (value) => {
                if (!value) {
                    return 'Necesitas escribir un monto!'
                }
                return null;
            }
        });

        if (amount) {
            await updateGoalProgress(goal.id, parseFloat(amount));
            Swal.fire({
                icon: 'success',
                title: 'Progreso actualizado',
                timer: 1000,
                showConfirmButton: false,
                background: "#1f2937",
                color: "#fff",
            });
        }
    };

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: '¿Borrar meta?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, borrar',
            background: "#1f2937",
            color: "#fff",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteGoal(id);
                Swal.fire({
                    title: 'Borrado',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                    background: "#1f2937",
                    color: "#fff",
                });
            }
        });
    };

    if (loading) return <div className="h-48 bg-slate-900/50 rounded-3xl animate-pulse"></div>;

    return (
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-lg relative overflow-hidden group hover:bg-slate-900/70 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all opacity-50"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <FiTarget />
                    </span>
                    Metas de Ahorro
                </h3>
                <button
                    onClick={handleAddGoal}
                    className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105"
                >
                    <FiPlus size={20} />
                </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {goals.length === 0 ? (
                    <div className="text-center text-slate-500 py-8 flex flex-col items-center">
                        <FiTarget size={32} className="mb-2 opacity-50" />
                        <p className="mb-2">No tienes metas activas.</p>
                        <button onClick={handleAddGoal} className="text-emerald-400 text-sm font-medium hover:underline">Crear mi primera meta</button>
                    </div>
                ) : (
                    goals.map(goal => {
                        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        return (
                            <div key={goal.id} className="bg-slate-800/40 hover:bg-slate-800/60 transition-colors p-4 rounded-2xl border border-slate-700/30 group/item">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{goal.name}</h4>
                                        <p className="text-xs text-slate-400 mt-1 font-medium">
                                            <span className="text-white">${goal.currentAmount}</span> <span className="text-slate-500">de</span> ${goal.targetAmount}
                                        </p>
                                    </div>
                                    <div className="flex space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <button onClick={() => handleUpdateProgress(goal)} className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Barra de Progreso */}
                                <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2 overflow-hidden backdrop-blur-sm">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${progress >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 font-medium">
                                    <span className={progress >= 100 ? "text-emerald-400 font-bold" : "text-blue-400"}>{progress.toFixed(0)}% Completado</span>
                                    <span>Meta: Bs. {(goal.targetAmount * bcvRate).toLocaleString("es-VE", { maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
