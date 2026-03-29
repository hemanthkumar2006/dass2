import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme
    const saved = localStorage.getItem("aura-theme");
    if (saved) return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "dark"; // Default to dark
  });

  useEffect(() => {
    // Save theme preference
    localStorage.setItem("aura-theme", theme);
    
    // Apply theme
    const root = document.documentElement;
    
    if (theme === "light") {
      // Light mode colors
      root.style.setProperty("--bg", "#f5f5f7");
      root.style.setProperty("--panel", "#ffffff");
      root.style.setProperty("--panel2", "#f9fafb");
      root.style.setProperty("--border", "rgba(0, 0, 0, 0.08)");
      root.style.setProperty("--border2", "rgba(0, 0, 0, 0.12)");
      root.style.setProperty("--text", "rgba(0, 0, 0, 0.87)");
      root.style.setProperty("--muted", "rgba(0, 0, 0, 0.6)");
      root.style.setProperty("--fg", "rgba(0, 0, 0, 0.92)");
      // Ensure surface variables used by cards/pages are light as well
      root.style.setProperty("--surface", "#ffffff");
      root.style.setProperty("--surface2", "#ffffff");
      // Softer accent overlays for light backgrounds
      root.style.setProperty("--accentL", "rgba(124,58,237,0.08)");
      root.style.setProperty("--accentB", "rgba(124,28,217,0.12)");
    } else {
      // Dark mode colors
      root.style.setProperty("--bg", "#0d0d14");
      root.style.setProperty("--panel", "#12121e");
      root.style.setProperty("--panel2", "#17172a");
      root.style.setProperty("--border", "rgba(255, 255, 255, 0.07)");
      root.style.setProperty("--border2", "rgba(255, 255, 255, 0.12)");
      root.style.setProperty("--text", "rgba(255, 255, 255, 0.92)");
      root.style.setProperty("--muted", "rgba(255, 255, 255, 0.45)");
      root.style.setProperty("--fg", "rgba(255, 255, 255, 0.92)");
      // Ensure surfaces are dark in dark mode
      root.style.setProperty("--surface", "#1a1a2e");
      root.style.setProperty("--surface2", "#12121e");
      root.style.setProperty("--accentL", "rgba(124,58,237,0.18)");
      root.style.setProperty("--accentB", "rgba(124,58,237,0.35)");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
