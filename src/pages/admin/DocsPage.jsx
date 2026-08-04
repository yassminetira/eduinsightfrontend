import DashboardLayout from "../../layouts/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";

function DocsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DashboardLayout title="Documents" subtitle="Documents">
      <div
        className={`rounded-2xl border p-16 flex flex-col items-center justify-center text-center ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="text-5xl mb-4">📄</div>
        <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
          Documents
        </h2>
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>
          File management coming soon.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default DocsPage;