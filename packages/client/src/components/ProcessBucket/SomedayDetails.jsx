import AreaOfLifeSelector from "../UI/AreaOfLifeSelector";
import { useProjects } from "../../hooks/useProjects";

export default function SomedayDetails({
    taskText,
    areaOfLifeId,
    projectId,
    onTaskTextChange,
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
            {/* Task Text Input */}
            <div>
                <label className="block text-xs font-medium text-black/60 mb-1">
                    Someday Item *
                </label>
                <input
                    type="text"
                    value={taskText}
                    onChange={(e) => onTaskTextChange(e.target.value)}
                    placeholder="What might you want to do someday?"
                    className="input"
                />
            </div>

            {/* Helper Text */}
            <div>
                <p className="text-sm text-black/60">
                    We'll move this item to your Someday list.
                    You can review it during your weekly review, so you won't forget it.
                </p>
            </div>

            {/* Area of Life */}
            <AreaOfLifeSelector
                value={areaOfLifeId}
                onChange={onAreaChange}
                label="Area of Life (optional)"
            />

        </div>
    );
}
