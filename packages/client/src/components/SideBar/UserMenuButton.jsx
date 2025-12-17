import { ChevronDown, LogOut, Mail, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import ContactDeveloperModal from "../UI/ContactDeveloperModal";
import UpdatesModal from "../SystemUpdates/UpdatesModal";
import { hasNewUpdates, markUpdatesAsViewed } from "../SystemUpdates/systemUpdates";

export default function UserMenuButton() {
    const [showMenu, setShowMenu] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showUpdatesModal, setShowUpdatesModal] = useState(false);
    const [hasUnreadUpdates, setHasUnreadUpdates] = useState(false);
    const menuRef = useRef(null);
    const { user, logout } = useAuth();

    // Check for new updates on mount
    useEffect(() => {
        setHasUnreadUpdates(hasNewUpdates());
    }, []);

    // Handle null user or missing properties safely
    if (!user) {
        return null;
    }

    const name = user.displayName || user.name;
    const email = user.email;
    const avatar = user.avatarUrl || user.avatar;
    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const handleLogout = () => {
        setShowMenu(false);
        logout();
    };

    const handleContactClick = () => {
        setShowMenu(false);
        setShowContactModal(true);
    };

    const handleUpdatesClick = () => {
        setShowMenu(false);
        setShowUpdatesModal(true);
        // Mark updates as viewed
        markUpdatesAsViewed();
        setHasUnreadUpdates(false);
    };

    return (
        <div className="mt-4" ref={menuRef}>
            <div className="my-3 h-px w-full bg-black/10" />

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-brand-secondary cursor-pointer"
                >
                    <div className="relative">
                        {avatar && (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        )}
                        {/* Red notification dot */}
                        {hasUnreadUpdates && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        {name && (
                            <div className="truncate text-sm font-medium text-black/90">
                                {name}
                            </div>
                        )}
                        {email && (
                            <div className="truncate text-xs text-black/60">
                                {email}
                            </div>
                        )}
                    </div>

                    <ChevronDown className={`h-4 w-4 text-black/50 transition-transform ${showMenu ? "rotate-180" : ""}`} />
                </button>

                {showMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                            onClick={handleUpdatesClick}
                            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2 relative"
                        >
                            <Package size={16} />
                            <span>System Updates</span>
                            {hasUnreadUpdates && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={handleContactClick}
                            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <Mail size={16} />
                            Contact Developer
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <ContactDeveloperModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
            />

            <UpdatesModal
                isOpen={showUpdatesModal}
                onClose={() => setShowUpdatesModal(false)}
            />
        </div>
    );
}
