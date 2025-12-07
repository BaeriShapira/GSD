import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useMobileDetection } from "../hooks/useMobileDetection";

/**
 * Mobile Redirect Guard
 * Redirects mobile users to mobile routes
 * Redirects desktop users away from mobile routes to desktop routes
 */
export default function MobileRedirect() {
    const isMobile = useMobileDetection();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        const isMobilePath = currentPath.includes("_mobile");

        if (isMobile && !isMobilePath) {
            // Mobile user on desktop route -> redirect to mobile bucket
            navigate("/app/bucket_mobile", { replace: true });
        } else if (!isMobile && isMobilePath) {
            // Desktop user on mobile route -> redirect to dashboard
            navigate("/app/dashboard", { replace: true });
        }
    }, [isMobile, location.pathname, navigate]);

    return <Outlet />;
}
