"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";
import { FiAlertCircle } from "react-icons/fi";

interface InputProps extends Omit<HTMLMotionProps<"input">, "ref"> {
    label?: string;
    error?: FieldError | undefined;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, rightElement, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                            {icon}
                        </div>
                    )}
                    <motion.input
                        ref={ref}
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "w-full bg-slate-800/50 border border-slate-700/50 text-white text-sm font-medium rounded-2xl py-3.5 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all placeholder:text-slate-600 hover:border-slate-600 hover:bg-slate-800",
                            icon ? "pl-11" : "pl-4",
                            rightElement ? "pr-12" : "pr-4",
                            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
                            className
                        )}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-20">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 mt-1 ml-1 text-red-400 text-xs"
                    >
                        <FiAlertCircle />
                        <span>{error.message}</span>
                    </motion.div>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
