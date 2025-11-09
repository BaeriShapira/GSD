import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const raw = localStorage.getItem("gsd_auth");
        if (raw) setUser(JSON.parse(raw));
        setLoading(false);
    }, []);

    const login = async ({ email, password }) => {
        // כאן תחבר ל-API אמיתי בהמשך.
        const u = { email };
        setUser(u);
        localStorage.setItem("gsd_auth", JSON.stringify(u));
        return u;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("gsd_auth");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}
