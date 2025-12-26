"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Swal from "sweetalert2";
import { FiDollarSign, FiCalendar, FiTag, FiFileText, FiSave, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';
import { getBCVRate } from "@/lib/currency";
import { useEffect } from "react";
import { useEditTransaction } from "@/contexts/EditTransactionContext";
import { doc, updateDoc } from "firebase/firestore";
import { FiX } from "react-icons/fi";

registerLocale('es', es);

const CATEGORIES = [
    "Comida", "Transporte", "Salud", "Salario", "Entretenimiento",
    "Servicios", "Educación", "Ropa", "Otra"
];

export default function TransactionForm() {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<"USD" | "VES">("USD");
    const [vesAmount, setVesAmount] = useState("");
    const [exchangeRate, setExchangeRate] = useState("50"); // Tasa por defecto temporal
    const [type, setType] = useState<"ingreso" | "gasto">("gasto");
    const [category, setCategory] = useState("Comida");
    const [customCategory, setCustomCategory] = useState("");
    const [description, setDescription] = useState("");

    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const { transactionToEdit, clearEditing } = useEditTransaction();

    useEffect(() => {
        if (transactionToEdit) {
            setAmount(transactionToEdit.amount.toString());
            setType(transactionToEdit.type);

            // Check if it's a standard category or custom
            if (CATEGORIES.includes(transactionToEdit.category)) {
                setCategory(transactionToEdit.category);
                setCustomCategory("");
            } else {
                setCategory("Otra");
                setCustomCategory(transactionToEdit.category);
            }

            setDescription(transactionToEdit.description);
            setDate(new Date(transactionToEdit.date));
            // Note: Currency/Rate logic would need extended Transaction interface to be fully perfect,
            // but for now we assume USD or inferred.
            // If you added currency/rate to Firestore, you should load it here too.
        }
    }, [transactionToEdit]);

    useEffect(() => {
        if (currency === "VES") {
            getBCVRate().then(rate => {
                if (rate && rate > 0) {
                    setExchangeRate(rate.toString());
                }
            });
        }
    }, [currency]);

    // Calcular USD cuando cambie el monto en VES o la tasa
    const handleVesChange = (val: string) => {
        setVesAmount(val);
        const rate = parseFloat(exchangeRate);
        const ves = parseFloat(val);
        if (!isNaN(rate) && !isNaN(ves) && rate > 0) {
            setAmount((ves / rate).toFixed(2));
        } else {
            setAmount("");
        }
    };

    const handleRateChange = (val: string) => {
        setExchangeRate(val);
        const rate = parseFloat(val);
        const ves = parseFloat(vesAmount);
        if (!isNaN(rate) && !isNaN(ves) && rate > 0) {
            setAmount((ves / rate).toFixed(2));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!auth.currentUser) {
            Swal.fire("Error", "Debes iniciar sesión", "error");
            setLoading(false);
            return;
        }

        try {
            const finalCategory = category === "Otra" ? customCategory.trim() : category;

            if (category === "Otra" && !finalCategory) {
                Swal.fire("Error", "Debes especificar la categoría", "error");
                setLoading(false);
                return;
            }

            if (transactionToEdit) {
                // Update existing
                await updateDoc(doc(db, "transactions", transactionToEdit.id), {
                    amount: parseFloat(amount),
                    type,
                    category: finalCategory,
                    description,
                    date: date,
                    currency: currency,
                    originalAmount: currency === "VES" ? parseFloat(vesAmount) : parseFloat(amount),
                    exchangeRate: currency === "VES" ? parseFloat(exchangeRate) : 1,
                    // Don't update createdAt
                });

                Swal.fire({
                    icon: "success",
                    title: "¡Actualizado!",
                    text: "El movimiento ha sido modificado.",
                    timer: 1500,
                    showConfirmButton: false,
                    background: "#1f2937",
                    color: "#fff",
                });

                clearEditing();
            } else {
                // Create new
                await addDoc(collection(db, "transactions"), {
                    userId: auth.currentUser.uid,
                    amount: parseFloat(amount),
                    type,
                    category: finalCategory,
                    description,
                    date: date,
                    period: "mensual",
                    currency: currency,
                    originalAmount: currency === "VES" ? parseFloat(vesAmount) : parseFloat(amount),
                    exchangeRate: currency === "VES" ? parseFloat(exchangeRate) : 1,
                    createdAt: serverTimestamp(),
                });

                Swal.fire({
                    icon: "success",
                    title: "¡Guardado!",
                    text: "El movimiento se ha registrado correctamente.",
                    timer: 1500,
                    showConfirmButton: false,
                    background: "#1f2937",
                    color: "#fff",
                });
            }

            setAmount("");
            setDescription("");
            setCategory("Comida");
            setCustomCategory("");
            setVesAmount("");
            // Mantener la tasa para facilitar siguientes registros

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar el movimiento.",
                background: "#1f2937",
                color: "#fff",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <span className="p-3 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-inner">
                        <FiDollarSign size={24} />
                    </span>
                    {transactionToEdit ? "Editar Movimiento" : "Nuevo Movimiento"}
                </div>
                {transactionToEdit && (
                    <button
                        onClick={() => {
                            clearEditing();
                            setAmount("");
                            setDescription("");
                            setCategory("Comida");
                            setCustomCategory("");
                            setVesAmount("");
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                {/* Tipo de Movimiento Toggle */}
                <div className="p-1.5 bg-slate-950/50 rounded-2xl flex border border-slate-800/50 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setType("ingreso")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${type === "ingreso"
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                    >
                        <FiTrendingUp /> Ingreso
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("gasto")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${type === "gasto"
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                    >
                        <FiTrendingDown /> Gasto
                    </button>
                </div>

                {/* Monto */}
                {/* Moneda Toggle */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Moneda</label>
                        <div className="p-1 bg-slate-800/50 rounded-xl flex border border-slate-700/50">
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrency("USD");
                                    setAmount("");
                                    setVesAmount("");
                                }}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${currency === "USD"
                                    ? "bg-gradient-to-tr from-emerald-500 to-emerald-400 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                USD
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrency("VES");
                                    setAmount("");
                                    setVesAmount("");
                                }} // Reset al cambiar
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${currency === "VES"
                                    ? "bg-gradient-to-tr from-blue-500 to-blue-400 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                Bs (VES)
                            </button>
                        </div>
                    </div>

                    {currency === "VES" && (
                        <div className="w-1/3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Tasa</label>
                            <input
                                type="number"
                                step="0.01"
                                value={exchangeRate}
                                onChange={(e) => handleRateChange(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-white font-bold rounded-xl py-2.5 px-3 outline-none focus:ring-2 focus:ring-emerald-500/30 text-center"
                                placeholder="0.00"
                            />
                        </div>
                    )}
                </div>

                {/* Monto */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                        Monto {currency === "VES" ? "(Bolívares)" : "(Dólares)"}
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-slate-400 font-semibold text-lg">{currency === "VES" ? "Bs" : "$"}</span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={currency === "VES" ? vesAmount : amount}
                            onChange={(e) => {
                                if (currency === "VES") handleVesChange(e.target.value);
                                else setAmount(e.target.value);
                            }}
                            className="w-full bg-slate-800/50 border border-slate-700/50 text-white text-lg font-semibold rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-slate-600 hover:border-slate-600 hover:bg-slate-800"
                            placeholder="0.00"
                        />
                        {currency === "VES" && amount && (
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                    ≈ ${amount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid para Categoría y Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Categoría */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Categoría</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiTag className="text-slate-400" />
                            </div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm font-medium rounded-2xl py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer hover:border-slate-600 hover:bg-slate-800"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                                ))}
                            </select>
                        </div>

                        {category === "Otra" && (
                            <div className="mt-3 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiTag className="text-emerald-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={customCategory}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                                            setCustomCategory(val);
                                        }
                                    }}
                                    className="w-full bg-slate-800/50 border border-emerald-500/50 text-white text-sm font-medium rounded-2xl py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder:text-slate-500"
                                    placeholder="Especifica la categoría..."
                                />
                            </div>
                        )}
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Fecha</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <FiCalendar className="text-slate-400" />
                            </div>
                            <DatePicker
                                selected={date}
                                onChange={(date: Date | null) => date && setDate(date)}
                                locale="es"
                                dateFormat="dd/MM/yyyy"
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm font-medium rounded-2xl py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all cursor-pointer hover:border-slate-600 hover:bg-slate-800"
                                wrapperClassName="w-full"
                                calendarClassName="!bg-slate-800 !border-slate-700 !text-white !font-sans !shadow-xl !rounded-2xl overflow-hidden"
                                dayClassName={(date) => "hover:!bg-emerald-500 hover:!text-white !text-slate-300 !rounded-lg transition-all"}
                                weekDayClassName={() => "!text-slate-500 !uppercase !text-xs !tracking-wider"}
                                popperClassName="!z-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Descripción</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 pt-4 pointer-events-none">
                            <FiFileText className="text-slate-400" />
                        </div>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm font-medium rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-slate-600 resize-none hover:border-slate-600 hover:bg-slate-800"
                            placeholder="Detalles opcionales..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {loading ? (
                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <FiSave size={18} />
                            <span>{transactionToEdit ? "ACTUALIZAR MOVIMIENTO" : "GUARDAR MOVIMIENTO"}</span>
                        </>
                    )}
                </button>

            </form>
        </div>
    );
}
