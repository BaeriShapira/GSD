import PageHeader from "../UI/PageHeader";

export default function ProjectsHeader({
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    groupBy = "area",
    onGroupByChange,
    onAddProject,
    isGroupedView = false
}) {
    const groupByOptions = [
        { value: "area", label: "Area of Life", icon: "users" }
    ];

    return (
        <PageHeader
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search projects by name or area..."
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            groupBy={groupBy}
            onGroupByChange={onGroupByChange}
            groupByOptions={groupByOptions}
            defaultViewLabel="Grid view"
            actionLabel="Add project"
            onAction={onAddProject}
            variant={isGroupedView ? "default" : "minimal"}
            className={isGroupedView ? "mb-6 my-0" : ""}
            searchClassName="projects-search"
            actionClassName="projects-add-button"
        />
    );
}
