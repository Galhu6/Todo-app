import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.js"

export const Navbar = () => {
    const { user, logout } = useAppContext();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors ${scrolled ? 'bg-white/800 dark:bg-gray-900/80 shadow-lg' : 'bg-white/60 dark:bg-gray-900/60'}`}
        >
            <a href="/" className="text-lg font-bold text-indigo-400">
                Todo.io
            </a>

            <div className="hidden gap-6 text-sm md:flex">
                {location.pathname.startsWith('/dashboard') ? (
                    <span className="text-indigo-400">{user ? `Hellos ${user.name}!` : 'Dashboard'}</span>
                ) : (
                    <div>
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
                )}
            </div>

            <div className="flex items-center gap-4 text-sm">
                {user ? (
                    <>
                        <a href="/dashboard" className="hover:text-indigo-400">
                            Hello {user.name}, to Dashboard
                        </a>
                        <button onClick={logout} className="hover:text-indigo-400">
                            Logout
                        </button>
                    </>
                ) : (
                    <a href="/auth" className="hover:text-indigo-400">
                        Login / Sign-Up
                    </a>
                )}
                <ThemeToggle />
            </div>
        </nav>
    );
}

