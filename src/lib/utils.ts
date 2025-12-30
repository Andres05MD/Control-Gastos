import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes conditionally.
 * It handles conflicts properly using tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Utility to format currency consistently
 */
export function formatCurrency(amount: number, currency: "USD" | "VES" = "USD", locale: string = "en-US") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
}
