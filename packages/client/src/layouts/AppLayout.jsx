import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/SideBar/SideBar";
import FloatingQuickCapture from "../components/UI/FloatingQuickCapture";
import { Menu } from "lucide-react";
import { usePageTracking } from "../hooks/usePageTracking";

export default function AppLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Track page views automatically
    usePageTracking();

    return (
        <div className="min-h-screen w-full bg-brand-bg">
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-black/10 hover:bg-gray-50 transition-colors"
                aria-label="Open menu"
            >
                <Menu size={24} className="text-black/80" />
            </button>

            {/* Sidebar - desktop always visible, mobile as overlay */}
            <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            />

            {/* Main content - responsive margin */}
            <main className="lg:ml-[256px] min-h-screen pt-6 lg:pt-6 pb-6">
                <div className="max-w-screen-2xl mx-auto p-2">
                    <Outlet />
                </div>
            </main>

            {/* Floating Quick Capture - Available everywhere */}
            <FloatingQuickCapture />
        </div>
    );
}
