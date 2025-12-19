import UserMenuButton from "./UserMenuButton";
import SidebarLogo from "./SideBarLogo";
import SidebarNav from "./SidebarNav";
import { BsBucketFill, BsFolderFill } from "react-icons/bs";
import { PiTargetBold } from "react-icons/pi";
import { BsLightbulbFill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { MdHourglassBottom, MdDashboard } from "react-icons/md";
import { GrTasks } from "react-icons/gr";
import { X, LayoutDashboard } from "lucide-react";


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

export default function Sidebar({ isMobileMenuOpen, onCloseMobileMenu }) {
    return (
        <>
            {/* Mobile overlay backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
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
                <div className="flex min-h-full w-[240px] flex-col justify-between border border-black/10 bg-white/80 p-3 backdrop-blur">
                    <div>
                        {/* Mobile close button */}
                        <div className="lg:hidden flex justify-end mb-2">
                            <button
                                onClick={onCloseMobileMenu}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={20} className="text-black/60" />
                            </button>
                        </div>

                        <SidebarLogo />
                        <div className="mt-2 mb-6 h-px w-full bg-black/10" />
                        <SidebarNav items={nav} onItemClick={onCloseMobileMenu} />
                    </div>

                    <UserMenuButton
                        name="Baeri Shapira"
                        email="baeri@gmail.com"
                        avatar="https://i.pravatar.cc/64?img=5"
                    />
                </div>
            </aside>
        </>
    );
}
