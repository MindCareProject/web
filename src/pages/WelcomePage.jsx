import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/authApi";
import { getDashboard } from "../api/patientApi";
import { apiSessions } from "../api/sessions";
import CalendarWidget from "../components/CalendarWidget";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: "", lastName: "", email: "", phone: "", adeliNumber: "", cabinetName: ""
  });
  const [dashboard, setDashboard] = useState({
    alerts: [], new_responses: [], pending_drafts: [], recent_patients: []
  });
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Gestion des "récemment consultés" via localStorage
  const [recentlyViewed, setRecentlyViewed] = useState([]);

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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Erreur dashboard :", error);
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Charger les patients récemment consultés depuis localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("recentlyViewedPatients") || "[]");
      setRecentlyViewed(stored);
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  // Naviguer vers un patient et le sauvegarder dans les récemment consultés
  const goToPatient = (patientId, patientName) => {
    // Sauvegarder dans les récemment consultés
    try {
      const stored = JSON.parse(localStorage.getItem("recentlyViewedPatients") || "[]");
      const filtered = stored.filter((p) => p.id !== patientId);
      const updated = [{ id: patientId, name: patientName, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 5);
      localStorage.setItem("recentlyViewedPatients", JSON.stringify(updated));
    } catch { /* ignore */ }
    navigate(`/patients/${patientId}`);
  };

  // Fonction pour marquer une réponse comme lue
  const handleMarkAsRead = async (e, entryId) => {
    e.stopPropagation(); // Empêche de déclencher le onClick de la carte entière (goToPatient)
    
    // 1. Mise à jour "Optimiste" de l'UI (on l'enlève direct de l'écran pour la fluidité)
    setDashboard(prev => ({
      ...prev,
      new_responses: prev.new_responses.filter(resp => resp.entry_id !== entryId)
    }));

    // 2. Appel au backend pour sauvegarder l'action en base de données
    try {
      await apiSessions.markResponseAsRead(entryId); 
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center rounded-2xl">
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
        
        {/* --- COLONNE GAUCHE : PROFIL (3/12) --- */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-[#8EBAE3]/5 border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8EBAE3] to-[#98EAD3]"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-black text-gray-800 capitalize">
                Dr. {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                Psychologue Clinicien .
              </p>
            </div>

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

        {/* --- COLONNE DROITE : DASHBOARD (9/12) --- */}
        <div className="lg:col-span-9 space-y-6">

          {dashboardLoading ? (
            <div className="h-full bg-[#F8FAFC] rounded-[3rem] border border-gray-100 flex items-center justify-center p-12">
              <span className="text-[10px] font-black text-[#8EBAE3] uppercase tracking-[0.3em] animate-pulse">
                Chargement du tableau de bord...
              </span>
            </div>
          ) : (
            <>
              {/* ==========================================
                  1. ALERTES CLINIQUES
                  ========================================== */}
              {dashboard.alerts.length > 0 && (
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-red-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 via-orange-400 to-red-300"></div>
                  
                  <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                    Alertes Cliniques
                  </h3>

                  <div className="space-y-3">
                    {dashboard.alerts.map((alert, idx) => (
                      <div 
                        key={idx}
                        onClick={() => goToPatient(alert.patient_id, alert.patient_name)}
                        className={`
                          flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group
                          ${alert.is_urgent 
                            ? 'bg-red-50 border border-red-200 hover:border-red-300 hover:shadow-md hover:shadow-red-100' 
                            : 'bg-orange-50 border border-orange-200 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100'}
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110
                          ${alert.is_urgent ? 'bg-red-100' : 'bg-orange-100'}
                        `}>
                          <span className="text-lg">{alert.is_urgent ? '🚨' : '⚠️'}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-black text-gray-800 truncate">
                              {alert.patient_name}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0 ml-2">
                              {alert.date}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {alert.reasons.map((reason, rIdx) => (
                              <span 
                                key={rIdx}
                                className={`
                                  text-[10px] font-bold px-2.5 py-0.5 rounded-full
                                  ${alert.is_urgent 
                                    ? 'bg-red-200/60 text-red-700' 
                                    : 'bg-orange-200/60 text-orange-700'}
                                `}
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        <span className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 self-center text-lg">
                          →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==========================================
                  2. CALENDRIER ET PLANNING
                  ========================================== */}
              <CalendarWidget />
            </>
          )}

        </div>

      </div>
    </div>
  );
}