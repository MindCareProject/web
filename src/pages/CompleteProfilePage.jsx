import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api/authApi";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", adeliNumber: "", phone: "", cabinetName: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      navigate("/welcome");
    } catch (err) {
      alert("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50">
        <h2 className="text-3xl font-black text-gray-800 tracking-tighter mb-2">Presque fini !</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Complétez vos informations professionnelles</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input type="text" placeholder="Prénom" required className="w-1/2 px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="Nom" required className="w-1/2 px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input type="text" placeholder="Numéro ADELI / RPPS" required className="w-full px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" value={formData.adeliNumber} onChange={(e) => setFormData({...formData, adeliNumber: e.target.value})} />
          <input type="tel" placeholder="Téléphone" required className="w-full px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <input type="text" placeholder="Nom du Cabinet" required className="w-full px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" value={formData.cabinetName} onChange={(e) => setFormData({...formData, cabinetName: e.target.value})} />
          
          <button type="submit" disabled={loading} className="w-full bg-[#8EBAE3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
            {loading ? "Finalisation..." : "Valider mon profil"}
          </button>
        </form>
      </div>
    </div>
  );
}