import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Fonction pour récupérer le token (à adapter selon où tu le stockes)
const getAuthHeaders = () => {
    // Vérifie bien le nom de la clé ici !
    const token = localStorage.getItem("accessToken"); 
    
    if (!token) {
        console.error("ERREUR: Aucun token trouvé dans le LocalStorage !");
        return {};
    }
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const createPatient = async (patientData) => {
    // patientData = { username, email, password, first_name, last_name }
    const headers = getAuthHeaders();
    console.log("Creating patient with headers:", headers);
    const response = await axios.post(
        `${API_URL}/patients/create/`,
        patientData,
        getAuthHeaders()
    );
    return response.data;
};
export const getPatients = async () => {
    const response = await axios.get(
        `${API_URL}/patients/`,
        getAuthHeaders()
    );
    return response.data;
};