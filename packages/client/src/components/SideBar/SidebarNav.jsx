import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export default function SidebarNav({ items, onItemClick }) {
    const [open, setOpen] = useState(null);
    const [badgeRefresh, setBadgeRefresh] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Check if user should see "You start here!" badge on Settings
    const shouldShowSettingsBadge = () => {
        const hasCompletedTutorialLocally = localStorage.getItem('hasCompletedSettingsTutorial');
        const hasCompletedTutorialServer = user?.hasSeenSettingsTutorial;
        return user?.hasCompletedOnboarding && !hasCompletedTutorialLocally && !hasCompletedTutorialServer;
    };

    // Check if user should see "Try it yourself!" badge on Bucket
    const shouldShowBucketBadge = () => {
        const hasCompletedSettingsTutorial = localStorage.getItem('hasCompletedSettingsTutorial');
        const hasSeenBucketTutorial = localStorage.getItem('hasSeenBucketTutorial');
        return user?.hasCompletedOnboarding && hasCompletedSettingsTutorial && !hasSeenBucketTutorial;
    };

    // Check if user should see "Fill it and process!" badge on Process Bucket
    const shouldShowProcessBadge = () => {
        const hasSeenBucketTutorial = localStorage.getItem('hasSeenBucketTutorial');
        const hasSeenProcessTutorial = localStorage.getItem('hasSeenProcessTutorial');
        return user?.hasCompletedOnboarding && hasSeenBucketTutorial && !hasSeenProcessTutorial;
    };

    // Check if user should see "Your reference!" badge on Reference
    const shouldShowReferenceBadge = () => {
        const hasSeenProcessTutorial = localStorage.getItem('hasSeenProcessTutorial');
        const hasSeenReferenceTutorial = localStorage.getItem('hasSeenReferenceTutorial');
        return user?.hasCompletedOnboarding && hasSeenProcessTutorial && !hasSeenReferenceTutorial;
    };

    // Check if user should see "Your wishlist!" badge on Someday/Maybe
    const shouldShowSomedayBadge = () => {
        const hasSeenReferenceTutorial = localStorage.getItem('hasSeenReferenceTutorial');
        const hasSeenSomedayTutorial = localStorage.getItem('hasSeenSomedayTutorial');
        return user?.hasCompletedOnboarding && hasSeenReferenceTutorial && !hasSeenSomedayTutorial;
    };

    // Check if user should see "Your projects!" badge on Projects
    const shouldShowProjectsBadge = () => {
        const hasSeenSomedayTutorial = localStorage.getItem('hasSeenSomedayTutorial');
        const hasSeenProjectsTutorial = localStorage.getItem('hasSeenProjectsTutorial');
        return user?.hasCompletedOnboarding && hasSeenSomedayTutorial && !hasSeenProjectsTutorial;
    };

    // Check if user should see "Nudge them!" badge on Waiting For
    const shouldShowWaitingForBadge = () => {
        const hasSeenProjectsTutorial = localStorage.getItem('hasSeenProjectsTutorial');
        const hasSeenWaitingForTutorial = localStorage.getItem('hasSeenWaitingForTutorial');
        return user?.hasCompletedOnboarding && hasSeenProjectsTutorial && !hasSeenWaitingForTutorial;
    };

    // Check if user should see "Get it done!" badge on Next Actions
    const shouldShowNextActionsBadge = () => {
        const hasSeenWaitingForTutorial = localStorage.getItem('hasSeenWaitingForTutorial');
        const hasSeenNextActionsTutorial = localStorage.getItem('hasSeenNextActionsTutorial');
        return user?.hasCompletedOnboarding && hasSeenWaitingForTutorial && !hasSeenNextActionsTutorial;
    };

    // Check if user should see "Plan your day!" badge on Dashboard
    const shouldShowDashboardBadge = () => {
        const hasSeenNextActionsTutorial = localStorage.getItem('hasSeenNextActionsTutorial');
        const hasSeenDashboardTutorial = localStorage.getItem('hasSeenDashboardTutorial');
        return user?.hasCompletedOnboarding && hasSeenNextActionsTutorial && !hasSeenDashboardTutorial;
    };

    // Listen for tutorial completion events to refresh badges immediately
    useEffect(() => {
        const handleTutorialCompleted = () => {
            setBadgeRefresh(prev => prev + 1);
        };

        window.addEventListener('tutorialCompleted', handleTutorialCompleted);
        return () => window.removeEventListener('tutorialCompleted', handleTutorialCompleted);
    }, []);

    // פותח אוטומטית את הקבוצה שהילד שלה פעיל לפי ה־URL
    useEffect(() => {
        const activeSection = items.find(section =>
            section.children?.some(child =>
                location.pathname.startsWith(child.to)
            )
        );
        if (activeSection) {
            setOpen(activeSection.label);
        }
    }, [location.pathname, items]);

    function toggle(section) {
        // אם יש רק פריט אחד, נווט ישירות אליו ללא פתיחת תפריט
        if (section.children && section.children.length === 1) {
            navigate(section.children[0].to);
            if (onItemClick) {
                onItemClick();
            }
            return;
        }

        // אם יש יותר מפריט אחד:
        // 1. נווט לפריט הראשון
        // 2. פתח/סגור את התפריט
        if (section.children && section.children.length > 1) {
            // נווט לפריט הראשון (למשל: Bucket)
            navigate(section.children[0].to);

            // פתח/סגור את התפריט
            setOpen(prev => (prev === section.label ? null : section.label));

            // אל תסגור את התפריט במובייל כי המשתמש רוצה לראות את האפשרויות
            // (onItemClick לא נקרא כאן)
        }
    }

    return (
        <nav className="my-1 space-y-1">
            {items.map(section => {
                const isSectionActive = section.children?.some(child =>
                    location.pathname.startsWith(child.to)
                );

                return (
                    <div key={section.label}>
                        {/* כותרת קבוצה (אב) */}
                        <button
                            type="button"
                            onClick={() => toggle(section)}
                            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition cursor-pointer
                                hover:bg-brand-secondary dark:hover:bg-white/10
                                ${open === section.label || isSectionActive ? "bg-brand-secondary dark:bg-white/10 text-black/100 dark:text-white/90" : "text-black/70 dark:text-white/70"}
                            `}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <section.icon className="w-4 h-4" />
                                <span className="text-sm">{section.label}</span>

                                {/* "You start here!" badge for Settings */}
                                {section.label === "Settings" && shouldShowSettingsBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        You start here!
                                    </span>
                                )}

                                {/* "Try it yourself!" badge for Bucket */}
                                {section.label === "Bucket" && shouldShowBucketBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        Try it yourself!
                                    </span>
                                )}

                                {/* "Your reference!" badge for Reference */}
                                {section.label === "Reference" && shouldShowReferenceBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        Your reference!
                                    </span>
                                )}

                                {/* "Your wishlist!" badge for Someday/Maybe */}
                                {section.label === "Someday / Maybe" && shouldShowSomedayBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        Your wishlist!
                                    </span>
                                )}

                                {/* "Your projects!" badge for Projects */}
                                {section.label === "Projects" && shouldShowProjectsBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        Your projects!
                                    </span>
                                )}

                                {/* "Nudge them!" badge for Waiting For */}
                                {section.label === "Waiting For" && shouldShowWaitingForBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        Nudge them!
                                    </span>
                                )}

                                {/* "Get it done!" badge for Next Actions */}
                                {section.label === "Next actions" && shouldShowNextActionsBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        Get it done!
                                    </span>
                                )}

                                {/* "Plan your day!" badge for Dashboard */}
                                {section.label === "Dashboard" && shouldShowDashboardBadge() && (
                                    <span className="ml-auto mr-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                        Plan your day!
                                    </span>
                                )}
                            </div>

                            {/* הצג חץ רק אם יש יותר מפריט אחד */}
                            {section.children && section.children.length > 1 && (
                                <ChevronDown
                                    className={`w-4 h-4 text-black/70 dark:text-white/70 transition-transform
                                        ${open === section.label ? "rotate-180" : ""}
                                    `}
                                />
                            )}
                        </button>

                        {/* תתי פריטים - הצג רק אם יש יותר מפריט אחד */}
                        {open === section.label && section.children && section.children.length > 1 && (
                            <div className="mt-1 space-y-1 pl-7 border-l border-black/10 dark:border-white/10">
                                {section.children.map(child => (
                                    <NavLink
                                        key={child.to}
                                        to={child.to}
                                        onClick={() => {
                                            // Close mobile menu when clicking on a nav item
                                            if (onItemClick) {
                                                onItemClick();
                                            }
                                        }}
                                        className={({ isActive }) =>
                                            `flex items-center justify-between py-1 text-sm transition
                                            ${isActive ? "text-black dark:text-white font-medium" : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"}
                                            `
                                        }
                                    >
                                        <span>{child.label}</span>

                                        {/* "Fill it and process!" badge for Process Bucket */}
                                        {child.label === "Process bucket" && shouldShowProcessBadge() && (
                                            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-purple-950 rounded-full whitespace-nowrap animate-pulse">
                                                Fill & process!
                                            </span>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
