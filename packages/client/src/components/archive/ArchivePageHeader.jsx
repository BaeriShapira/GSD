import SearchInput from "../UI/SearchInput";
import ViewModeToggle from "../UI/ViewModeToggle";
import DateFilter from "./DateFilter";

export default function ArchivePageHeader({
    searchQuery,
    onSearchChange,
    tasksCount,
    viewMode,
    onViewModeChange,
    groupBy,
    onGroupByChange,
    selectedYear,
    selectedMonth,
    onYearChange,
    onMonthChange,
}) {
    const groupByOptions = [
        { value: "area", label: "Area of Life", icon: "users" },
    ];

    return (
        <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm my-10">
            <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="flex">
                    <SearchInput
                        value={searchQuery}
                        onChange={onSearchChange}
                        placeholder="Search archived tasks..."
                    />

                    {/* View Mode Toggle */}
                    <ViewModeToggle
                        viewMode={viewMode}
                        onViewModeChange={onViewModeChange}
                        groupBy={groupBy}
                        onGroupByChange={onGroupByChange}
                        groupByOptions={groupByOptions}
                        defaultViewLabel="Table view"
                        showStatsButton={true}
                    />
                </div>




                {/* Date Filter */}
                <DateFilter
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    onYearChange={onYearChange}
                    onMonthChange={onMonthChange}
                />

                {/* Task Count */}
                <div className="text-sm text-black/60 whitespace-nowrap">
                    {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
                </div>
            </div>
        </div>
    );
}
