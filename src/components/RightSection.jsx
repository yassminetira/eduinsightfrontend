import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; 

function RightSection() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirection selon le rôle
    if (data.user.role === "admin") {
      navigate("/admin");
    } else if (data.user.role === "teacher") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }

  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="right-section flex-1 p-12 flex flex-col justify-center">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-gray-400 text-xs tracking-widest">ACCESS PORTAL</span>
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
          📖
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <div>
          <label className="block text-gray-400 text-sm mb-2">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0a1420] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0a1420] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-400 hover:bg-teal-300 text-[#07141d] font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-400 cursor-pointer hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RightSection;  