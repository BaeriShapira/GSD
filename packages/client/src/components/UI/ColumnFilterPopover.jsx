import { useState, useRef, useEffect } from "react";
import { Filter, X } from "lucide-react";

export default function ColumnFilterPopover({
    options,
    selectedId,
    onChange,
    labelKey = "name",
    valueKey = "id",
    placeholder = "All",
    title = "Filter"
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, right: 0 });
    const ref = useRef(null);
    const buttonRef = useRef(null);

    // חישוב מיקום הפופאבר
    useEffect(() => {
        function updatePosition() {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setPopoverPosition({
                    top: rect.bottom + 8, // 8px מרווח מתחת לכפתור
                    right: window.innerWidth - rect.right
                });
            }
        }

        if (isOpen) {
            updatePosition();

            // עדכון מיקום בגלילה או שינוי גודל חלון
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);

            return () => {
                window.removeEventListener("scroll", updatePosition, true);
                window.removeEventListener("resize", updatePosition);
            };
        }
    }, [isOpen]);

    // סגירת הפופאבר בלחיצה מחוץ
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectChange = (e) => {
        const value = e.target.value || null;
        onChange(value);
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange(null);
    };

    const hasActiveFilter = !!selectedId;

    return (
        <div className="inline-flex items-center" ref={ref}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className={`p-1 rounded hover:bg-black/5 transition-colors ${hasActiveFilter ? "text-black bg-black/10" : "text-black/40"
                    }`}
                title={title}
            >
                <Filter className="w-3 h-3 cursor-pointer" />
            </button>

            {isOpen && (
                <div
                    className="fixed z-50 w-56 rounded-lg border border-black/10 bg-white shadow-lg p-3"
                    style={{
                        top: `${popoverPosition.top}px`,
                        right: `${popoverPosition.right}px`
                    }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold  tracking-wide text-black/60">
                            {title}
                        </span>

                        {hasActiveFilter && (
                            <button
                                type="button"
                                className="flex items-center gap-1 text-xs text-black/50 hover:text-black/80"
                                onClick={handleClear}
                            >
                                <X className="w-3 h-3 cursor-pointer" />
                                <span>Clear</span>
                            </button>
                        )}
                    </div>

                    <select
                        value={selectedId || ""}
                        onChange={handleSelectChange}
                        className="w-full border border-black/10 rounded-md px-2 py-1 text-sm text-black/80 
                                   focus:outline-none focus:ring-1 focus:ring-black/20"
                    >
                        <option value="">{placeholder}</option>
                        {options.map(option => (
                            <option
                                key={option[valueKey]}
                                value={String(option[valueKey])}
                            >
                                {option[labelKey]}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
