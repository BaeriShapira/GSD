import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function DateFilter({ selectedYear, selectedMonth, onYearChange, onMonthChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Get current year and a range of years
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const months = [
        { value: 0, label: "January" },
        { value: 1, label: "February" },
        { value: 2, label: "March" },
        { value: 3, label: "April" },
        { value: 4, label: "May" },
        { value: 5, label: "June" },
        { value: 6, label: "July" },
        { value: 7, label: "August" },
        { value: 8, label: "September" },
        { value: 9, label: "October" },
        { value: 10, label: "November" },
        { value: 11, label: "December" },
    ];

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    function handleYearSelect(year) {
        onYearChange(year === selectedYear ? null : year);
    }

    function handleMonthSelect(month) {
        onMonthChange(month === selectedMonth ? null : month);
    }

    function handleClearAll() {
        onYearChange(null);
        onMonthChange(null);
    }

    // Build display label
    let displayLabel = "Filter by date";
    if (selectedYear && selectedMonth !== null) {
        displayLabel = `${months[selectedMonth].label} ${selectedYear}`;
    } else if (selectedYear) {
        displayLabel = `Year: ${selectedYear}`;
    } else if (selectedMonth !== null) {
        displayLabel = `Month: ${months[selectedMonth].label}`;
    }

    const hasActiveFilter = selectedYear || selectedMonth !== null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors
                    ${hasActiveFilter
                        ? "bg-black/10 border-black/20 text-black font-medium"
                        : "bg-white border-black/10 text-black/60 hover:border-black/20"
                    }
                `}
            >
                <Calendar size={16} />
                <span>{displayLabel}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[280px]">
                    <div className="p-4">
                        {/* Header with Clear button */}
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-black/80">Filter by Date</h3>
                            {hasActiveFilter && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-black/60 hover:text-black/80 underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Year Selection */}
                        <div className="mb-4">
                            <label className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-2 block">
                                Year
                            </label>
                            <div className="grid grid-cols-5 gap-1">
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => handleYearSelect(year)}
                                        className={`
                                            px-2 py-1.5 text-sm rounded transition-colors
                                            ${year === selectedYear
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-black/70 hover:bg-gray-200"
                                            }
                                        `}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Month Selection */}
                        <div>
                            <label className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-2 block">
                                Month
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                                {months.map(month => (
                                    <button
                                        key={month.value}
                                        onClick={() => handleMonthSelect(month.value)}
                                        className={`
                                            px-2 py-1.5 text-xs rounded transition-colors
                                            ${month.value === selectedMonth
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-black/70 hover:bg-gray-200"
                                            }
                                        `}
                                    >
                                        {month.label.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
