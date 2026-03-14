import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, verifyGoogleToken } from "../api/authApi";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClassicLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("email", username);
      navigate("/welcome");
    } catch (err) {
      setError("Identifiants incorrects ou compte non vérifié.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const data = await verifyGoogleToken(idToken);
      
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("email", data.email);
      
      if (data.is_new_user) navigate("/complete-profile");
      else navigate("/welcome");
    } catch (err) {
      setError("Échec de l'authentification sécurisée.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-[#8EBAE3]/10 overflow-hidden border border-gray-50">
        
        {/* PARTIE GAUCHE (Ton design) */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-[#8EBAE3] to-[#98EAD3] p-10 flex-col items-center justify-center text-white relative rounded-r-[120px]">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Votre espace <br/> de soin</h1>
            <p className="text-xs font-bold text-white/90 mb-8 leading-relaxed uppercase tracking-widest">Accès exclusif <br/> aux praticiens.</p>
            <button
              className="border-2 border-white/40 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#8EBAE3] transition-all duration-300"
              onClick={() => navigate("/register")}
            >
              Créer mon compte
            </button>
          </div>
          <div className="absolute bottom-10 opacity-30 text-xs font-black uppercase tracking-[0.3em]">MindCare v1.0</div>
        </div>

        {/* PARTIE DROITE : LOGIN HYBRIDE */}
        <div className="w-full md:w-7/12 flex flex-col justify-center items-center p-12 md:p-16 bg-white">
          <div className="mb-8 text-center w-full max-w-sm">
            <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Connexion</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Authentification forte requise</p>
          </div>

          <form onSubmit={handleClassicLogin} className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Email"
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8EBAE3] hover:bg-[#98EAD3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95"
            >
              Se connecter
            </button>
          </form>

          {/* SÉPARATEUR */}
          <div className="w-full max-w-sm flex items-center my-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink-0 mx-4 text-gray-300 text-[9px] font-black uppercase tracking-widest">OU</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="w-full max-w-sm flex items-center justify-center gap-4 bg-white border-2 border-gray-100 hover:border-[#8EBAE3] text-gray-600 hover:text-[#8EBAE3] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all shadow-sm hover:shadow-lg active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          {error && <p className="text-red-400 text-center text-[9px] font-black uppercase tracking-widest mt-6">⚠️ {error}</p>}
        </div>
      </div>
    </div>
  );
}