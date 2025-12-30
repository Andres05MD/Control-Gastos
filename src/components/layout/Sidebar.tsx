"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiPieChart, FiUser, FiLogOut, FiX, FiShoppingCart, FiBriefcase, FiCalendar, FiCreditCard } from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { name: "Dashboard", icon: <FiHome />, href: "/dashboard" },
        { name: "Movimientos", icon: <FiList />, href: "/dashboard/movimientos" },
        { name: "Listas", icon: <FiShoppingCart />, href: "/dashboard/listas" },
        { name: "Gastos Fijos", icon: <FiCalendar />, href: "/dashboard/gastos-fijos" },
        { name: "Ahorros", icon: <FiBriefcase />, href: "/dashboard/ahorros" },
        { name: "Deudas", icon: <FiCreditCard />, href: "/dashboard/deudas" },
        { name: "Reportes", icon: <FiPieChart />, href: "/dashboard/reportes" },
        { name: "Perfil", icon: <FiUser />, href: "/dashboard/perfil" },
    ];

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-slate-900/40 backdrop-blur-xl border-r border-slate-700/30 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } shadow-2xl`}
            >
                <div className="flex flex-col h-full relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500/10 blur-3xl -translate-y-16 pointer-events-none"></div>

                    {/* Header */}
                    <div className="p-8 flex items-center justify-between relative z-10">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                                Control Gastos
                            </h2>
                            <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">
                                Finanzas Personales
                            </p>
                        </div>
                        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
                            <FiX className="text-2xl" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-2 mt-4 ml-1">Menu Principal</div>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? "text-emerald-400 font-medium shadow-lg shadow-emerald-500/10 bg-slate-800/50"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-emerald-500 rounded-lg shadow-[0_0_10px_2px_rgba(16,185,129,0.5)]"></div>
                                    )}
                                    <span className={`text-xl relative z-10 transition-transform duration-300 ${isActive ? "text-emerald-400 scale-110" : "text-slate-500 group-hover:text-slate-300 group-hover:scale-110"}`}>
                                        {item.icon}
                                    </span>
                                    <span className="relative z-10">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-4 border-t border-slate-700/30 relative z-10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group border border-transparent hover:border-red-500/20"
                        >
                            <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
