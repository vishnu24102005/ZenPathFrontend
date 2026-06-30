import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // alert("Login successful");
        // navigate("/dashboard");
        localStorage.setItem("email", email);
         navigate("/dashboard");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Server loding wait for 60s and Try again");
    }
    finally{
      setLoading(false);
    }
  };

  return (
  <div className="container">
    <div className="signup-box">

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>🔄 Waking up the server...</p>
              <p>This may take up to 60 seconds on the first request.</p>
            </div>
          )}

        <button type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Login"}
          </button>
      </form>

      <p>
        Don’t have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Signup
        </span>
      </p>

    </div>
  </div>
);
}

export default Login;
