import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email from navigation state if available
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const verify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/verify-email/", {
        email,
        code
      });
      setMessage("✅ Votre email a été vérifié ! Redirection vers la connexion...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) { // Added err parameter to catch block even if unused to follow standard practice or use it for debug
      setMessage("❌ Code incorrect");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={verify} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl mb-4 font-bold text-center">Vérification d'email</h2>

        <input
          type="email"
          placeholder="Votre email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Code reçu"
          className="w-full p-2 border mb-3 rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full transition duration-200">
          Vérifier
        </button>

        {message && <p className={`mt-4 text-center ${message.includes('✅') ? "text-green-600" : "text-red-500"}`}>{message}</p>}
      </form>
    </div>
  );
}
