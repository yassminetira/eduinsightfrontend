import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; 

function RightSectionSignup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // "student" par défaut
  const [studentCode, setStudentCode] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Remplissez tous les champs");
      return;
    }

    if (role === "student" && !studentCode) {
      setError("Le code étudiant est obligatoire");
      return;
    }

    if (role === "teacher" && !speciality) {
      setError("La spécialité est obligatoire");
      return;
    }

    // Le backend attend firstName + lastName séparément (validation vue plus tôt)
    // On coupe le "Full Name" au premier espace
    const parts = fullName.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || parts[0]; // fallback si un seul mot tapé

    setLoading(true);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        password,
        role, // "student" ou "teacher"
      };

      if (role === "student") {
        payload.studentCode = studentCode;
      }

      if (role === "teacher") {
        payload.speciality = speciality;
      }

      // ⚠️ Adapte "/auth/register" à la route exacte de ton backend
      await api.post("/auth/register", payload);

      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Erreur lors de l'inscription";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="right-section flex-1 p-12 flex flex-col justify-center">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Create account</h2>
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
          <label className="block text-gray-400 text-sm mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Yassmine Ben ..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#0a1420] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">email</label>
          <input
            type="email"
            placeholder="yourname@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0a1420] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Password</label>
          <input
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0a1420] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Choose your role</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 rounded-lg border transition ${
                role === "student"
                  ? "border-teal-400 text-teal-400 bg-teal-500/10"
                  : "border-white/10 text-gray-400 bg-transparent"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-2 rounded-lg border transition ${
                role === "teacher"
                  ? "border-teal-400 text-teal-400 bg-teal-500/10"
                  : "border-white/10 text-gray-400 bg-transparent"
              }`}
            >
              Teacher
            </button>
          </div>
        </div>

        {role === "student" && (
          <div>
            <label className="block text-gray-400 text-sm mb-2">Student code</label>
            <input
              type="text"
              placeholder="STU2026001"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="w-full bg-[#0a1420] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        )}

        {role === "teacher" && (
          <div>
            <label className="block text-gray-400 text-sm mb-2">Speciality</label>
            <input
              type="text"
              placeholder="Mathématiques"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full bg-[#0a1420] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-400 hover:bg-teal-300 text-[#07141d] font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Create account"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 cursor-pointer hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RightSectionSignup;