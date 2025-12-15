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

    // בדיקת onboarding status
    const isOnboardingRoute = location.pathname.startsWith('/onboarding');
    const isSettingsRoute = location.pathname === '/app/settings';
    const needsOnboarding = user && !user.hasCompletedOnboarding;

    // Allow access to onboarding routes and settings (settings is part of onboarding flow)
    if (needsOnboarding && !isOnboardingRoute && !isSettingsRoute) {
        const onboardingPath = isMobile ? '/onboarding-mobile' : '/onboarding';
        return <Navigate to={onboardingPath} replace />;
    }

    if (!needsOnboarding && isOnboardingRoute) {
        const defaultPath = isMobile ? '/app/bucket_mobile' : '/app/settings';
        return <Navigate to={defaultPath} replace />;
    }

    return <Outlet />;
}
