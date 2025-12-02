import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, email, password);
      navigate("/login");
    } catch (err) {
      setError("Impossible de créer le compte");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT PART */}
        <div className="w-1/2 bg-blue-500 rounded-r-[100px] flex flex-col items-center justify-center text-white p-10">
          <h1 className="text-3xl font-bold mb-2">Join Us!</h1>
          <p className="mb-6 text-blue-100">Already have an account?</p>

          <button
            className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-600 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        {/* RIGHT PART */}
        <div className="w-1/2 flex flex-col justify-center p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Create your account
          </h2>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="E-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition shadow-md"
            >
              Sign Up
            </button>

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
