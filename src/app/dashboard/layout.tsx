"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { FiMenu } from "react-icons/fi";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="md:pl-72 flex flex-col min-h-screen transition-all duration-300">

                {/* Mobile Header / Top Bar */}
                <header className="md:hidden sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-4 flex items-center justify-between shadow-lg">
                    <h1 className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Control Gastos
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700/50"
                    >
                        <FiMenu className="text-2xl" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animation-fade-in relative z-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
