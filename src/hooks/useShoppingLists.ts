import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    completed: boolean;
}

export interface ShoppingList {
    id: string;
    userId: string;
    name: string;
    items: ShoppingItem[];
    createdAt: any;
}

export const useShoppingLists = () => {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot: (() => void) | null = null;

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }

            if (!user) {
                setLists([]);
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, "shopping_lists"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as ShoppingList[];
                setLists(data);
                setLoading(false);
            });
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
        };
    }, []);

    const createList = async (name: string) => {
        if (!auth.currentUser) return;
        await addDoc(collection(db, "shopping_lists"), {
            userId: auth.currentUser.uid,
            name,
            items: [],
            createdAt: serverTimestamp()
        });
    };

    const deleteList = async (listId: string) => {
        await deleteDoc(doc(db, "shopping_lists", listId));
    };

    const addItem = async (listId: string, item: Omit<ShoppingItem, "id" | "completed">) => {
        const newItem: ShoppingItem = {
            id: crypto.randomUUID(),
            completed: false,
            ...item
        };
        const listRef = doc(db, "shopping_lists", listId);
        await updateDoc(listRef, {
            items: arrayUnion(newItem)
        });
    };

    const toggleItem = async (listId: string, currentItems: ShoppingItem[], itemId: string) => {
        const updatedItems = currentItems.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const listRef = doc(db, "shopping_lists", listId);
        await updateDoc(listRef, { items: updatedItems });
    };

    const deleteItem = async (listId: string, currentItems: ShoppingItem[], itemId: string) => {
        const updatedItems = currentItems.filter(item => item.id !== itemId);
        const listRef = doc(db, "shopping_lists", listId);
        await updateDoc(listRef, { items: updatedItems });
    };

    return { lists, loading, createList, deleteList, addItem, toggleItem, deleteItem };
};
