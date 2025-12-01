import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function SidebarNav({ items, onItemClick }) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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

        // אם יש יותר מפריט אחד, פתח/סגור את התפריט
        setOpen(prev => (prev === section.label ? null : section.label));
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
                                hover:bg-brand-secondary
                                ${open === section.label || isSectionActive ? "bg-brand-secondary text-black/100" : "text-black/70"}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <section.icon className="w-4 h-4" />
                                <span className="text-sm">{section.label}</span>
                            </div>

                            {/* הצג חץ רק אם יש יותר מפריט אחד */}
                            {section.children && section.children.length > 1 && (
                                <ChevronDown
                                    className={`w-4 h-4 text-black/70 transition-transform
                                        ${open === section.label ? "rotate-180" : ""}
                                    `}
                                />
                            )}
                        </button>

                        {/* תתי פריטים - הצג רק אם יש יותר מפריט אחד */}
                        {open === section.label && section.children && section.children.length > 1 && (
                            <div className="mt-1 space-y-1 pl-7 border-l border-black/10">
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
                                            `block py-1 text-sm transition
                                            ${isActive ? "text-black font-medium" : "text-black/70 hover:text-black"}
                                            `
                                        }
                                    >
                                        {child.label}
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
