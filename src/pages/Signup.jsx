import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
      password,
    );
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
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          navigate("/login"); // 🔥 redirect
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Server loding wait for 60s and Try again");
      } finally {
        setLoading(false);
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
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>🔄 Waking up the server...</p>
              <p>This may take up to 60 seconds on the first request.</p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Signup"}
          </button>
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
