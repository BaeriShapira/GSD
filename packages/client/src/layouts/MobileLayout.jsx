import { Outlet } from "react-router-dom";

/**
 * Minimal layout for mobile views
 * No sidebar, no header - just clean content area
 */
export default function MobileLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Outlet />
        </div>
    );
}
