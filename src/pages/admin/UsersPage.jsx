import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllUsers, createUser, updateUser } from "../../api/usersApi";
import { useTheme } from "../../context/ThemeContext";

const roleColorsDark = {
  admin: "bg-purple-500/10 text-purple-400",
  teacher: "bg-blue-500/10 text-blue-400",
  student: "bg-green-500/10 text-green-400",
};

const roleColorsLight = {
  admin: "bg-purple-100 text-purple-700",
  teacher: "bg-blue-100 text-blue-700",
  student: "bg-green-100 text-green-700",
};

function UsersPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const roleColors = isDark ? roleColorsDark : roleColorsLight;

  // Recherche + Filtre
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(1, 1000);
      setAllUsers(data.users);
    } catch (err) {
      console.error("Erreur chargement users", err);
      setError("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrage: recherche par nom + filtre par role
  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ firstName: "", lastName: "", email: "", password: "", role: "student" });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingId(user._id);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUser(editingId, payload);
      } else {
        const payload = { ...form };
        if (form.role === "student") {
          payload.studentCode = `ETU${Date.now().toString().slice(-6)}`;
          payload.level = "L1";
        } else if (form.role === "teacher") {
          payload.speciality = "Non spécifié";
        } else if (form.role === "admin") {
          payload.permissions = ["ALL_PERMISSIONS"];
        }
        await createUser(payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Erreur sauvegarde user", err);
      setFormError(err.response?.data?.error || err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="User Management" subtitle="Gérer les utilisateurs">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
          User Management
        </h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Barre de recherche + Filtre */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-cyan-400 ${
            isDark ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
          }`}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-cyan-400 ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Chargement...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Aucun utilisateur trouvé.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-left ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className={`border-b last:border-0 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                  <td className={`px-6 py-3 font-medium ${isDark ? "text-white" : "text-slate-800"}`}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        roleColors[user.role] || (isDark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-700")
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
                          : isDark ? "bg-red-500/10 text-red-400" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-400 font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${isDark ? "bg-slate-950 border border-slate-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                {editingId ? "Edit User" : "Add User"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-900"}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />

              <input
                type="password"
                name="password"
                placeholder={editingId ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                value={form.password}
                onChange={handleChange}
                required={!editingId}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={!!editingId}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-cyan-400 disabled:opacity-50 ${
                  isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              {editingId && (
                <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  Le rôle ne peut pas être modifié.
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Créer l'utilisateur"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default UsersPage;