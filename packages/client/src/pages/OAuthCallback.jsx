import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setToken, setUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Store token in localStorage
            localStorage.setItem("token", token);

            // Fetch user info using the token
            fetchUserInfo(token);
        } else {
            // No token found - redirect to login with error
            navigate("/login?error=oauth_failed");
        }
    }, [searchParams, navigate]);

    async function fetchUserInfo(token) {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787/api";

            // Fetch user info from a protected endpoint
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch user info");
            }

            const user = await res.json();

            // Update AuthContext state
            setToken(token);
            setUser(user);

            // Store in localStorage
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect to main app
            navigate("/app");
        } catch (error) {
            console.error("OAuth callback error:", error);
            navigate("/login?error=oauth_failed");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                <p className="mt-4 text-black/60">מתחבר...</p>
            </div>
        </div>
    );
}
