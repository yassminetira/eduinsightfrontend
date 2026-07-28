function LeftSection() {
  return (
    <div className="left-section flex-1 p-12 flex flex-col justify-between">
      <div>
        <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6">
          <span className="text-2xl">🎓</span>
        </div>

        <span className="inline-block px-3 py-1 text-xs tracking-widest text-teal-400 border border-teal-500/40 rounded-full mb-6">
          SMART EDUCATION
        </span>

        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          Empower every learner with actionable insights.
        </h1>

        <p className="text-gray-400 text-base">
          Monitor course engagement, quiz outcomes, and student progress in a single polished workspace.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-teal-400 font-medium mb-3">✨ Why teams love EduInsight</h3>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• Real-time teaching analytics</li>
          <li>• Beautiful dashboards for instructors and students</li>
          <li>• Secure authentication and modern UI</li>
        </ul>
      </div>
    </div>
  );
}

export default LeftSection;