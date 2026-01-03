import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../api/patientApi"; // Assure-toi que le chemin est bon

export default function AddPatientPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  // Générateur de mot de passe simple pour aider le Psy
  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createPatient(formData);
      // Succès : on redirige vers le dashboard ou la liste des patients
      navigate("/welcome"); 
    } catch (err) {
      console.error(err);
      // Gestion basique des erreurs Django (ex: email déjà pris)
      if (err.response && err.response.data) {
        // On prend la première erreur qui vient
        const firstError = Object.values(err.response.data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : "Une erreur est survenue.");
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden">
        
        {/* En-tête */}
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Nouveau Patient</h1>
            <p className="text-blue-100 mt-2">Créez le dossier et les accès pour un nouveau patient.</p>
          </div>
          <span className="text-4xl">👤</span>
        </div>

        {/* Formulaire */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nom & Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Prénom</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="Jean"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Nom</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            {/* Identifiant & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Nom d'utilisateur (Unique)</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="jdupont12"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Adresse Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="jean.dupont@email.com"
                  required
                />
              </div>
            </div>

            {/* Mot de passe Provisoire */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <label className="block text-blue-800 text-sm font-bold mb-2 uppercase tracking-wide">
                Mot de passe provisoire
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                  placeholder="Définissez un mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-300 transition text-sm font-semibold whitespace-nowrap"
                >
                  Générer 🎲
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                ℹ️ Communiquez ce mot de passe au patient. Il servira pour sa première connexion.
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center font-medium animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/welcome")}
                className="px-6 py-3 text-gray-500 font-medium hover:bg-gray-100 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-0.5 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Création..." : "Créer le Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}