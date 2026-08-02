import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAllUsers } from "../../api/usersApi";
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const roleColors = isDark ? roleColorsDark : roleColorsLight;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Erreur chargement users", err);
        setError("Impossible de charger les utilisateurs");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <DashboardLayout title="User Management" subtitle="Gérer les utilisateurs">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
          User Management
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          + Add User
        </button>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        {loading ? (
          <p className={`p-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Chargement...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
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
              {users.map((user) => (
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
                    <button className="text-blue-400 font-medium hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UsersPage;