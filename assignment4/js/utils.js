const scareList = ["Bebisens första skräckhus", "Konstig stämning", "Indieskräckfilm", "Makare av mardrömmar", "Ren terror"]

export function scareConverter(level) {
    return scareList[level - 1];
}

export async function fetchJSON(url) {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error("Kunde inte hämta husdata");
        return await response.json();

    } catch (error) {
        throw error;
    }
}