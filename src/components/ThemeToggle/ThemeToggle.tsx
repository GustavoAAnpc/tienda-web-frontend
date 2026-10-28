import { useTheme } from "../../context/ThemeContext";

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
            className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer border rounded-lg active:translate-y-0 focus-visible:outline-2 focus-visible:outline-blue-500 group ${
                variant === "compact"
                    ? "w-full h-9 px-3 gap-2.5 justify-start text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "w-[38px] h-[38px] p-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-500 hover:-translate-y-0.5 shadow-sm"
            }`}
            onClick={toggleTheme}
            title={titleText}
            aria-label={titleText}
        >
            {isDark ? (
                // Sol para cambiar a claro
                <svg
                    className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-15 text-amber-400"
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
                    className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-15 text-slate-700"
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
                <span className="flex-1 text-left">
                    {isDark ? "Modo Claro" : "Modo Oscuro"}
                </span>
            )}
        </button>
    );
}

export default ThemeToggle;
