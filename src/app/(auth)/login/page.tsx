"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire({
                icon: "success",
                title: "¡Bienvenido de nuevo!",
                text: "Has iniciado sesión correctamente.",
                timer: 1500,
                showConfirmButton: false,
                background: "#1f2937",
                color: "#fff",
            });
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            let errorMessage = "Ocurrió un error al iniciar sesión.";
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                errorMessage = "Credenciales incorrectas.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "El correo electrónico no es válido.";
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
                background: "#1f2937",
                color: "#fff",
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 relative animation-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Bienvenido</h1>
                    <p className="text-slate-400">Ingresa a tu control financiero premium</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Correo Electrónico</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 hover:border-slate-600 transition-all outline-none placeholder:text-slate-600"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Contraseña</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-12 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 hover:border-slate-600 transition-all outline-none placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-emerald-400 focus:outline-none transition-colors"
                            >
                                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span>Iniciar Sesión</span>
                                <FiArrowRight />
                            </>
                        )}
                    </button>
                </form>



                <p className="mt-8 text-center text-sm text-slate-400">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}
