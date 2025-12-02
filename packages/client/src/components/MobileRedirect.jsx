import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useMobileDetection } from "../hooks/useMobileDetection";

/**
 * Mobile Redirect Guard
 * Redirects mobile users to /app/bucket_mobile
 * Redirects desktop users away from /app/bucket_mobile to /app/dashboard
 */
export default function MobileRedirect() {
    const isMobile = useMobileDetection();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname;
        const isBucketMobilePath = currentPath === "/app/bucket_mobile";

        if (isMobile && !isBucketMobilePath) {
            // Mobile user on desktop route -> redirect to mobile bucket
            navigate("/app/bucket_mobile", { replace: true });
        } else if (!isMobile && isBucketMobilePath) {
            // Desktop user on mobile route -> redirect to dashboard
            navigate("/app/dashboard", { replace: true });
        }
    }, [isMobile, location.pathname, navigate]);

    return <Outlet />;
}
