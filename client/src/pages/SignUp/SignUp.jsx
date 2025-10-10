import { useState } from "react";
import "./SignUp.css";
import api from "../../api";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return setError("Please fill out all fields.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (res.data.status === "success") {
        setShowPopup(true);
        setMessage("Account created! Please check your email for the verification code.");
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Server error during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!code) return setMessage("Please enter your verification code.");

    try {
      const res = await api.post("/auth/confirm", {
        email: form.email,
        code: code,
      });

      if (res.data.status === "success") {
        setMessage("✅ Account verified! You can now sign in.");
        setTimeout(() => (window.location.href = "/signin"), 2000);
      } else {
        setMessage(`❌ ${res.data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during confirmation.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box fade-in">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Join NobleMart and start shopping smarter</p>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && <p className="signup-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="signup-footer">
            <span>Already have an account?</span>{" "}
            <a href="/signin">Sign in</a>
          </div>
        </form>
      </div>

      {/* ✅ Verification Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box fade-in">
            <h2>Email Verification</h2>
            <p>{message}</p>
            <form onSubmit={handleConfirm} className="verify-form">
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button type="submit">Verify</button>
              <button type="button" onClick={() => setShowPopup(false)} className="cancel-btn">
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
