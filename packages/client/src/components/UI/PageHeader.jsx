import { Plus } from "lucide-react";
import SearchInput from "./SearchInput";
import ViewModeToggle from "./ViewModeToggle";

/**
 * Generic page header component used across multiple pages
 * Supports:
 * - Search input
 * - View mode toggle with grouping options
 * - Custom middle content (filters, etc.)
 * - Action button (Add, etc.)
 * - Task count display
 *
 * Used in: Next Actions, Waiting For, Projects, Someday, Reference, Archive
 */
export default function PageHeader({
    // Search props
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",

    // View mode props
    viewMode,
    onViewModeChange,
    groupBy,
    onGroupByChange,
    groupByOptions = [],
    defaultViewLabel = "Table view",
    showStatsButton = false,

    // Middle content (custom filters, etc.)
    middleContent,

    // Task count
    tasksCount,

    // Action button props
    actionLabel = "Add",
    onAction,
    actionIcon: ActionIcon = Plus,

    // Styling props
    variant = "default", // "default" | "minimal"
    className = "",
    searchClassName = "",
    actionClassName = ""
}) {
    const containerClass = variant === "minimal"
        ? `mb-6 ${className}`
        : `border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm my-10 ${className}`;

    return (
        <div className={containerClass}>
            <div className="flex items-center gap-3">
                {/* Left Section: Search + View Toggle */}
                <div className="flex items-center gap-2 flex-1">
                    {/* Search Input */}
                    {onSearchChange && (
                        <div className={searchClassName}>
                            <SearchInput
                                value={searchQuery}
                                onChange={onSearchChange}
                                placeholder={searchPlaceholder}
                            />
                        </div>
                    )}

                    {/* View Mode Toggle */}
                    {onViewModeChange && (
                        <ViewModeToggle
                            viewMode={viewMode}
                            onViewModeChange={onViewModeChange}
                            groupBy={groupBy}
                            onGroupByChange={onGroupByChange}
                            groupByOptions={groupByOptions}
                            defaultViewLabel={defaultViewLabel}
                            showStatsButton={showStatsButton}
                        />
                    )}
                </div>

                {/* Middle Section: Custom Content (filters, etc.) */}
                {middleContent}

                {/* Task Count */}
                {tasksCount !== undefined && (
                    <div className="text-sm text-black/60 dark:text-dark-text-secondary whitespace-nowrap">
                        {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
                    </div>
                )}

                {/* Right Section: Action Button */}
                {onAction && (
                    <button
                        onClick={onAction}
                        className={`btn btn-primary ${actionClassName}`}
                    >
                        <ActionIcon size={20} />
                        <span>{actionLabel}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
