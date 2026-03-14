import { useEffect, useState } from "react";
import { getUserProfile } from "../api/authApi"; 

export default function WelcomePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adeliNumber: "",
    cabinetName: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erreur réseau ou token expiré :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Chargement de votre espace...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4">
      {/* En-tête de la page */}
      <div className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
          Bienvenue sur <span className="text-blue-600">MindCare</span>
        </h1>
        <p className="text-lg text-slate-500">
          Votre espace praticien est prêt.
        </p>
      </div>

      {/* Carte du profil */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        
        <div className="h-32 bg-gradient-to-r from-blue-400 to-teal-300"></div>
        
        <div className="px-8 pb-8 relative">
          
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-md rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-4xl font-bold uppercase">
                {profile.firstName ? profile.firstName.charAt(0) : "?"}
                {profile.lastName ? profile.lastName.charAt(0) : "?"}
              </div>
            </div>
          </div>

          <div className="mt-20 sm:mt-4 sm:ml-40 mb-8 sm:mb-12">
            <h2 className="text-3xl font-bold text-slate-800 capitalize">
              Dr. {profile.firstName || "Prénom"} {profile.lastName || "Nom"}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Psychologue & Psychothérapeute
            </p>
          </div>

          {/* Grille des informations professionnelles VRAIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Email de contact</p>
              <p className="text-slate-700 font-medium text-lg">{profile.email || "—"}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Téléphone</p>
              <p className="text-slate-700 font-medium text-lg">{profile.phone || "Non renseigné"}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Numéro ADELI / RPPS</p>
              <p className="text-slate-700 font-medium text-lg">{profile.adeliNumber || "Non renseigné"}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Lieu d'exercice</p>
              <p className="text-slate-700 font-medium text-lg">{profile.cabinetName || "Non renseigné"}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}