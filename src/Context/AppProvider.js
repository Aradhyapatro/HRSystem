import AppContext from "./AppContext";
import React, { useState } from 'react';

const AppProvider = ({ children }) => {
    const [username, setUsername] = useState("aradhyapatro14@gmail.com");
    const [password, setPassword] = useState("securepass456");
    const [role, setRole] = useState("")
    const [jwt, setJwt] = useState(null)



    return (
        <AppContext.Provider value={{ username, setUsername, password, setPassword, jwt, setJwt, role, setRole }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
