import { useAppContext } from "../../context/AppContext";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useAppContext();

    return (
        <button
            onClick={toggleTheme}
            className="ml-4 text-lg hover:text-indigo-400"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? '🌞' : '🌜'}
        </button>
    );
};