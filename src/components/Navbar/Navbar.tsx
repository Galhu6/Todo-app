import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.js"

export const Navbar = () => {
    const { user, logout } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
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
            className={`sticky top-0 z-50 flex items-center justify-between bg-gray-200 px-6 py-4 transition-colors ${scrolled ? 'bg-gray-200/40 dark:bg-gray-900/60 shadow-lg' : 'bg-gray-200/80 dark:bg-gray-900/80'}`}
        >
            <Link to="/" className="text-lg font-bold text-indigo-400">
                Todo.io
            </Link>

            <div className="flex gap-6 text-sm md:flex">
                {(location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/auth')) ? (
                    <span className="text-indigo-400 font-semibold">{user ? `Hello ${user.name}!` : 'To Dashboard'}</span>
                ) : (
                    <>
                        <Link to="/#about" className="text-gray-900 dark:text-gray-100 hover:text-indigo-400">
                            about
                        </Link>
                        <Link to="/#programming" className="text-gray-900 dark:text-gray-100 hover:text-indigo-400">
                            programming
                        </Link>
                        <Link to="/#contact" className="text-gray-900 dark:text-gray-100 hover:text-indigo-400">
                            contact us
                        </Link>
                    </>
                )}
            </div>

            <div className="flex items-center gap-6 text-sm">
                {(location.pathname.startsWith('/dashboard')) ? (
                    user ? (
                        <>
                            <button onClick={() => { logout(); navigate('/'); }} className="hover:text-indigo-400">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" className="hover:text-indigo-400">Login / Sign-Up</Link>
                    )
                ) : user ? (
                    <>
                        <Link to="/dashboard" className="hover:text-indigo-400">
                            Hello {user.name}, to Dashboard
                        </Link>
                        <button onClick={() => { logout(); navigate('/'); }} className="hover:text-indigo-400">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/auth" className="hover:text-indigo-400">
                        Login / Sign-Up
                    </Link>
                )}
                <ThemeToggle />
            </div>
        </nav >
    );
}

