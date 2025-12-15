import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiGetMe } from "../api/authApi";
import { setLogoutCallback } from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    // טעינה ראשונית מ-localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }

        setIsBootstrapping(false);
    }, []);

    async function login(email, password) {
        const data = await apiLogin(email, password); // { user, token }
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
    }

    function logout() {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Use window.location instead of navigate since AuthProvider is outside Router
        window.location.href = "/login";
    }

    function updateUser(updatedUserData) {
        setUser(prev => {
            const updated = { ...prev, ...updatedUserData };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    }

    // Refresh user data from server on mount if token exists
    useEffect(() => {
        async function refreshUserData() {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                return;
            }

            try {
                const freshUser = await apiGetMe();
                setUser(freshUser);
                localStorage.setItem("user", JSON.stringify(freshUser));
            } catch (error) {
                console.error("Failed to refresh user data:", error);
                // If token is invalid, logout
                logout();
            }
        }

        refreshUserData();
    }, []);

    // Register logout callback with API client for auto-logout on 401
    useEffect(() => {
        setLogoutCallback(logout);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isBootstrapping,
                isAuthenticated: !!token,
                login,
                logout,
                setToken,
                setUser,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
