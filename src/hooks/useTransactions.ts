import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export interface Transaction {
    id: string;
    amount: number;
    type: "ingreso" | "gasto";
    category: string;
    description: string;
    date: Date;
}

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Query specific to the logged-in user
                const q = query(
                    collection(db, "transactions"),
                    where("userId", "==", user.uid),
                    orderBy("date", "desc")
                );

                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map((doc) => {
                        const docData = doc.data();
                        return {
                            id: doc.id,
                            ...docData,
                            // Convert Firestore Timestamp to JS Date
                            date: docData.date instanceof Timestamp ? docData.date.toDate() : new Date(docData.date),
                        } as Transaction;
                    });
                    setTransactions(data);
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching transactions:", error);
                    setLoading(false);
                });

                return () => unsubscribeSnapshot();
            } else {
                setTransactions([]);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const deleteTransaction = async (id: string) => {
        try {
            await deleteDoc(doc(db, "transactions", id));
            return true;
        } catch (error) {
            console.error("Error deleting transaction:", error);
            return false;
        }
    };

    return { transactions, loading, deleteTransaction };
}
