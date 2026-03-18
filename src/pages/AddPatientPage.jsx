import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../api/patientApi";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from "date-fns/locale/fr";
import { format } from "date-fns";

registerLocale("fr", fr);

export default function AddPatientPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: null,
    address: "",
    phone_number: "",
    username: "",
    email: "",
    password: "",
  });

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion spécifique pour le changement de date
  const handleDateChange = (date) => {
    setFormData({ ...formData, birth_date: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = { ...formData };
    
    if (payload.birth_date) {
      payload.birth_date = format(payload.birth_date, "yyyy-MM-dd");
    }

    try {
      await createPatient(payload);
      navigate("/welcome"); 
    } catch (err) {
      if (err.response?.data) {
        const firstError = Object.values(err.response.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : "Erreur de saisie.");
      } else {
        setError("Serveur injoignable.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center p-4 md:p-8">
      
      {/* Navigation épurée */}
      <div className="w-full max-w-xl mb-8 flex items-center justify-between">
        <button onClick={() => navigate("/welcome")} className="text-gray-300 font-bold hover:text-[#8EBAE3] transition-colors">✕</button>
        <h1 className="text-lg font-black text-gray-800 tracking-tighter">CRÉATION DOSSIER PATIENT</h1>
        <div className="w-4"></div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
        
        {/* CARTE 1 : IDENTITÉ */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-[#8EBAE3]/20 rounded-xl text-[#8EBAE3]">👤</span>
            <p className="text-[11px] font-black text-[#8EBAE3] uppercase tracking-[0.15em]">Informations Personnelles</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="first_name"
                placeholder="Prénom"
                value={formData.first_name}
                onChange={handleChange}
                className="bg-[#F8FAFC] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8EBAE3] font-medium placeholder:text-gray-300 outline-none w-full"
                required
              />
              <input
                name="last_name"
                placeholder="Nom"
                value={formData.last_name}
                onChange={handleChange}
                className="bg-[#F8FAFC] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8EBAE3] font-medium placeholder:text-gray-300 outline-none w-full"
                required
              />
            </div>
            
            {/* LE NOUVEAU DATEPICKER */}
            <div className="relative w-full">
              <label className="text-[9px] font-black text-[#8EBAE3] absolute top-2 left-5 tracking-widest z-10">
                DATE DE NAISSANCE
              </label>
              <DatePicker
                selected={formData.birth_date}
                onChange={handleDateChange}
                locale="fr"
                dateFormat="dd/MM/yyyy"
                placeholderText="jj/mm/aaaa"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={new Date()} // Empêche de choisir une date dans le futur
                wrapperClassName="w-full" // Force le conteneur à prendre toute la largeur
                className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 pt-7 pb-3 focus:ring-2 focus:ring-[#8EBAE3] font-medium text-gray-600 outline-none"
                required
              />
            </div>

            <input
              name="address"
              placeholder="Adresse postale"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8EBAE3] font-medium placeholder:text-gray-300 outline-none"
              required
            />

            <input
              name="phone_number"
              placeholder="Numéro de téléphone"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#8EBAE3] font-medium placeholder:text-gray-300 outline-none"
              required
            />
          </div>
        </div>

        {/* CARTE 2 : CONNEXION */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
          <div className="mb-6">
            <p className="text-[11px] font-black text-[#98EAD3] uppercase tracking-[0.15em]">Identifiants de connexion</p>
          </div>
          <div className="space-y-4">
            <input
              name="username"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#98EAD3] font-medium placeholder:text-gray-300 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#F8FAFC] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#98EAD3] font-medium placeholder:text-gray-300 outline-none"
              required
            />
          </div>
        </div>

        {/* CARTE 3 : MOT DE PASSE */}
        <div className="bg-gradient-to-br from-[#8EBAE3] to-[#98EAD3] p-8 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sécurité provisoire</p>
            <button 
              type="button" 
              onClick={generatePassword}
              className="bg-white text-[#8EBAE3] px-5 py-2 rounded-full text-[10px] font-black shadow-sm hover:scale-105 transition-transform active:scale-95"
            >
              GÉNÉRER
            </button>
          </div>
          
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-white/20 border-none rounded-2xl px-4 py-5 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white text-xl font-mono text-center relative z-10 outline-none"
            required
          />
        </div>

        {error && (
          <div className="text-red-400 text-[11px] font-black text-center uppercase tracking-widest">
            ⚠️ {error}
          </div>
        )}

        {/* Bouton de validation massif */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-[#98EAD3] hover:bg-[#8EBAE3] text-white rounded-[2rem] font-black text-xs shadow-xl transition-colors duration-500 ease-in-out transform active:scale-95 uppercase tracking-[0.2em]"
        >
          {loading ? "Création..." : "Finaliser l'inscription"}
        </button>

      </form>
    </div>
  );
}