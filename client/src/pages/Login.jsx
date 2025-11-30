import '../styles/Login.css'
import { useState } from "react";

export default function Login() {
    const [mode, setMode] = useState("login"); // login | register
    const [role, setRole] = useState("user");  // user | admin

    // shared fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // registration-specific fields
    const [username, setUsername] = useState("");
    const [teamCode, setTeamCode] = useState("");

    const [response, setResponse] = useState("");

    const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    // ---------------------------
    // LOGIN HANDLER
    // ---------------------------
    async function handleLogin(e) {
        e.preventDefault();

        const endpoint = role === "admin"
            ? "/admin-login"
            : "/user-login";

        const res = await fetch(BACKEND + endpoint, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
    }

    // ---------------------------
    // REGISTRATION HANDLER
    // ---------------------------
    async function handleRegister(e) {
        e.preventDefault();

        const endpoint = role === "admin"
            ? "/register-admin"
            : "/register-user";

        const body =
            role === "admin"
                ? { username, email, password }
                : { username, email, password, teamCode };

        const res = await fetch(BACKEND + endpoint, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
    }

    return (
        <div>
            <h1>Login & Registration</h1>

            {/* Switch between login/register */}
            <div>
                <button onClick={() => setMode("login")}>Login</button>
                <button onClick={() => setMode("register")}>Register</button>
            </div>

            {/* Switch between user/admin */}
            <div>
                <label>
                    <input
                        type="radio"
                        checked={role === "user"}
                        onChange={() => setRole("user")}
                    /> User
                </label>

                <label>
                    <input
                        type="radio"
                        checked={role === "admin"}
                        onChange={() => setRole("admin")}
                    /> Admin
                </label>
            </div>

            {/* ---------------- LOGIN FORM ---------------- */}
            {mode === "login" && (
                <form onSubmit={handleLogin}>
                    <h2>{role === "admin" ? "Admin Login" : "User Login"}</h2>

                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>
            )}

            {/* ---------------- REGISTER FORM ---------------- */}
            {mode === "register" && (
                <form onSubmit={handleRegister}>
                    <h2>{role === "admin" ? "Admin Registration" : "User Registration"}</h2>

                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Only show teamCode for user registration */}
                    {role === "user" && (
                        <div>
                            <label>Team Code:</label>
                            <input
                                type="text"
                                value={teamCode}
                                onChange={(e) => setTeamCode(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <button type="submit">Register</button>
                </form>
            )}

            {/* API response */}
            <h3>Response:</h3>
            <pre>{response}</pre>
        </div>
    );
}