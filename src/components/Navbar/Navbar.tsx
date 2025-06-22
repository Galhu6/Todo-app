import { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [scrolled, setScrolled] = useState(false);

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
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors ${scrolled ? 'bg-gray-900/80 shadow-lg' : 'bg-gray-900/60'}`}
        >
            <a href="#home" className="text-lg font-bold text-indigo-400">
                Todo.io
            </a>

            <div className="hidden gap-6 text-sm md:flex">
                <a href="#about" className="hover:text-indigo-400">
                    about
                </a>
                <a href="#programming" className="hover:text-indigo-400">
                    programming
                </a>
                <a href="#contact" className="hover:text-indigo-400">
                    contact us
                </a>
            </div>

            <div className="text-sm">
                {isLoggedIn ? (
                    <a href="/dashboard" className="hover:text-indigo-400">
                        Hello {userName}, to Dashboard
                    </a>
                ) : (
                    <a href="/auth" className="hover:text-indigo-400">
                        Login / Sign-Up
                    </a>
                )}
            </div>
        </nav>
    );
}

