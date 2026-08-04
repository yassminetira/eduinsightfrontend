import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMyCertificates } from "../../api/inscriptionApi";
import { useTheme } from "../../context/ThemeContext";

function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getMyCertificates();
        setCertificates(data);
      } catch (err) {
        console.error("Erreur chargement certificates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <DashboardLayout title="Certificates" subtitle="Your achievements">
      <h2 className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
        Your Certificates
      </h2>

      {loading ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>Chargement...</p>
      ) : certificates.length === 0 ? (
        <p className={isDark ? "text-slate-400" : "text-slate-500"}>
          Aucun certificat pour le moment.
        </p>
      ) : (
        <div className="space-y-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="relative rounded-3xl border-2 border-amber-400 p-12 text-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fdf6e3, #faf0d4)",
              }}
            >
              <div className="text-5xl mb-4">🏅</div>
              <h3 className="text-2xl font-bold text-amber-700 mb-2">
                Certificate of Completion
              </h3>
              <p className="text-amber-900 mb-1">This certifies that</p>
              <p className="text-xl font-bold text-amber-900 mb-1">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-amber-900 mb-1">has successfully completed</p>
              <p className="text-xl font-bold text-amber-900 mb-1">{cert.courseTitle}</p>
              {cert.grade !== null && (
                <p className="text-amber-800 mb-1">Grade: {cert.grade}%</p>
              )}
              <p className="text-amber-800 mb-4">
                Date: {new Date(cert.date).toLocaleDateString("fr-FR")}
              </p>
              <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-blue-700">
                ⬇ Download
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default CertificatesPage;