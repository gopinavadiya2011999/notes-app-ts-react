import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
interface ThemeProviderProps {
  children: ReactNode;
}
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className =
      savedTheme === "dark" ? "dark-theme" : "light-theme";
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className =
      newTheme === "dark" ? "dark-theme" : "light-theme";
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
