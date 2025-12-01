import PageHeader from "../UI/PageHeader";

export default function WaitingForHeader({
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    groupBy = "area",
    onGroupByChange,
    onAddItem
}) {
    const groupByOptions = [
        { value: "area", label: "Area of Life", icon: "users" },
        { value: "project", label: "Project", icon: "folder" }
    ];

    return (
        <PageHeader
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search waiting for items..."
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            groupBy={groupBy}
            onGroupByChange={onGroupByChange}
            groupByOptions={groupByOptions}
            defaultViewLabel="Table view"
            actionLabel="Add item"
            onAction={onAddItem}
        />
    );
}
