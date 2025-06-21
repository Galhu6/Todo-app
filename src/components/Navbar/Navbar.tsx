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
        <nav className={`sticky top-0 z-50 flex justify-between items-center px-6 py-4 transition-all ${scrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-gray-900/50'}`}>
            <div className="flex items-center">
                <a href="#home" className="text-2xl font-bold text-neon">Todo.io</a>
            </div>

            <div className="hidden md:flex gap-4 text-sm">
                <a href="#about" className="hover:text-neon transition-colors">about</a>
                <a href="#programming" className="hover:text-neon transition-colors">programming</a>
                <a href="#contact" className="hover:text-neon transition-colors">contact us</a>
            </div>

            <div className="flex items-center">
                {isLoggedIn ? (
                    <a href="/dashboard" className="hover:text-neon transition-colors"> Hello {userName}, to Dashboard </a>
                ) : (
                    <a href="/auth" className="hover:text-neon transition-colors">Login / Sign-Up</a>
                )}
            </div>
        </nav>
    )
}
