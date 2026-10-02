import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

interface ThemeToggleProps {
    variant?: "icon-only" | "compact";
}

export function ThemeToggle({ variant = "icon-only" }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const titleText = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

    return (
        <button
            type="button"
            className={`theme-toggle-btn ${variant === "compact" ? "theme-toggle-compact" : ""}`}
            onClick={toggleTheme}
            title={titleText}
            aria-label={titleText}
        >
            {isDark ? (
                // Sol para cambiar a claro
                <svg
                    className="theme-toggle-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                </svg>
            ) : (
                // Luna para cambiar a oscuro
                <svg
                    className="theme-toggle-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            )}

            {variant === "compact" && (
                <span className="theme-toggle-label">
                    {isDark ? "Modo Claro" : "Modo Oscuro"}
                </span>
            )}
        </button>
    );
}

export default ThemeToggle;
