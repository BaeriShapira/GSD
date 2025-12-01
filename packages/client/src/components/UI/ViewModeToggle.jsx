import { List, Blocks, SquareChartGantt, ToolCase } from "lucide-react";

/**
 * ViewModeToggle component with 4 icon buttons for different view modes
 *
 * @param {string} viewMode - Current view mode ("table"/"grid" or "grouped")
 * @param {function} onViewModeChange - Callback when view mode changes
 * @param {string} groupBy - Current group by option (e.g., "area", "project", "context")
 * @param {function} onGroupByChange - Callback when group by changes
 * @param {Array} groupByOptions - Available group by options [{value: "area", label: "Area of Life", icon: "users"}, ...]
 * @param {string} defaultViewLabel - Label for default view (e.g., "Table view", "Grid view")
 */
export default function ViewModeToggle({
    viewMode,
    onViewModeChange,
    groupBy = "area",
    onGroupByChange,
    groupByOptions = [],
    defaultViewLabel = "Table view"
}) {
    const isGroupedView = viewMode === "grouped";
    const defaultView = defaultViewLabel === "Grid view" ? "grid" : "table";

    function handleDefaultViewClick() {
        onViewModeChange(defaultView);
    }

    function handleGroupByClick(optionValue) {
        onGroupByChange(optionValue);
        onViewModeChange("grouped");
    }

    // Icon mapping
    const iconMap = {
        users: Blocks,
        folder: SquareChartGantt,
        mappin: ToolCase
    };

    return (
        <div className="flex items-center gap-1 p-1">
            {/* Default View Button (Table/Grid) */}
            <button
                onClick={handleDefaultViewClick}
                className={`p-2 rounded transition-colors ${!isGroupedView
                    ? "bg-black/10 text-black"
                    : "text-black/40 hover:text-black/60 cursor-pointer"
                    }`}
                title={defaultViewLabel}
            >
                <List size={18} />
            </button>

            {/* Group By Buttons */}
            {groupByOptions.map(option => {
                const IconComponent = iconMap[option.icon] || Users;
                const isActive = isGroupedView && groupBy === option.value;

                return (
                    <button
                        key={option.value}
                        onClick={() => handleGroupByClick(option.value)}
                        className={`p-2 rounded transition-colors ${isActive
                            ? "bg-black/10 text-black"
                            : "text-black/40 hover:text-black/60 cursor-pointer"
                            }`}
                        title={`Group by ${option.label}`}
                    >
                        <IconComponent size={18} />
                    </button>
                );
            })}
        </div>
    );
}
