import { List, Blocks, SquareChartGantt, ToolCase, PieChart } from "lucide-react";

/**
 * ViewModeToggle component with icon buttons for different view modes
 *
 * @param {string} viewMode - Current view mode ("table"/"grid", "grouped", or "stats")
 * @param {function} onViewModeChange - Callback when view mode changes
 * @param {string} groupBy - Current group by option (e.g., "area", "project", "context")
 * @param {function} onGroupByChange - Callback when group by changes
 * @param {Array} groupByOptions - Available group by options [{value: "area", label: "Area of Life", icon: "users"}, ...]
 * @param {string} defaultViewLabel - Label for default view (e.g., "Table view", "Grid view")
 * @param {boolean} showStatsButton - Whether to show the statistics button (default: false)
 */
export default function ViewModeToggle({
    viewMode,
    onViewModeChange,
    groupBy = "area",
    onGroupByChange,
    groupByOptions = [],
    defaultViewLabel = "Table view",
    showStatsButton = false
}) {
    const isGroupedView = viewMode === "grouped";
    const isStatsView = viewMode === "stats";
    const defaultView = defaultViewLabel === "Grid view" ? "grid" : "table";

    function handleDefaultViewClick() {
        onViewModeChange(defaultView);
    }

    function handleGroupByClick(optionValue) {
        onGroupByChange(optionValue);
        onViewModeChange("grouped");
    }

    function handleStatsClick() {
        onViewModeChange("stats");
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
                className={`p-2 rounded transition-colors ${!isGroupedView && !isStatsView
                    ? "bg-black/10 dark:bg-white/20 text-black dark:text-white"
                    : "text-black/40 dark:text-dark-text-secondary hover:text-black/60 dark:hover:text-white cursor-pointer"
                    }`}
                title={defaultViewLabel}
            >
                <List size={18} />
            </button>

            {/* Group By Buttons */}
            {groupByOptions.map(option => {
                const IconComponent = iconMap[option.icon] || Blocks;
                const isActive = isGroupedView && groupBy === option.value;

                return (
                    <button
                        key={option.value}
                        onClick={() => handleGroupByClick(option.value)}
                        className={`p-2 rounded transition-colors ${isActive
                            ? "bg-black/10 dark:bg-white/20 text-black dark:text-white"
                            : "text-black/40 dark:text-dark-text-secondary hover:text-black/60 dark:hover:text-white cursor-pointer"
                            }`}
                        title={`Group by ${option.label}`}
                    >
                        <IconComponent size={18} />
                    </button>
                );
            })}

            {/* Statistics Button */}
            {showStatsButton && (
                <button
                    onClick={handleStatsClick}
                    className={`p-2 rounded transition-colors ${isStatsView
                        ? "bg-black/10 dark:bg-white/20 text-black dark:text-white"
                        : "text-black/40 dark:text-dark-text-secondary hover:text-black/60 dark:hover:text-white cursor-pointer"
                        }`}
                    title="Statistics view"
                >
                    <PieChart size={18} />
                </button>
            )}
        </div>
    );
}
