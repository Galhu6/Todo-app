import { useEffect, useState } from "react";
import "./Navbar.css";
import { jwtDecode } from "jwt-decode";

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                if (decoded.username) {
                    setUserName(decoded.username);
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.error("failed to decode token", err);
                setIsLoggedIn(false);

            }
        }
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="#home" className="logo">Todo.io</a>
            </div>

            <div className="navbar-center">
                <a href="#about">about</a>
                <a href="#programming">programming</a>
                <a href="#contact">contact us</a>
            </div>

            <div className="navbar-right">
                {isLoggedIn ? (
                    <a href="/dashboard"> Hello {userName}, to Dashboard </a>
                ) : (
                    <a href="/auth">Login / Sign-Up</a>
                )}
            </div>
        </nav>
    )
}
