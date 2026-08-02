// src/config/sidebarConfig.js
export const sidebarConfig = {
  admin: [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Users", icon: "👥", path: "/admin/users" },
    { label: "Departments", icon: "🏛️", path: "/admin/departments" },
    { label: "Courses", icon: "📚", path: "/admin/courses" },
    { label: "Reports", icon: "📈", path: "/admin/reports" },
    { label: "Settings", icon: "⚙️", path: "/admin/settings" },
  ],
  teacher: [
    { label: "Dashboard", icon: "📊", path: "/teacher" },
    { label: "My Courses", icon: "📚", path: "/teacher/courses" },
    { label: "Content", icon: "🧩", path: "/teacher/content" },
    { label: "Quizzes", icon: "❓", path: "/teacher/quizzes" },
    { label: "Attempts", icon: "📝", path: "/teacher/attempts" },
    { label: "Class Analytics", icon: "📈", path: "/teacher/analytics" },
    { label: "Departments", icon: "🏛️", path: "/teacher/departments" },
  ],
  student: [
    { label: "Dashboard", icon: "📊", path: "/student" },
    { label: "Courses", icon: "📚", path: "/student/courses" },
    { label: "My Learning", icon: "🎓", path: "/student/learning" },
    { label: "Results", icon: "✅", path: "/student/results" },
    { label: "Recommendations", icon: "✨", path: "/student/recommendations" },
    { label: "Profile", icon: "👤", path: "/student/profile" },
     { label: "Departments", icon: "🏛️", path: "/student/departments" },
  ],
};