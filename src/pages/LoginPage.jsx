import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("email", username);
      navigate("/welcome");
    } catch (err) {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT PART */}
        <div className="w-1/2 bg-blue-500 rounded-r-[100px] flex flex-col items-center justify-center text-white p-10">
          <h1 className="text-3xl font-bold mb-2">Hello, Welcome!</h1>
          <p className="mb-6 text-blue-100">Don’t have an account?</p>

          <button
            className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-600 transition"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        {/* RIGHT PART */}
        <div className="w-1/2 flex flex-col justify-center p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <p className="text-right text-sm text-gray-500 cursor-pointer">
              Forgot password?
            </p>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition shadow-md"
            >
              Login
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
