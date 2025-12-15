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

    // Check onboarding status
    const isOnboardingRoute = location.pathname.startsWith('/onboarding');
    const needsOnboarding = user && !user.hasCompletedOnboarding;

    // If user needs onboarding and is not on onboarding route, redirect to onboarding
    if (needsOnboarding && !isOnboardingRoute) {
        const onboardingPath = isMobile ? '/onboarding-mobile' : '/onboarding';
        return <Navigate to={onboardingPath} replace />;
    }

    // If user completed onboarding but tries to access onboarding route, redirect to app
    if (!needsOnboarding && isOnboardingRoute) {
        const defaultPath = isMobile ? '/app/bucket_mobile' : '/app/bucket';
        return <Navigate to={defaultPath} replace />;
    }

    return <Outlet />;
}
