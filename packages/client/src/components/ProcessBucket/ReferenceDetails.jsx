import { useState } from "react";
import { Plus } from "lucide-react";
import SelectField from "../UI/SelectField";
import TagInput from "../UI/TagInput";
import NewFolderModal from "../reference/NewFolderModal";
import AreaOfLifeSelector from "../UI/AreaOfLifeSelector";
import { useFolders } from "../../hooks/useFolders";
import { useProjects } from "../../hooks/useProjects";
import { RiFolderAddFill } from "react-icons/ri";



export default function ProcessBucketReferenceDetails({
    folder,
    labels,
    areaOfLifeId,
    projectId,
    onFolderChange,
    onLabelsChange,
    onAreaChange,
    onProjectChange,
}) {
    const { folders, createFolder } = useFolders();
    const { projects, isLoading: projectsLoading } = useProjects();
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);

    // Filter projects by selected area
    const filteredProjects = areaOfLifeId
        ? projects.filter(p => p.areaOfLifeId === areaOfLifeId)
        : projects;

    async function handleCreateFolder(folderName) {
        const newFolder = await createFolder(folderName);
        if (newFolder) {
            onFolderChange(String(newFolder.id));
        }
        setShowNewFolderModal(false);
    }

    return (
        <div className="mt-4 space-y-4 max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Where to store it?
                    </label>
                    <div className="flex gap-2">
                        <SelectField
                            value={folder}
                            onChange={onFolderChange}
                            options={folders.map(f => ({ id: f.id, name: f.name }))}
                            placeholder="Choose folder..."
                            className="flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewFolderModal(true)}
                            className="px-3 py-2 transition-colors cursor-pointer"
                            title="Create new folder"
                        >
                            <RiFolderAddFill size={16} className="text-black/60   hover:text-black/100" />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Add labels so it will be easy to find
                    </label>
                    <TagInput
                        tags={labels}
                        onChange={onLabelsChange}
                        placeholder="Type and press enter..."
                    />
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

            <NewFolderModal
                isOpen={showNewFolderModal}
                onClose={() => setShowNewFolderModal(false)}
                onSubmit={handleCreateFolder}
            />
        </div>
    );
}
