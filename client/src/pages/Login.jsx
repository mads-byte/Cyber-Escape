import '../styles/Login.css'
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("user"); // "user" or "admin"
    const [response, setResponse] = useState(null);

    const FRONTEND_URL = "http://localhost:3000";

    async function handleLogin(e) {
        e.preventDefault();

        const endpoint = mode === "admin"
            ? "/admin-login"
            : "/user-login";

        try {
            const res = await fetch(FRONTEND_URL + endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // IMPORTANT for session cookies
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));

        } catch (err) {
            setResponse("Network error: " + err.message);
        }
    }

    return (
        <div>
            <h1>Login Page</h1>

            <div>
                <label>
                    <input
                        type="radio"
                        checked={mode === "user"}
                        onChange={() => setMode("user")}
                    />
                    User Login
                </label>

                <label>
                    <input
                        type="radio"
                        checked={mode === "admin"}
                        onChange={() => setMode("admin")}
                    />
                    Admin Login
                </label>
            </div>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Login</button>
            </form>

            <h3>Response:</h3>
            <pre>{response}</pre>
        </div>
    );
}