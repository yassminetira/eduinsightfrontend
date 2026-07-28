import LeftSection from "../components/LeftSection";
import RightSection from "../components/RightSection";
import "../index.css"; 
function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <LeftSection />
        <RightSection />
      </div>
    </div>
  );
}

export default Login;