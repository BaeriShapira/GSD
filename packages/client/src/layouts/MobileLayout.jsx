import { Outlet } from "react-router-dom";
import MobileNavMenu from "../components/mobile/MobileNavMenu";

/**
 * Mobile layout with bottom navigation
 * No sidebar, no header - just content area with bottom nav
 */
export default function MobileLayout() {
    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Outlet />
            <MobileNavMenu />
        </div>
    );
}
