import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// Hook used inside components
export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
//url to backend API (frontend-api in .env)
  const API_URL =  import.meta.env.VITE_BACKEND_URL;/*"http://localhost:3000";*/

  // User Registration
  async function registerUser(username, email, password, teamCode) {
    //sending POST request to backend / register-user endpoint
    const res = await fetch(`${API_URL}/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // include cookies/session info
      body: JSON.stringify({ username, email, password, teamCode }),
    });
    //Parse response as JSON 
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }

  // Admin Registration
  async function registerAdmin(username, email, password) {
    const res = await fetch(`${API_URL}/register-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }

  // combined login function
  async function login(email, password) {
    // Try user login first
    let res = await fetch(`${API_URL}/user-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    let data = await res.json();

    if (res.ok) {
      //if successful add accountType for easier distinction
      const userData = { ...data.user, accountType: "user" };
      setUser(userData);
      return userData;
    }

    // Try admin login second
    res = await fetch(`${API_URL}/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    data = await res.json();

    if (res.ok) {
      const adminData = { ...data.admin, accountType: "admin" };
      setUser(adminData);
      return adminData;
    }
  //if both fail, throw error
    throw new Error(data.error || "Invalid credentials");
  }

  function logout() {
    setUser(null); //clears user info
  }

  const value = {
    user,
    registerUser,
    registerAdmin,
    login, // combined login
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
