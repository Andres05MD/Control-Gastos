let cachedRate: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export async function getBCVRate(): Promise<number> {
    if (cachedRate && (Date.now() - lastFetchTime < CACHE_DURATION)) {
        return cachedRate;
    }

    try {
        const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const rate = data.promedio || 56.40;

        cachedRate = rate;
        lastFetchTime = Date.now();

        return rate;
    } catch (error) {
        console.warn("API Error, using fallback:", error);
        return cachedRate || 56.40;
    }
}
