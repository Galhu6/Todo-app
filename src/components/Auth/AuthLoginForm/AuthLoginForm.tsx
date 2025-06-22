import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthLoginForm = () => {
    const navigate = useNavigate();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPaaword, setLoginPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPaaword
                })
            });

            if (!response.ok) {
                console.log("Failed to login", await response.text());

            } else {
                const data = await response.json();
                console.log("Login success:", data);
                navigate('/dashboard')

            }
        } catch (err) {
            console.error("network Error", err);

        }

    };
    return (
        <div className="regular-sign-in">
            <input type="email" placeholder="email" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="password" value={loginPaaword}
                onChange={(e) => setLoginPassword(e.target.value)} />
            <button onClick={handleLogin}></button>
        </div >
    )
}
