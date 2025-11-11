import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import logoUrl from "../assets/GSD_LOGO_PURPLE.svg";
import {
    Package, Paperclip, ClipboardList, Megaphone, Settings, Home, ChevronDown, FileUser
} from "lucide-react";

const nav = [
    {
        to: "/app",
        label: "Dashboard",
        icon: Home,
        end: true,
        subItems: [
            { to: "/app/overview", label: "Overview" },
            { to: "/app/statistics", label: "Statistics" },
            { to: "/app/reports", label: "Reports" },
        ]
    },
    {
        to: "/app/time_management",
        label: "Time management",
        icon: ClipboardList,
        subItems: [
            { to: "/app/time_management/tasks", label: "Tasks" },
            { to: "/app/time_management/projects", label: "Projects" },
            { to: "/app/time_management/calendar", label: "Calendar" },
        ]
    },
    {
        to: "/app/purchase_Orders",
        label: "Purchase Orders",
        icon: Package,
        subItems: [
            { to: "/app/purchase_Orders/all", label: "All Orders" },
            { to: "/app/purchase_Orders/pending", label: "Pending" },
            { to: "/app/purchase_Orders/suppliers", label: "Suppliers" },
        ]
    },
    {
        to: "/app/accounting",
        label: "Accounting",
        icon: Paperclip,
        subItems: [
            { to: "/app/accounting/invoices", label: "Invoices" },
            { to: "/app/accounting/payments", label: "Payments" },
            { to: "/app/accounting/expenses", label: "Expenses" },
        ]
    },
    {
        to: "/app/markting",
        label: "Markting",
        icon: Megaphone,
        subItems: [
            { to: "/app/markting/campaigns", label: "Campaigns" },
            { to: "/app/markting/analytics", label: "Analytics" },
            { to: "/app/markting/leads", label: "Leads" },
        ]
    },
    {
        to: "/app/hr",
        label: "HR",
        icon: FileUser,
        subItems: [
            { to: "/app/hr/employees", label: "Employees" },
            { to: "/app/hr/departments", label: "Departments" },
            { to: "/app/hr/attendance", label: "Attendance" },
        ]
    },
    {
        to: "/app/settings",
        label: "Setting",
        icon: Settings,
        subItems: [
            { to: "/app/settings/general", label: "General" },
            { to: "/app/settings/profile", label: "Profile" },
            { to: "/app/settings/security", label: "Security" },
        ]
    },
];

function NavDropdown({ item }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { to, label, icon: Icon, end, subItems } = item;

    // Check if any sub-item is active
    const isAnyActive = subItems?.some(subItem => {
        return location.pathname === subItem.to || location.pathname.startsWith(subItem.to + '/');
    }) || location.pathname === to;

    return (
        <div className="space-y-1">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={[
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition",
                    isAnyActive
                        ? "bg-brand-primary/15 text-brand-primary font-medium"
                        : "text-black/70 hover:bg-black/5",
                ].join(" ")}
            >
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center">
                        <Icon className="h-4 w-4" />
                    </span>
                    <span>{label}</span>
                </div>
                <ChevronDown
                    className={[
                        "h-4 w-4 transition-transform",
                        isOpen ? "rotate-180" : ""
                    ].join(" ")}
                />
            </button>

            {isOpen && subItems && (
                <div className="ml-4 space-y-1 border-l-2 border-black/10 pl-2">
                    {subItems.map((subItem) => (
                        <NavLink
                            key={subItem.to}
                            to={subItem.to}
                            end={subItem.end}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition",
                                    isActive
                                        ? "bg-brand-primary/15 text-brand-primary font-medium"
                                        : "text-black/60 hover:bg-black/5 hover:text-black/80",
                                ].join(" ")
                            }
                        >
                            <span>{subItem.label}</span>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen z-10  overflow-y-auto">
            <div className="flex min-h-full w-[240px] flex-col justify-between border border-black/10 bg-white/80 p-3 backdrop-blur">
                {/* Top */}
                <div>
                    {/* Logo row */}
                    <div className="flex items-center gap-2 px-2 py-2">
                        <img
                            src={logoUrl}
                            alt="GSD cat"
                            className="w-40 md:w-80  object-contain select-none"
                            draggable="false"
                        />

                    </div>

                    <div className="my-2 h-px w-full bg-black/10" />

                    {/* Nav */}
                    <nav className="mt-2 space-y-1">
                        {nav.map((n) => (
                            <NavDropdown key={n.to} item={n} />
                        ))}
                    </nav>
                </div>

                {/* Bottom user card */}
                <div className="mt-4">
                    <div className="my-3 h-px w-full bg-black/10" />
                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-black/5"
                    >
                        <img
                            src="https://i.pravatar.cc/64?img=5"
                            alt="avatar"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-black/90">Baeri Shapira</div>
                            <div className="truncate text-xs text-black/60">baeri@gmail.com</div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-black/50" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
