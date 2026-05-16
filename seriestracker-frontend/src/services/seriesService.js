const API_URL = 'http://localhost:8080/api/series';

export const getMisSeries = async () => {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            // Crucial para enviar la cookie JSESSIONID
            credentials: 'include' 
        });

        if (!response.ok) {
            throw new Error('No se pudieron cargar las series');
        }

        return await response.json();
    } catch (error) {
        console.error("Error en seriesService:", error);
        return [];
    }
};