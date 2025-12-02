import { useState } from "react";
import "../styles/Login.css"; 
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user"
  });

  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//Handles all input changes in form
  const handleChange = (e) => {
    const { name, value } = e.target;
    //Update formData state
    setFormData((prev) => ({ ...prev, //keeps old value
         [name]: value               // update only changed field
        }));
  };

  //validate all form fields before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter valid email address";

    if (formData.password.trim().length < 6)
      newErrors.password = "Password must be 6+ characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    //Saving errors so UI can displau them
    setErrors(newErrors);
    //if no err -> return true
    return Object.keys(newErrors).length === 0;
  };

  //Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    try {
        //sending form data to backend
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message);
        return;
      }
      //send user to login page on succesfull signup
      navigate("/login");

    } catch (err) {
      setMessage("Signup failed. Try again.");
    }
  };

  return (
    <div className="login--page">
      <form className="login--form" onSubmit={handleSubmit}>
        <h1 className="login">Sign Up</h1>

        {message && <div id="message">{message}</div>}

        <div className="form--group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          {submitted && errors.email && <div className="login--error">{errors.email}</div>}
        </div>

        <div className="form--group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {submitted && errors.password && <div className="login--error">{errors.password}</div>}
        </div>

        <div className="form--group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {submitted && errors.confirmPassword && <div className="login--error">{errors.confirmPassword}</div>}
        </div>

        <div className="form--group">
          <label>Account Type</label>
          <select className="accoutntype" name="accountType" value={formData.accountType} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="login--buttons">
          <button type="submit" className="btn-login">Create Account</button>
          <a href="/login" className="btn-login">Back to Login</a>
        </div>
      </form>
    </div>
  );
}