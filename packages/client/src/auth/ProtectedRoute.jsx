import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useMobileDetection } from "../hooks/useMobileDetection";

export default function ProtectedRoute() {
    const { isAuthenticated, isBootstrapping, user } = useAuth();
    const location = useLocation();
    const isMobile = useMobileDetection();

    if (isBootstrapping) {
        return <div className="p-4 text-sm text-black/60">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // TEMPORARY: Disable onboarding check until database migration is complete
    // Assume all users have completed onboarding
    const isOnboardingRoute = location.pathname.startsWith('/onboarding');

    // Redirect users away from onboarding routes
    if (isOnboardingRoute) {
        const defaultPath = isMobile ? '/app/bucket_mobile' : '/app/bucket';
        return <Navigate to={defaultPath} replace />;
    }

    return <Outlet />;
}
