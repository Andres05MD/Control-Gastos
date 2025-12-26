"use client";

import { useState, useEffect, useRef } from "react";
import { useShoppingLists, ShoppingList, ShoppingItem } from "@/hooks/useShoppingLists";
import { FiShoppingCart, FiPlus, FiTrash2, FiCheck, FiSquare, FiList, FiDollarSign } from "react-icons/fi";
import Swal from "sweetalert2";
import { getBCVRate } from "@/lib/currency";

export default function ShoppingListsPage() {
    const { lists, loading, createList, deleteList, addItem, toggleItem, deleteItem } = useShoppingLists();
    const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
    const [bcvRate, setBcvRate] = useState(0);
    const detailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getBCVRate().then(setBcvRate);
    }, []);

    useEffect(() => {
        if (selectedList && window.innerWidth < 1024) {
            setTimeout(() => {
                detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [selectedList]);

    const handleCreateList = async () => {
        const { value: name } = await Swal.fire({
            title: 'Nueva Lista de Compras',
            input: 'text',
            inputPlaceholder: 'Ej: Supermercado Mensual',
            showCancelButton: true,
            background: "#1f2937",
            color: "#fff",
            confirmButtonText: 'Crear',
            confirmButtonColor: '#10b981',
            inputValidator: (value) => {
                if (!value) return 'Necesitas escribir un nombre';
            }
        });

        if (name) {
            await createList(name);
            Swal.fire({
                icon: "success",
                title: "Lista creada",
                timer: 1000,
                showConfirmButton: false,
                background: "#1f2937",
                color: "#fff",
            });
        }
    };

    const handleAddItem = async () => {
        if (!selectedList) return;

        const { value: formValues } = await Swal.fire({
            title: 'Agregar Producto',
            html:
                '<div class="flex flex-col gap-3">' +
                '<input id="swal-input1" class="swal2-input m-0 w-full" placeholder="Nombre (ej: Arroz)">' +
                '<input id="swal-input2" class="swal2-input m-0 w-full" type="number" placeholder="Cantidad">' +
                '<input id="swal-input3" class="swal2-input m-0 w-full" type="number" step="0.01" placeholder="Precio Unitario ($)">' +
                `<div id="bs-reference" class="text-emerald-400 font-bold text-sm text-right">≈ Bs. 0.00</div>` +
                '</div>',
            focusConfirm: false,
            background: "#1f2937",
            color: "#fff",
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            confirmButtonColor: '#10b981',
            didOpen: () => {
                const priceInput = Swal.getPopup()?.querySelector('#swal-input3') as HTMLInputElement;
                const bsRef = Swal.getPopup()?.querySelector('#bs-reference');

                if (priceInput && bsRef) {
                    priceInput.addEventListener('input', () => {
                        const val = parseFloat(priceInput.value);
                        if (!isNaN(val)) {
                            bsRef.textContent = `≈ Bs. ${(val * bcvRate).toLocaleString("es-VE", { maximumFractionDigits: 2 })}`;
                        } else {
                            bsRef.textContent = `≈ Bs. 0.00`;
                        }
                    })
                }
            },
            preConfirm: () => {
                return [
                    (document.getElementById('swal-input1') as HTMLInputElement).value,
                    (document.getElementById('swal-input2') as HTMLInputElement).value,
                    (document.getElementById('swal-input3') as HTMLInputElement).value
                ]
            }
        });

        if (formValues) {
            const [name, qty, price] = formValues;
            if (!name) return;

            await addItem(selectedList.id, {
                name,
                quantity: qty ? parseFloat(qty) : 1,
                price: price ? parseFloat(price) : 0
            });
        }
    };

    const calculateTotal = (items: ShoppingItem[]) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/50 p-8 rounded-3xl shadow-xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10">
                    <FiShoppingCart className="text-9xl text-emerald-400" />
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Listas de Compras</h1>
                    <p className="text-slate-400 text-lg">
                        Planifica tus compras mensuales o crea listas de deseos.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lists Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <button
                        onClick={handleCreateList}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1"
                    >
                        <FiPlus size={24} /> Nueva Lista
                    </button>

                    <div className="space-y-3">
                        {lists.length === 0 ? (
                            <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 text-center text-slate-500 flex flex-col items-center">
                                <FiList size={32} className="mb-2 opacity-50" />
                                No tienes listas creadas.
                            </div>
                        ) : (
                            lists.map((list) => (
                                <div
                                    key={list.id}
                                    onClick={() => setSelectedList(list)}
                                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group relative overflow-hidden ${selectedList?.id === list.id
                                        ? "bg-slate-800/80 border-emerald-500 shadow-md"
                                        : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50"
                                        }`}
                                >
                                    {selectedList?.id === list.id && (
                                        <div className="absolute left-0 top-0 w-1.5 h-full bg-emerald-500"></div>
                                    )}

                                    <div className="pl-2">
                                        <h3 className={`font-bold text-lg ${selectedList?.id === list.id ? "text-emerald-400" : "text-slate-200"}`}>
                                            {list.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
                                            {list.items?.length || 0} items
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            Swal.fire({
                                                title: '¿Borrar lista?',
                                                text: "Se perderán todos los items.",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#ef4444',
                                                background: "#1f2937",
                                                color: "#fff"
                                            }).then((res) => {
                                                if (res.isConfirmed) {
                                                    if (selectedList?.id === list.id) setSelectedList(null);
                                                    deleteList(list.id);
                                                }
                                            })
                                        }}
                                        className="text-slate-600 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-all transform hover:scale-110 p-2"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* List Detail View */}
                <div className="lg:col-span-2" ref={detailRef}>
                    {selectedList ? (
                        /* Use fresh data from 'lists' array to ensure reactivity when items update */
                        (() => {
                            const currentList = lists.find(l => l.id === selectedList.id) || selectedList;
                            const total = calculateTotal(currentList.items || []);

                            return (
                                <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-700/50 shadow-xl p-8 min-h-[600px] flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-700/50 pb-6 relative z-10 gap-4">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">{currentList.name}</h2>
                                            <div className="flex items-center gap-3 text-sm bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 inline-flex">
                                                <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">Total Estimado</span>
                                                <span className="text-emerald-400 font-bold text-lg">${total.toFixed(2)}</span>
                                                <span className="text-slate-500 text-xs border-l border-slate-600 pl-3">
                                                    Bs. {(total * bcvRate).toLocaleString("es-VE", { maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleAddItem}
                                            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-slate-700 hover:border-emerald-500/30 shadow-lg"
                                        >
                                            <FiPlus size={18} /> Agregar Item
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar relative z-10">
                                        {(!currentList.items || currentList.items.length === 0) ? (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                                                <FiShoppingCart size={64} className="mb-4 text-emerald-500/50" />
                                                <p className="text-lg">Lista vacía.</p>
                                                <p className="text-sm">Agrega productos con el botón superior.</p>
                                            </div>
                                        ) : (
                                            currentList.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${item.completed
                                                        ? "bg-slate-900/30 border-slate-800 opacity-50"
                                                        : "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60 hover:border-emerald-500/30"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => toggleItem(currentList.id, currentList.items, item.id)}
                                                            className={`text-2xl transition-transform active:scale-90 ${item.completed ? "text-emerald-500" : "text-slate-600 hover:text-emerald-400"}`}
                                                        >
                                                            {item.completed ? <FiCheck /> : <FiSquare />}
                                                        </button>
                                                        <div>
                                                            <p className={`font-semibold text-lg ${item.completed ? "text-slate-500 line-through decoration-2 decoration-slate-600" : "text-white"}`}>
                                                                {item.name}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                                <span className="bg-slate-800 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                                                                {item.price > 0 && <span>${item.price.toFixed(2)} c/u</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        {item.price > 0 && (
                                                            <div className="text-right">
                                                                <p className="font-bold text-white text-lg">
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500">
                                                                    Bs. {(item.price * item.quantity * bcvRate).toLocaleString("es-VE", { maximumFractionDigits: 2 })}
                                                                </p>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => deleteItem(currentList.id, currentList.items, item.id)}
                                                            className="p-2 text-slate-600 hover:text-white hover:bg-red-500 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-700/50 border-dashed border-2 h-full flex flex-col items-center justify-center text-slate-500 p-8 min-h-[400px]">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                                <FiShoppingCart size={32} className="opacity-50" />
                            </div>
                            <p className="text-xl font-bold text-slate-400">Selecciona o crea una lista</p>
                            <p className="text-sm mt-2 max-w-xs text-center text-slate-600">Elige una lista del menú lateral para ver su contenido y gestionar tus compras.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
