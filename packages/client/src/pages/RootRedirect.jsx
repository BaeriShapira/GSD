import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RootRedirect() {
    const { isAuthenticated, isBootstrapping } = useAuth();

    if (isBootstrapping) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-sm text-black/60">Loading...</div>
            </div>
        );
    }

    return <Navigate to={isAuthenticated ? "/app" : "/login"} replace />;
}
