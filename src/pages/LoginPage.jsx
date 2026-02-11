import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("email", username);
      navigate("/welcome");
    } catch (err) {
      setError("Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-[#8EBAE3]/10 overflow-hidden border border-gray-50">
        
        {/* PARTIE GAUCHE : TEXTES MODIFIÉS */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-[#8EBAE3] to-[#98EAD3] p-10 flex-col items-center justify-center text-white relative rounded-r-[120px]">
          
          <div className="relative z-10 text-center">
            {/* Nouveau titre plus "Santé / Soin" */}
            <h1 className="text-3xl font-black tracking-tighter mb-4 leading-tight">
                Votre espace <br/> de soin
            </h1>
            
            {/* Nouvelle phrase d'accroche */}
            <p className="text-xs font-bold text-white/90 mb-8 leading-relaxed uppercase tracking-widest">
                Connectez-vous pour suivre <br/> vos patients.
            </p>

            <button
              className="border-2 border-white/40 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#8EBAE3] transition-all duration-300"
              onClick={() => navigate("/register")}
            >
              Créer mon compte
            </button>
          </div>
          
          <div className="absolute bottom-10 opacity-30 text-xs font-black uppercase tracking-[0.3em]">
              MindCare v1.0
          </div>
        </div>

        {/* PARTIE DROITE : LOGIN */}
        <div className="w-full md:w-7/12 flex flex-col justify-center p-12 md:p-16 bg-white">
          <div className="mb-8 text-center md:text-left md:ml-4">
            <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Login</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Accès sécurisé</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Identifiant ou Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <div className="text-right">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest cursor-pointer hover:text-[#8EBAE3] transition-colors">
                Mot de passe oublié ?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8EBAE3] hover:bg-[#98EAD3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#8EBAE3]/20 active:scale-95"
            >
              {loading ? "Vérification..." : "Se connecter"}
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