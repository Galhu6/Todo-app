import { useState } from "react";
import { useNavigate } from "react-router-dom";


const server = import.meta.env.VITE_SERVER_URL
export const AuthLoginForm = () => {
    const navigate = useNavigate();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(`${server}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            });

            if (!response.ok) {
                console.log("Failed to login", await response.text());

            } else {
                const data = await response.json();
                console.log("Login success:", data);
                localStorage.setItem("token", data.token);
                if (data.user?.id) {
                    localStorage.setItem("userId", String(data.user.id))
                }
                navigate('/dashboard')

            }
        } catch (err) {
            console.error("network Error", err);

        }

    };
    return (
        <div className="flex flex-col gap-3">
            <input
                type="email"
                placeholder="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <input
                type="password"
                placeholder="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <button
                onClick={handleLogin}
                className="rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
            >
                Sign In
            </button>
        </div>
    );
}
