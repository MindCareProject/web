import { useEffect, useState } from "react";
import { getUserProfile } from "../api/authApi"; 

export default function WelcomePage() {
  const [profile, setProfile] = useState({
    firstName: "", lastName: "", email: "", phone: "", adeliNumber: "", cabinetName: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erreur chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <span className="text-[10px] font-black text-[#8EBAE3] uppercase tracking-[0.3em] animate-pulse">
          Initialisation sécurisée...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-8 md:p-12">
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter">Tableau de bord</h1>
          <p className="text-[#8EBAE3] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Espace Praticien • MindCare v1.0
          </p>
        </div>
        <div className="hidden md:block bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Session active</span>
            <div className="h-1.5 w-12 bg-[#98EAD3] rounded-full mt-1"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- COLONNE GAUCHE : PROFIL (4/12) --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-[#8EBAE3]/5 border border-gray-50 relative overflow-hidden">
            {/* Petit accent de couleur en haut */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8EBAE3] to-[#98EAD3]"></div>
            
            {/* Avatar Style Timeline */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-black text-gray-800 capitalize">
                Dr. {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Psychologue Clinicien
              </p>
            </div>

            {/* Liste d'infos verticales style épuré */}
            <div className="space-y-4">
              <div className="group">
                <p className="text-[8px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1 ml-2">Email</p>
                <div className="bg-[#F8FAFC] p-4 rounded-2xl text-xs font-bold text-gray-600 border border-transparent group-hover:border-[#8EBAE3]/20 transition-all">
                  {profile.email}
                </div>
              </div>

              <div className="group">
                <p className="text-[8px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1 ml-2">Numéro ADELI</p>
                <div className="bg-[#F8FAFC] p-4 rounded-2xl text-xs font-bold text-gray-600 border border-transparent group-hover:border-[#8EBAE3]/20 transition-all">
                  {profile.adeliNumber || "Non renseigné"}
                </div>
              </div>

              <div className="group">
                <p className="text-[8px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1 ml-2">Téléphone</p>
                <div className="bg-[#F8FAFC] p-4 rounded-2xl text-xs font-bold text-gray-600 border border-transparent group-hover:border-[#8EBAE3]/20 transition-all">
                  {profile.phone || "Non renseigné"}
                </div>
              </div>

              <div className="group">
                <p className="text-[8px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1 ml-2">Établissement</p>
                <div className="bg-[#F8FAFC] p-4 rounded-2xl text-xs font-bold text-gray-600 border border-transparent group-hover:border-[#8EBAE3]/20 transition-all">
                  {profile.cabinetName || "Pratique Libérale"}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- COLONNE DROITE : PLACEHOLDER POUR FUTURS ÉLÉMENTS (8/12) --- */}
        <div className="lg:col-span-8">
          <div className="h-full bg-[#F8FAFC] rounded-[3rem] border-2 border-dashed border-[#8EBAE3]/20 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-6">
                <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-lg font-black text-gray-700 tracking-tight">Prêt pour votre prochaine séance ?</h3>
            <p className="text-gray-400 text-xs font-medium max-w-xs mt-2 leading-relaxed">
                Ici apparaîtront bientôt vos statistiques, vos derniers patients et vos rappels.
            </p>
            <button className="mt-8 border-2 border-[#8EBAE3] text-[#8EBAE3] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#8EBAE3] hover:text-white transition-all">
                Gérer mes patients
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}