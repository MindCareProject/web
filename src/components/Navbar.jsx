// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem("email") || "Utilisateur";

    const handleLogout = () => {
        localStorage.clear(); 
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm border-b border-blue-100 p-3 flex justify-between items-center px-10">
            {/* LOGO & NOM : Lien vers la Welcome Page */}
            <Link to="/welcome" className="flex items-center gap-3 hover:opacity-80 transition">
                {/* Correction ici : pas d'import, 
                   on utilise le chemin direct vers le dossier public 
                */}
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
                
                <div className="flex items-center gap-4 border-l pl-8 ml-4">
                    <span className="text-sm text-gray-400 italic font-medium">{email}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition duration-300 border border-red-100"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;