import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersPage from "./pages/admin/UsersPage";
import CoursesPage from "./pages/admin/CoursesPage";
import QuizzesPage from "./pages/admin/QuizzesPage";
import StudentsPage from "./pages/admin/StudentsPage";
import DocsPage from "./pages/admin/DocsPage";
import TeacherCoursesPage from "./pages/teacher/CoursesPage"; 
import TeacherQuizzesPage from "./pages/teacher/QuizzesPage";
import TeacherStudentsPage from "./pages/teacher/StudentsPage";
import TeacherDocsPage from "./pages/teacher/DocsPage";
import StudentDocsPage from "./pages/student/DocsPage";
import StudentQuizzesPage from "./pages/student/QuizzesPage";
import SettingsPage from "./pages/admin/SettingsPage";
import TeacherSettingsPage from "./pages/teacher/SettingsPage";
import StudentCoursesPage from "./pages/student/CoursesPage";
import CertificatesPage from "./pages/student/CertificatesPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherCoursesPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/courses" element={<CoursesPage />} />
        <Route path="/admin/quizzes" element={<QuizzesPage />} />
        <Route path="/admin/students" element={<StudentsPage />} />
        <Route path="/admin/docs" element={<DocsPage />} />
        <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
         <Route path="/teacher/quizzes" element={<TeacherQuizzesPage />} />
         <Route path="/teacher/students" element={<StudentsPage />} />
         <Route path="/teacher/docs" element={<DocsPage />} />
         <Route path="/student/docs" element={<DocsPage />} />
         <Route path="/student/quizzes" element={<StudentQuizzesPage />} />
         <Route path="/admin/settings" element={<SettingsPage />} />
         <Route path="/teacher/settings" element={<SettingsPage />} />
         <Route path="/student/courses" element={<StudentCoursesPage />} />
         <Route path="/student/certificates" element={<CertificatesPage />} />

    </Routes>
  );
}

export default App;