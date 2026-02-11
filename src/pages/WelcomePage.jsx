import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    setEmail(savedEmail || "Utilisateur");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Bienvenue 
        </h1>
        <p className="text-xl text-gray-700">Vous êtes connecté en tant que :</p>
        <p className="text-2xl text-gray-900 mt-2">{email}</p>
      </div>
    </div>
  );
}
