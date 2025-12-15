import PageHeader from "../UI/PageHeader";

export default function NextActionsHeader({
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    groupBy = "area",
    onGroupByChange,
    onAddAction
}) {
    const groupByOptions = [
        { value: "area", label: "Area of Life", icon: "users" },
        { value: "project", label: "Project", icon: "folder" },
        { value: "context", label: "Context", icon: "mappin" }
    ];

    return (
        <PageHeader
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search next actions..."
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            groupBy={groupBy}
            onGroupByChange={onGroupByChange}
            groupByOptions={groupByOptions}
            defaultViewLabel="Table view"
            actionLabel="Add action"
            onAction={onAddAction}
            searchClassName="next-actions-search"
            actionClassName="next-actions-add-button"
        />
    );
}
