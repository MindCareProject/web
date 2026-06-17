// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../api/authApi';

const Navbar = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    
    // Si la route est /login, on ne charge pas le profil
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            getUserProfile().then(data => setProfile(data)).catch(err => console.error("Erreur profil navbar:", err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear(); 
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm border-b border-blue-100 p-3 flex justify-between items-center px-10 relative">
            {/* LOGO & NOM */}
            <Link to="/welcome" className="flex items-center gap-3 hover:opacity-80 transition">
                <img src="/logo.png" alt="MindCare Logo" className="h-12 w-auto object-contain" />
                <span className="text-2xl font-black tracking-tight">
                    <span style={{ color: '#96C8EB' }}>Mind</span>
                    <span style={{ color: '#A2F3D3' }}>Care</span>
                </span>
            </Link>

            {/* LIENS DE NAVIGATION */}
            <div className="flex items-center space-x-8">
                <Link to="/patients" className="text-gray-500 hover:text-blue-400 font-bold transition">
                    Mes Patients
                </Link>
                <Link to="/add-patient" className="text-gray-500 hover:text-blue-400 font-bold transition">
                    + Nouveau Patient
                </Link>
                
                <div className="flex items-center gap-4 border-l pl-8 ml-4 relative">
                    {profile ? (
                        <button 
                            onClick={() => setShowProfilePopup(!showProfilePopup)}
                            className="text-sm text-gray-500 font-black hover:text-[#8EBAE3] transition cursor-pointer flex items-center gap-2"
                        >
                            Dr. {profile.firstName} {profile.lastName}
                        </button>
                    ) : (
                        <span className="text-sm text-gray-400 italic font-medium">Chargement...</span>
                    )}

                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition duration-300 border border-red-100 ml-2"
                    >
                        Déconnexion
                    </button>

                    {/* POPUP PROFIL */}
                    {showProfilePopup && profile && (
                        <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-black text-gray-800 capitalize">
                                    Dr. {profile.firstName} {profile.lastName}
                                </h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    Psychologue Clinicien
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-xs font-bold text-gray-600 bg-gray-50 p-2.5 rounded-xl">{profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1">Téléphone</p>
                                    <p className="text-xs font-bold text-gray-600 bg-gray-50 p-2.5 rounded-xl">{profile.phone || "Non renseigné"}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1">Numéro ADELI</p>
                                    <p className="text-xs font-bold text-gray-600 bg-gray-50 p-2.5 rounded-xl">{profile.adeliNumber || "Non renseigné"}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-[#8EBAE3] uppercase tracking-widest mb-1">Établissement</p>
                                    <p className="text-xs font-bold text-gray-600 bg-gray-50 p-2.5 rounded-xl">{profile.cabinetName || "Pratique Libérale"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;