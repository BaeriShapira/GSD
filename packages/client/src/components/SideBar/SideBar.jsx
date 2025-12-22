import UserMenuButton from "./UserMenuButton";
import SidebarLogo from "./SideBarLogo";
import SidebarNav from "./SidebarNav";
import ThemeToggle from "./ThemeToggle";
import { BsBucketFill, BsFolderFill } from "react-icons/bs";
import { PiTargetBold } from "react-icons/pi";
import { BsLightbulbFill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { MdHourglassBottom, MdDashboard } from "react-icons/md";
import { GrTasks } from "react-icons/gr";
import { X, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";


const nav = [
    {
        label: "Bucket",
        icon: BsBucketFill,
        children: [
            { label: "Bucket", to: "/app/bucket" },
            { label: "Process bucket", to: "/app/process_bucket" },
            { label: "Weekly Review", to: "/app/weekly_review" },
        ],
    },
    {
        label: "Dashboard",
        icon: MdDashboard,
        children: [
            { label: "Dashboard", to: "/app/dashboard" },
        ],
    },
    {
        label: "Next actions",
        icon: PiTargetBold,
        children: [
            { label: "Next actions", to: "/app/next_actions" },
        ],
    },
    {
        label: "Waiting For",
        icon: MdHourglassBottom,
        children: [
            { label: "Waiting For", to: "/app/waiting_for" },
        ],
    },
    {
        label: "Projects",
        icon: GrTasks,
        children: [
            { label: "Projects", to: "/app/projects" },
        ],
    },
    {
        label: "Someday / Maybe",
        icon: BsLightbulbFill,
        children: [
            { label: "Someday", to: "/app/someday" },
        ],
    },
    {
        label: "Reference",
        icon: BsFolderFill,
        children: [
            { label: "Reference", to: "/app/reference" },
            { label: "Archive", to: "/app/archive" },
        ],
    },
    {
        label: "Settings",
        icon: IoSettingsSharp,
        children: [
            { label: "Settings", to: "/app/settings" },
        ],
    },

];

// Admin navigation - only shown to admin users (user.id === 1)
const adminNav = [
    {
        label: "Admin",
        icon: Shield,
        children: [
            { label: "Admin Panel", to: "/app/admin" },
        ],
    },
];

export default function Sidebar({ isMobileMenuOpen, onCloseMobileMenu }) {
    const { user } = useAuth();
    const isAdmin = user?.id === 1;

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
                    onClick={onCloseMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 h-screen z-50 overflow-y-auto
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex min-h-full w-[240px] flex-col justify-between border border-black/10 dark:border-dark-border bg-white/80 dark:bg-dark-bg p-3 backdrop-blur">
                    <div>
                        {/* Mobile close button */}
                        <div className="lg:hidden flex justify-end mb-2">
                            <button
                                onClick={onCloseMobileMenu}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={20} className="text-black/60 dark:text-white/70" />
                            </button>
                        </div>

                        <SidebarLogo />
                        <div className="mt-2 mb-6 h-px w-full bg-black/10 dark:bg-white/10" />
                        <SidebarNav items={nav} onItemClick={onCloseMobileMenu} />

                        {/* Admin navigation - only for user.id === 1 */}
                        {isAdmin && (
                            <>
                                <div className="my-4 h-px w-full bg-black/10 dark:bg-white/10" />
                                <SidebarNav items={adminNav} onItemClick={onCloseMobileMenu} />
                            </>
                        )}
                    </div>

                    <div className="space-y-2">
                        <ThemeToggle />
                        <UserMenuButton
                            name="Baeri Shapira"
                            email="baeri@gmail.com"
                            avatar="https://i.pravatar.cc/64?img=5"
                        />
                    </div>
                </div>
            </aside>
        </>
    );
}
