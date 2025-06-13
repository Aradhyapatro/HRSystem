import { createContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'light';
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        document.body.classList.add(savedTheme === "vibrant" ? "vibrant-theme" : "light-theme");
    }, []);


    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
