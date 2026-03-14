import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyGoogleToken } from "../api/authApi";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", password: "", firstName: "", lastName: "", adeliNumber: "", phone: "", cabinetName: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser(formData);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      setError("Erreur : vérifiez vos informations ou l'email est déjà utilisé.");
    } finally {
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
      
      // Si c'est un nouvel utilisateur, on demande les infos manquantes
      if (data.is_new_user) navigate("/complete-profile");
      else navigate("/welcome");
    } catch (err) {
      setError("Échec de l'inscription via Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6">
      <div className="flex w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-[#8EBAE3]/10 overflow-hidden border border-gray-50 flex-row-reverse">
        
        {/* DESIGN DROITE */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-[#8EBAE3] to-[#98EAD3] p-10 flex-col items-center justify-center text-white relative rounded-l-[120px]">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Prêt à nous <br/> rejoindre ?</h1>
            <p className="text-xs font-bold text-white/90 mb-8 leading-relaxed uppercase tracking-widest">Déjà membre ?</p>
            <button className="border-2 border-white/40 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-[#8EBAE3] transition-all" onClick={() => navigate("/login")}>Se connecter</button>
          </div>
        </div>

        {/* FORMULAIRE GAUCHE */}
        <div className="w-full md:w-7/12 flex flex-col justify-center p-8 md:p-12 bg-white">
          <div className="mb-6">
            <h2 className="text-4xl font-black text-gray-800 tracking-tighter">Inscription</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Accès Praticien</p>
          </div>

          {/* BOUTON GOOGLE RAPIDE */}
          <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-4 border-2 border-gray-100 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#8EBAE3] transition-all mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            S'inscrire avec Google
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-[9px] font-black text-gray-300 uppercase">OU</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="flex gap-3">
              <input type="text" name="firstName" placeholder="Prénom" onChange={handleChange} required className="w-1/2 px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" />
              <input type="text" name="lastName" placeholder="Nom" onChange={handleChange} required className="w-1/2 px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" />
            </div>
            <input type="text" name="adeliNumber" placeholder="Numéro ADELI / RPPS" onChange={handleChange} required className="w-full px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" />
            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required className="w-full px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" />
            <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required className="w-full px-5 py-3 bg-[#F8FAFC] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#8EBAE3]" />
            <button type="submit" disabled={loading} className="w-full bg-[#8EBAE3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-2">
              {loading ? "Chargement..." : "Créer mon compte"}
            </button>
          </form>
          {error && <p className="text-red-400 text-center text-[9px] font-black uppercase mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}