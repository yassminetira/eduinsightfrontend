// src/config/sidebarConfig.js
export const sidebarConfig = {
  admin: [
    { label: "Dashboard", icon: "📊", path: "/admin" },
    { label: "Users", icon: "👥", path: "/admin/users" },
  
    { label: "Courses", icon: "📚", path: "/admin/courses" },
     { label: "Quizzes", icon: "❓", path: "/admin/quizzes" },
    { label: "Students", icon: "🎓", path: "/admin/students" },
    { label: "Docs", icon: "📄", path: "/admin/docs" },
    { label: "Analytics", icon: "📈", path: "/admin/analytics" },
    { label: "Settings", icon: "⚙️", path: "/admin/settings" },
  ],
  teacher: [
    
    { label: "Courses", icon: "📚", path: "/teacher/courses" },
  { label: "Students", icon: "🎓", path: "/teacher/students" },
    { label: "Quizzes", icon: "❓", path: "/teacher/quizzes" },
    
    { label: "Docs", icon: "📄", path: "/teacher/docs" },
    { label: "Settings", icon: "⚙️", path: "/teacher/settings" },

    
  ],
  student: [
    
    { label: "My courses", icon: "📚", path: "/student/courses" },
    { label: "My Progress", icon: "📈", path: "/student/progress" },
{ label: "My Quizzes", icon: "❓", path: "/student/quizzes" },
    
    { label: "My Certificates", icon: "🏆", path: "/student/certificates" },
     { label: "Docs", icon: "📄", path: "/student/docs" },
  ],
};