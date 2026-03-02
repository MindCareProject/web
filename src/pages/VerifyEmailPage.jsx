import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../api/axios';

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || "");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const verify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await api.post("/auth/verify-email/", {
                email,
                code
            });
            setMessage("Compte activé ! Redirection...");
            
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setMessage("Code ou adresse e-mail incorrect.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#8EBAE3]/10 border border-gray-50 relative overflow-hidden">
                
                {/* DÉCORATION D'ARRIÈRE-PLAN */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#8EBAE3] to-[#98EAD3]"></div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-800 tracking-tighter mb-2">Vérification</h2>
                    <p className="text-[#8EBAE3] text-[10px] font-black uppercase tracking-widest">
                        Sécurisation de votre accès
                    </p>
                </div>

                <form onSubmit={verify} className="space-y-6">
                    
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-2">Adresse E-mail</label>
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="w-full px-6 py-4 bg-[#F8FAFC] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#8EBAE3] font-medium text-gray-600 placeholder:text-gray-300 transition-all shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-2">Code reçu par mail</label>
                            <input
                                type="text"
                                placeholder="000000"
                                maxLength="6"
                                className="w-full px-6 py-4 bg-[#F8FAFC] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#98EAD3] font-black text-center text-2xl tracking-[0.5em] text-[#8EBAE3] placeholder:text-gray-200 transition-all shadow-sm"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8EBAE3] hover:bg-[#98EAD3] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#8EBAE3]/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Vérification..." : "Valider mon compte"}
                    </button>

                    {/* ZONE DE MESSAGE */}
                    {message && (
                        <div className={`mt-6 text-center p-4 rounded-xl text-xs font-bold ${
                            message.includes('✅') 
                                ? "bg-[#98EAD3]/10 text-[#98EAD3]" 
                                : "bg-red-50 text-red-400"
                        }`}>
                            {message}
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Vérifiez vos spams si nécessaire
                    </p>
                </div>
            </div>
        </div>
    );
}