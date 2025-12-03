import { useState } from "react";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value, false);
  };

  const validateField = (name, value, showErrors = true) => {
    let error = "";
    let valid = false;

    switch (name) {
      case "email":
        if (!emailRegex.test(value)) error = "Enter a valid email address";
        else valid = true;
        break;

      case "password":
        if (value.trim().length < 6 || value.length > 30) {
          error = "Password must be between 6–30 characters.";
        } else valid = true;
        break;

      default:
        break;
    }

    setValidFields((prev) => ({ ...prev, [name]: valid }));
    if (showErrors) setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter valid email address";

    if (formData.password.trim().length < 6 || formData.password.length > 30)
      newErrors.password = "Password must be between 6-30 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    try {
      const user = await login(formData.email, formData.password);

      // AUTO REDIRECT
      if (user.accountType === "admin") {
        navigate("/adminDashboard");
      } else {
        navigate("/escapeRoom");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const getInputClass = (name) => {
    if (validFields[name] === true) return "input-valid";
    if (validFields[name] === false && formData[name]) return "input-invalid";
  };

  return (
    <div className="login--page">
      <form id="loginForm" className="login--form" onSubmit={handleSubmit}>
        <h1 className="login">Login</h1>

        {message && <div id="message">{message}</div>}

        <div className="login--your-info">
          <div className="form--group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass("email")}
              placeholder="example@gmail.com"
            />
            {submitted && errors.email && (
              <div className="login--error">{errors.email}</div>
            )}
          </div>

          <div className="form--group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={getInputClass("password")}
              placeholder="Password"
              maxLength="30"
            />
            {submitted && errors.password && (
              <div className="login--error">{errors.password}</div>
            )}
          </div>

          <div className="login--buttons">
            <button type="submit" className="btn-login">Login</button>
            <a href="/signup" className="btn-login">Sign Up</a>
          </div>
        </div>
      </form>
    </div>
  );
}



