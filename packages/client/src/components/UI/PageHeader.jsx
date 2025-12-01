import { Plus } from "lucide-react";
import SearchInput from "./SearchInput";
import ViewModeToggle from "./ViewModeToggle";

/**
 * Generic page header component used across multiple pages
 * Supports:
 * - Search input
 * - View mode toggle with grouping options
 * - Action button (Add, etc.)
 *
 * Used in: Next Actions, Waiting For, Projects, Someday, Reference
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

    // Action button props
    actionLabel = "Add",
    onAction,
    actionIcon: ActionIcon = Plus,

    // Styling props
    variant = "default", // "default" | "minimal"
    className = ""
}) {
    const containerClass = variant === "minimal"
        ? `mb-6 ${className}`
        : `border border-black/10 rounded-xl bg-white p-6 shadow-sm my-10 ${className}`;

    return (
        <div className={containerClass}>
            <div className="flex items-center justify-between gap-4">
                {/* Left Section: Search + View Toggle */}
                <div className="flex items-center gap-2 flex-1">
                    {/* Search Input */}
                    {onSearchChange && (
                        <SearchInput
                            value={searchQuery}
                            onChange={onSearchChange}
                            placeholder={searchPlaceholder}
                        />
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
                        />
                    )}
                </div>

                {/* Right Section: Action Button */}
                {onAction && (
                    <button
                        onClick={onAction}
                        className="btn btn-primary"
                    >
                        <ActionIcon size={20} />
                        <span>{actionLabel}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
