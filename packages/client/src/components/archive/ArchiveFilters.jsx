import ColumnFilterPopover from "../UI/ColumnFilterPopover";

export default function ArchiveFilters({
    projects,
    areas,
    contexts,
    projectFilterId,
    areaFilterId,
    contextFilterId,
    onProjectFilterChange,
    onAreaFilterChange,
    onContextFilterChange,
}) {
    return (
        <div className="px-4 my-4 flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-black/60">Filters:</span>

            <ColumnFilterPopover
                options={projects}
                selectedId={projectFilterId}
                onChange={onProjectFilterChange}
                labelKey="name"
                valueKey="id"
                placeholder="All projects"
                title="Filter by project"
            />

            <ColumnFilterPopover
                options={areas}
                selectedId={areaFilterId}
                onChange={onAreaFilterChange}
                labelKey="name"
                valueKey="id"
                placeholder="All areas"
                title="Filter by area of life"
            />

            <ColumnFilterPopover
                options={contexts}
                selectedId={contextFilterId}
                onChange={onContextFilterChange}
                labelKey="name"
                valueKey="id"
                placeholder="All contexts"
                title="Filter by context"
            />
        </div>
    );
}
