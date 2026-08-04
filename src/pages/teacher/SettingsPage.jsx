import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { updateUser } from "../../api/usersApi";
import { useTheme } from "../../context/ThemeContext";

function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
  setSaving(true);
  setMessage("");
  try {
    const userId = user._id || user.id;   
    const updated = await updateUser(userId, { firstName, lastName, email });
    localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
    setMessage("Profil mis à jour ✅");
  } catch (err) {
    console.error("Erreur mise à jour profil", err);
    setMessage("Erreur lors de la mise à jour");
  } finally {
    setSaving(false);
  }
};

  return (
    <DashboardLayout title="Settings" subtitle="Gérer votre profil et préférences">
      {/* Profile */}
      <div className={`rounded-2xl border p-6 mb-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
          Profile
        </h3>

        <label className={`block text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Name
        </label>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Name"
            className={`flex-1 rounded-xl border px-4 py-3 outline-none focus:border-cyan-400 ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          />
         
        </div>

        <label className={`block text-sm mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full rounded-xl border px-4 py-3 mb-4 outline-none focus:border-cyan-400 ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
          }`}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Save"}
        </button>

        {message && (
          <p className={`mt-3 text-sm ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>

      {/* Theme */}
      <div className={`rounded-2xl border p-6 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
          Theme
        </h3>
        <button
          onClick={toggleTheme}
          className={`px-5 py-2.5 rounded-full font-medium text-sm border transition ${
            isDark
              ? "border-slate-800 text-blue-400 hover:bg-slate-900"
              : "border-slate-200 text-blue-600 hover:bg-slate-100"
          }`}
        >
          Toggle {isDark ? "Light" : "Dark"} Mode
        </button>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;