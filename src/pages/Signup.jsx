import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Enter valid email");
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("Weak password");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          navigate("/login");   // 🔥 redirect
        } else {
          alert(data.message);
        }

      } catch (err) {
        alert("Server error");
      }
    }
  };

  return (
  <div className="container">
    <div className="signup-box">

      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="error">{emailError}</p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="error">{passwordError}</p>

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>

    </div>
  </div>
);
}

export default Signup;