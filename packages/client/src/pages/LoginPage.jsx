import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import LoginForm from "../components/Login/LoginForm";
import logoUrl from "../assets/GSD_LOGO_PURPLE.svg";


export default function LoginPage() {
    const { isAuthenticated, isBootstrapping } = useAuth();
    const navigate = useNavigate();

    // Redirect authenticated users to app
    useEffect(() => {
        if (!isBootstrapping && isAuthenticated) {
            navigate("/app", { replace: true });
        }
    }, [isAuthenticated, isBootstrapping, navigate]);

    // Show nothing while checking authentication
    if (isBootstrapping) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <img
                src={logoUrl}
                alt="GSD cat"
                className="w-80 object-contain select-none"
                draggable="false"
            />
            <LoginForm />

            {/* Footer */}
            <footer className="absolute bottom-4 text-center text-sm text-gray-600">
                <a
                    href="/privacy"
                    className="hover:text-purple-600 transition-colors underline"
                >
                    Privacy Policy
                </a>
            </footer>
        </div>
    );
}



