import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <>
                    <Moon size={20} className="text-black/60 dark:text-white/70" />
                    <span className="text-sm text-black/80 dark:text-white/90">Dark mode</span>
                </>
            ) : (
                <>
                    <Sun size={20} className="text-black/60 dark:text-white/70" />
                    <span className="text-sm text-black/80 dark:text-white/90">Light mode</span>
                </>
            )}
        </button>
    );
}
