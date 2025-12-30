"use client";

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FiCheck, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { FieldError } from "react-hook-form";
import { motion } from "framer-motion";

interface Option {
    id: string | number;
    name: string;
    value: string;
}

interface SelectProps {
    label?: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    error?: FieldError | undefined;
    icon?: React.ReactNode;
    placeholder?: string;
}

export default function Select({ label, options, value, onChange, error, icon, placeholder = "Seleccionar" }: SelectProps) {
    const selectedOption = options.find(opt => opt.value === value) || null;

    return (
        <div className="w-full relative">
            {label && (
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">
                    {label}
                </label>
            )}
            <Listbox value={value} onChange={onChange}>
                <div className="relative mt-1">
                    <Listbox.Button className={cn(
                        "relative w-full cursor-pointer bg-slate-800/50 border border-slate-700/50 text-white text-sm font-medium rounded-2xl py-3.5 pl-4 pr-10 text-left outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all hover:border-slate-600 hover:bg-slate-800",
                        icon && "pl-11",
                        error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
                    )}>
                        {icon && (
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                {icon}
                            </span>
                        )}
                        <span className={`block truncate ${!selectedOption ? 'text-slate-500' : ''}`}>
                            {selectedOption ? selectedOption.name : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <FiChevronDown
                                className="h-5 w-5 text-slate-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-slate-800 border border-slate-700 p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm custom-scrollbar">
                            {options.map((option, personIdx) => (
                                <Listbox.Option
                                    key={personIdx}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-3 pl-10 pr-4 rounded-xl transition-colors ${active ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300'
                                        }`
                                    }
                                    value={option.value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-bold text-emerald-400' : 'font-normal'
                                                    }`}
                                            >
                                                {option.name}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-400">
                                                    <FiCheck className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
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
