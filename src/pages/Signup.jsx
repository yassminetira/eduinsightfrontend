import LeftSection from "../components/LeftSection";
import RightSectionSignup from "../components/RightSectionSignup";
import "../index.css";

function Signup() {
  return (
    <div className="login-page">
      <div className="login-card">
        <LeftSection />
        <RightSectionSignup />
      </div>
    </div>
  );
}

export default Signup;