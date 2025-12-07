import { Filter, X } from "lucide-react";

export default function MobileNextActionFilters({
    projects,
    contexts,
    areas,
    selectedProjectId,
    selectedContextId,
    selectedAreaId,
    selectedUrgency,
    onProjectChange,
    onContextChange,
    onAreaChange,
    onUrgencyChange,
    onClearFilters
}) {
    const hasActiveFilters = selectedProjectId || selectedContextId || selectedAreaId || selectedUrgency;

    return (
        <div className="bg-white border border-black/10 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-black/60" />
                    <h3 className="font-medium text-sm sm:text-base">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {/* Project Filter */}
                <div>
                    <label className="block text-xs text-black/60 mb-1">Project</label>
                    <select
                        value={selectedProjectId || ""}
                        onChange={(e) => onProjectChange(e.target.value ? Number(e.target.value) : null)}
                        className="input w-full text-sm"
                    >
                        <option value="">All Projects</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Context Filter */}
                <div>
                    <label className="block text-xs text-black/60 mb-1">Context</label>
                    <select
                        value={selectedContextId || ""}
                        onChange={(e) => onContextChange(e.target.value ? Number(e.target.value) : null)}
                        className="input w-full text-sm"
                    >
                        <option value="">All Contexts</option>
                        {contexts.map(context => (
                            <option key={context.id} value={context.id}>
                                {context.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Area of Life Filter */}
                <div>
                    <label className="block text-xs text-black/60 mb-1">Area of Life</label>
                    <select
                        value={selectedAreaId || ""}
                        onChange={(e) => onAreaChange(e.target.value ? Number(e.target.value) : null)}
                        className="input w-full text-sm"
                    >
                        <option value="">All Areas</option>
                        {areas?.map(area => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Urgency Filter */}
                <div>
                    <label className="block text-xs text-black/60 mb-1">Urgency</label>
                    <select
                        value={selectedUrgency || ""}
                        onChange={(e) => onUrgencyChange(e.target.value ? Number(e.target.value) : null)}
                        className="input w-full text-sm"
                    >
                        <option value="">All Urgencies</option>
                        <option value="5">Critical (5)</option>
                        <option value="4">High (4)</option>
                        <option value="3">Medium (3)</option>
                        <option value="2">Low (2)</option>
                        <option value="1">Very Low (1)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
