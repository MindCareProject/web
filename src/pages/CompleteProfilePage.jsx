import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CompleteProfilePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        adeliNumber: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // On envoie les données au backend (il faudra créer cette route Django plus tard)
            await api.patch("/auth/profile/update/", formData);
            
            // Une fois terminé, on l'envoie sur son tableau de bord
            navigate("/welcome");
        } catch (err) {
            setError("Erreur lors de la mise à jour du profil.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6">
            <div className="w-full max-w-xl bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#8EBAE3]/10 border border-gray-50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-800 tracking-tighter mb-2">Bienvenue !</h2>
                    <p className="text-[#8EBAE3] text-[10px] font-black uppercase tracking-widest">
                        Finalisons votre profil praticien
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <input type="text" name="firstName" placeholder="Prénom" onChange={handleChange} required className="w-1/2 px-6 py-4 bg-[#F8FAFC] rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium" />
                        <input type="text" name="lastName" placeholder="Nom" onChange={handleChange} required className="w-1/2 px-6 py-4 bg-[#F8FAFC] rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium" />
                    </div>
                    
                    <input type="text" name="adeliNumber" placeholder="Numéro ADELI / RPPS" onChange={handleChange} required className="w-full px-6 py-4 bg-[#F8FAFC] rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium" />
                    <input type="tel" name="phone" placeholder="Numéro de téléphone" onChange={handleChange} required className="w-full px-6 py-4 bg-[#F8FAFC] rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium" />

                    {error && <p className="text-red-400 text-center text-xs font-bold">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-[#8EBAE3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#98EAD3] transition-all mt-4 shadow-lg shadow-[#8EBAE3]/20">
                        {loading ? "Enregistrement..." : "Accéder à mon espace"}
                    </button>
                </form>
            </div>
        </div>
    );
}