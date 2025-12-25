import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export interface Goal {
    id: string;
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: any;
    createdAt?: any;
}

export const useGoals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) {
                setGoals([]);
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, "goals"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                const goalsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Goal[];
                setGoals(goalsData);
                setLoading(false);
            });

            return () => unsubscribeSnapshot();
        });

        return () => unsubscribeAuth();
    }, []);

    const addGoal = async (name: string, targetAmount: number, deadline?: string) => {
        if (!auth.currentUser) return;
        await addDoc(collection(db, "goals"), {
            userId: auth.currentUser.uid,
            name,
            targetAmount,
            currentAmount: 0,
            deadline: deadline ? new Date(deadline) : null,
            createdAt: serverTimestamp()
        });
    };

    const deleteGoal = async (id: string) => {
        await deleteDoc(doc(db, "goals", id));
    };

    const updateGoalProgress = async (id: string, newAmount: number) => {
        await updateDoc(doc(db, "goals", id), {
            currentAmount: newAmount
        });
    };

    return { goals, loading, addGoal, deleteGoal, updateGoalProgress };
};
