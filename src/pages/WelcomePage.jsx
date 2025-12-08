import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    setEmail(savedEmail || "Utilisateur");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8">
        <h1 className="text-xl font-bold text-blue-600">MindCare</h1>
        <div className="space-x-4">
          <Link to="/patients" className="text-gray-600 hover:text-blue-500 font-medium">Patients</Link>
          <Link to="/add-patient" className="text-gray-600 hover:text-blue-500 font-medium">Ajouter un patient</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Bienvenue 👋
        </h1>
        <p className="text-xl text-gray-700">Vous êtes connecté en tant que :</p>
        <p className="text-2xl text-gray-900 mt-2">{email}</p>
      </div>
    </div>
  );
}
