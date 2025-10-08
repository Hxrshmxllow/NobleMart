import { useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";

export default function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    // temporary demo logic
    if (email === "" || password === "") {
      setError("Please fill out all fields.");
      return;
    }

    // TODO: replace with real backend login
    console.log("Logging in:", { email, password });
    setError("");
    if (onLogin) onLogin(email);
    navigate("/admin");
  };

  return (
    <div className="signin-page">
      <div className="signin-box fade-in">
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to continue to NobleMart</p>

        <form onSubmit={handleSubmit} className="signin-form">
          {error && <p className="signin-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="signin-btn">
            Sign In
          </button>

          <div className="signin-footer">
            <span>Don’t have an account?</span>{" "}
            <a href="/signup">Create one</a>
          </div>
        </form>
      </div>
    </div>
  );
}
