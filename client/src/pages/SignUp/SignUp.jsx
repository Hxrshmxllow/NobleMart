import { useState } from "react";
import "./SignUp.css";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // TODO: connect to Flask or Firebase backend
    console.log("Creating account:", form);
    alert("✅ Account created successfully!");
    setError("");
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

          <button type="submit" className="signup-btn">Create Account</button>

          <div className="signup-footer">
            <span>Already have an account?</span>{" "}
            <a href="/signin">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
