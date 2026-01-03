import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // J'ai retiré useNavigate
import { getPatients } from "../api/patientApi";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError("Impossible de charger la liste des patients.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Petit utilitaire pour les initiales (Avatar)
  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* En-tête de la page */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mes Patients</h1>
          <p className="text-gray-500 mt-1">Gérez vos dossiers patients et suivez leur évolution.</p>
        </div>
        <Link
          to="/add-patient"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
        >
          <span>+</span> Ajouter un patient
        </Link>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-6xl mx-auto">
        
        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* État d'erreur */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-center">
            {error}
          </div>
        )}

        {/* Liste vide */}
        {!loading && !error && patients.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun patient pour le moment</h3>
            <p className="text-gray-500 mb-6">Commencez par ajouter votre premier patient pour accéder au suivi.</p>
            <Link
              to="/add-patient"
              className="text-blue-600 font-semibold hover:underline"
            >
              Créer un dossier patient &rarr;
            </Link>
          </div>
        )}

        {/* Tableau des Patients */}
        {!loading && patients.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-6 font-semibold">Patient</th>
                    <th className="p-6 font-semibold">Email / Identifiant</th>
                    <th className="p-6 font-semibold">Date d'inscription</th>
                    <th className="p-6 font-semibold">Statut</th>
                    <th className="p-6 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patients.map((patient) => (
                    <tr 
                      key={patient.id} 
                      className="hover:bg-blue-50/50 transition duration-150 group cursor-pointer"
                      onClick={() => console.log("Aller vers le dossier du patient", patient.id)}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          {/* Avatar avec Initiales */}
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
                            {getInitials(patient.first_name, patient.last_name) || "P"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-xs text-gray-400">ID: #{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <p className="text-gray-700 text-sm">{patient.email}</p>
                        <p className="text-xs text-gray-400">@{patient.username}</p>
                      </td>

                      <td className="p-6 text-sm text-gray-500">
                        {new Date(patient.date_joined).toLocaleDateString("fr-FR", {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </td>

                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          patient.is_active 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {patient.is_active ? "Actif" : "Inactif"}
                        </span>
                      </td>

                      <td className="p-6 text-right">
                        <button className="text-gray-400 hover:text-blue-600 group-hover:translate-x-1 transition transform font-medium text-sm">
                          Ouvrir &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
