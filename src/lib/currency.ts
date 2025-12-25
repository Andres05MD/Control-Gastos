export async function getBCVRate(): Promise<number> {
    try {
        const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        return data.promedio || 56.40;
    } catch (error) {
        console.warn("API Error, using fallback:", error);
        return 56.40;
    }
}
