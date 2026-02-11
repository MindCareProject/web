import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(username, email, password);
      // Redirection vers vérification email avec l'état
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      setError("Erreur : cet identifiant ou cet email est déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6">
      {/* CARD PRINCIPALE */}
      <div className="flex w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-[#8EBAE3]/10 overflow-hidden border border-gray-50 flex-row-reverse">
        
        {/* PARTIE DROITE (Comme le Login) : LE STYLE "BULLE" */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-[#8EBAE3] to-[#98EAD3] p-10 flex-col items-center justify-center text-white relative rounded-l-[120px]">
          
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-black tracking-tighter mb-4 leading-tight">
                Prêt à nous <br/> rejoindre ?
            </h1>
            
            <p className="text-xs font-bold text-white/90 mb-8 leading-relaxed uppercase tracking-widest">
                Déjà membre du réseau <br/> MindCare ? <br/> Connectez-vous.
            </p>

            <button
              className="border-2 border-white/40 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#8EBAE3] transition-all duration-300"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
          </div>
          
          <div className="absolute bottom-10 opacity-30 text-xs font-black uppercase tracking-[0.3em]">
              MindCare V1.0
          </div>
        </div>

        {/* PARTIE GAUCHE : FORMULAIRE D'INSCRIPTION */}
        <div className="w-full md:w-7/12 flex flex-col justify-center p-12 md:p-16 bg-white">
          <div className="mb-8 text-center md:text-left md:ml-4">
            <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Inscription</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Créez votre accès praticien</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-[#F8FAFC] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium text-gray-600 placeholder:text-gray-300 transition-all shadow-sm"
                required
              />

              <input
                type="email"
                placeholder="Adresse E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-[#F8FAFC] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium text-gray-600 placeholder:text-gray-300 transition-all shadow-sm"
                required
              />

              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-[#F8FAFC] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium text-gray-600 placeholder:text-gray-300 transition-all shadow-sm"
                required
              />
            </div>

         

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8EBAE3] hover:bg-[#98EAD3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#8EBAE3]/20 active:scale-95"
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>

            {error && (
              <p className="text-red-400 text-center text-[9px] font-black uppercase tracking-widest mt-4">
                ⚠️ {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}