import AreaOfLifeSelector from "../UI/AreaOfLifeSelector";
import { useProjects } from "../../hooks/useProjects";
import { Plus, X } from "lucide-react";


export default function WaitingForDetails({
    waitingFor,
    expectedDate,
    areaOfLifeId,
    projectId,
    onWaitingForChange,
    onExpectedDateChange,
    onAreaChange,
    onProjectChange,
}) {
    const { projects, isLoading: projectsLoading } = useProjects();

    // Filter projects by selected area
    const filteredProjects = areaOfLifeId
        ? projects.filter(p => p.areaOfLifeId === areaOfLifeId)
        : projects;

    return (
        <div className="mt-4 space-y-4 max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Who/what are you waiting for?
                    </label>
                    <input
                        type="text"
                        value={waitingFor}
                        onChange={(e) => onWaitingForChange(e.target.value)}
                        placeholder="e.g., John's response, approval from manager"
                        className="input"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Expected date (optional)
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={expectedDate}
                            onChange={(e) => onExpectedDateChange(e.target.value)}
                            className="input flex-1"
                        />
                        {expectedDate && (
                            <button
                                type="button"
                                onClick={() => onExpectedDateChange("")}
                                className="cursor-pointer p-1.5 text-black hover:bg-red-50 rounded-lg transition-colors"
                                title="Clear date"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AreaOfLifeSelector
                value={areaOfLifeId}
                onChange={onAreaChange}
                label="Area of Life (optional)"
            />

            {/* Parent Project */}
            <div>
                <label className="block text-xs font-medium text-black/60 mb-1">
                    Parent Project (optional)
                </label>
                <select
                    value={projectId || ""}
                    onChange={(e) => onProjectChange(e.target.value ? Number(e.target.value) : null)}
                    className="input"
                    disabled={projectsLoading}
                >
                    <option value="">No parent project</option>
                    {filteredProjects.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
                {!areaOfLifeId && projects.length > 0 && (
                    <p className="text-xs text-black/40 mt-1">
                        Select an area to filter projects
                    </p>
                )}
            </div>
        </div>
    );
}
