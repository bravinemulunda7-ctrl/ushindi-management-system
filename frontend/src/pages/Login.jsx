import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Save authentication details
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Welcome to Ushindi Management System");

      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>USHINDI</h1>
        <h2>Management System</h2>
        <p>Login Portal</p>

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <FaUser className="icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <small>
          © 2026 Ushindi Management System
        </small>

      </div>

    </div>
  );
}

export default Login;