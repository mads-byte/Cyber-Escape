import { useState } from "react";
import "../styles/Signup.css"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

export default function Signup() {
  const navigate = useNavigate();
  const {registerUser, registerAdmin } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    teamCode: "",
    accountType: "user"
  });

  const [errors, setErrors] = useState({});
//   const [validFields, setValidFields] = useState({});
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

    if (!formData.username.trim())
        newErrors.username = "Username is required";

    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter valid email address";

    if (formData.password.trim().length < 6)
      newErrors.password = "Password must be 6+ characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";


    //Users must provide a team code
    if (formData.accountType === "user" && !formData.teamCode.trim())
        newErrors.teamCode = "Team code is required";

    //Saving errors so UI can display them
    setErrors(newErrors);
    //if no err -> return true
    return Object.keys(newErrors).length === 0;
  };

  //Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setMessage("");

    if (!validateForm()) return;

    try {
        let response;

        if (formData.accountType == "user"){
            //send to /register-user
            response = await registerUser(
                formData.username,
                formData.email,
                formData.password,
                formData.teamCode,
            );
        }else {
            //send to /register-admin
            response = await registerAdmin(
                formData.username,
                formData.email,
                formData.password
            );
        }

        navigate("/login");
    } catch (err) {
        setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <div className="signup--page">
      <form className="sign--form" onSubmit={handleSubmit}>
        <h1 className="login">Create Account</h1>

        {message && <div id="message">{message}</div>}

        <div className="form--group">
            <label>Username</label>
            <input
                type="text"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
            />
            {submitted && errors.username && (
                <div className="login-error">{errors.username}</div>
            )}
        </div>

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

        {formData.accountType === "user" && (
            <div className="form--group">
                <label>Team Code</label>
                <input 
                    type="text"
                    name="teamCode"
                    placeholder="ABCDE"
                    value={formData.teamCode}
                    onChange={handleChange}
                />
                {submitted && errors.teamCode && (
                    <div className="login--error">{errors.teamCode}</div>
                )}
            </div>
        )}

        <div className="form--group">
          <label>Account Type</label>
          <select className="accoutntype" name="accountType" value={formData.accountType} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

          <button type="submit" className="btn-login">Create Account</button>
          <p className="accswitch">
            Back to {"  "}
            <span className="acc-link" onClick={() => navigate("/login")}>
                Login
            </span>

          </p>
      </form>
    </div>
  );
}

