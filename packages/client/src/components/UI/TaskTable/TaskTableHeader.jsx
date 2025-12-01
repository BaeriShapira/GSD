import ColumnFilterPopover from "../ColumnFilterPopover";
import UrgencyFilterPopover from "../UrgencyFilterPopup";

/**
 * Table header component with sorting and filtering support
 *
 * Column configuration format:
 * {
 *   key: "task",           // Unique column identifier
 *   label: "Task",         // Display label
 *   width: "w-1/4",        // Tailwind width class
 *   sortable: true,        // Enable sorting
 *   filterable: false,     // Enable filtering
 *   filterType: "select",  // Filter type: "select" | "urgency"
 *   filterOptions: [],     // Options for select filter
 *   filterConfig: {}       // Additional filter configuration
 * }
 */
export default function TaskTableHeader({
    columns = [],
    sortConfig = {},
    onSort,
    filters = {},
    onFilterChange
}) {
    return (
        <thead>
            <tr className="border-b border-black/10 bg-gray-50">
                {/* Drag handle column placeholder */}
                <th className="w-8 p-3 pl-4"></th>

                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={`${column.width || "w-auto"} p-3 text-left text-xs font-semibold text-black/60 uppercase tracking-wider`}
                    >
                        <div className="flex items-center gap-1">
                            {/* Column Label with optional sorting */}
                            {column.sortable && onSort ? (
                                <button
                                    type="button"
                                    onClick={() => onSort(column.key)}
                                    className="inline-flex items-center gap-1 hover:text-black/80 cursor-pointer"
                                >
                                    <span>{column.label}</span>
                                </button>
                            ) : (
                                <span>{column.label}</span>
                            )}

                            {/* Filter Component */}
                            {column.filterable && onFilterChange && (
                                <>
                                    {column.filterType === "urgency" ? (
                                        <UrgencyFilterPopover
                                            selected={filters[column.key]}
                                            onChange={(value) => onFilterChange(column.key, value)}
                                        />
                                    ) : column.filterType === "select" ? (
                                        <ColumnFilterPopover
                                            options={column.filterOptions || []}
                                            selectedId={filters[column.key]}
                                            onChange={(value) => onFilterChange(column.key, value)}
                                            labelKey={column.filterConfig?.labelKey || "name"}
                                            valueKey={column.filterConfig?.valueKey || "id"}
                                            placeholder={column.filterConfig?.placeholder || `All ${column.label.toLowerCase()}`}
                                            title={column.filterConfig?.title || `Filter by ${column.label.toLowerCase()}`}
                                        />
                                    ) : null}
                                </>
                            )}
                        </div>
                    </th>
                ))}

                {/* Actions Column */}
                <th className="w-[10%] p-3 pr-6 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                    Actions
                </th>
            </tr>
        </thead>
    );
}
