"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export interface UserData {
    monthlyBudget: number;
    monthlySalary: number;
    savingsPhysical: number;
    savingsUSDT: number;
}

interface UserDataContextType {
    userData: UserData;
    loading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<UserData>({
        monthlyBudget: 0,
        monthlySalary: 0,
        savingsPhysical: 0,
        savingsUSDT: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const unsubDoc = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData({
                            monthlyBudget: data.monthlyBudget || 0,
                            monthlySalary: data.monthlySalary || 0,
                            savingsPhysical: data.savingsPhysical || 0,
                            savingsUSDT: data.savingsUSDT || 0
                        });
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });

                return () => unsubDoc();
            } else {
                setUserData({
                    monthlyBudget: 0,
                    monthlySalary: 0,
                    savingsPhysical: 0,
                    savingsUSDT: 0
                });
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, loading }}>
            {children}
        </UserDataContext.Provider>
    );
}

export function useUserData() {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error("useUserData must be used within a UserDataProvider");
    }
    return context;
}
