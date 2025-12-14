import { useNavigate, useLocation } from "react-router-dom";
import { Inbox, Target, Calendar, Clock } from "lucide-react";
import { BsBucketFill, BsFolderFill } from "react-icons/bs";
import { PiTargetBold } from "react-icons/pi";
import { MdHourglassBottom, MdDashboard } from "react-icons/md";


export default function MobileNavMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            path: "/app/bucket_mobile",
            icon: BsBucketFill,
            label: "Bucket"
        },
        {
            path: "/app/next_actions_mobile",
            icon: PiTargetBold,
            label: "Next Act."
        },
        {
            path: "/app/waiting_for_mobile",
            icon: MdHourglassBottom,
            label: "Waiting"
        },
        {
            path: "/app/dashboard_mobile",
            icon: MdDashboard,
            label: "Dashboard"
        }

    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 shadow-lg z-50">
            <div className="flex items-center justify-around h-18 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${active
                                ? "text-brand-primary bg-brand-primary/10"
                                : "text-black/60 hover:text-black/80 hover:bg-black/5"
                                }`}
                        >
                            <Icon className={`w-5 h-5 `} />
                            <span className={`text-xs font-medium ${active ? "font-semibold" : ""}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
