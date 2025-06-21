import { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("")
    const [scrolled, setScrolled] = useState(false)

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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="logo">
                <a href="#home">Todo.io</a>
            </div>

            <div className="nav-links">
                <a href="#about">about</a>
                <a href="#programming">programming</a>
                <a href="#contact">contact us</a>
            </div>

            <div className="flex items-center">
                {isLoggedIn ? (
                    <a href="/dashboard"> Hello {userName}, to Dashboard </a>
                ) : (
                    <a href="/auth">Login / Sign-Up</a>
                )}
            </div>
        </nav>
    )
}

