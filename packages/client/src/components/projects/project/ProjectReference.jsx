import { useMemo, useState } from "react";
import { useTasks } from "../../../hooks/useTasks";
import { useProjects } from "../../../hooks/useProjects";
import ReferenceItemCard from "../../UI/ReferenceItemCard";
import LoadingState from "../../UI/LoadingState";
import ErrorState from "../../UI/ErrorState";
import EditFileModal from "../../reference/EditFileModal";
import AddFileModal from "../../reference/AddFileModal";
import SearchInput from "../../UI/SearchInput";
import { Plus } from "lucide-react";

export default function ProjectReference({ projectId }) {
    const { tasks, isLoading, isError, error, updateTask, deleteTask, createTask } = useTasks("REFERENCE");
    const { projects, isLoading: projectsLoading } = useProjects();

    // Get current project details
    const currentProject = useMemo(() => {
        return projects.find(p => p.id === projectId);
    }, [projects, projectId]);

    // Modal states
    const [editingItem, setEditingItem] = useState(null);
    const [showAddFileModal, setShowAddFileModal] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Filter reference items for this project and apply search
    const projectReferenceItems = useMemo(() => {
        let filtered = tasks.filter(task => task.projectId === projectId);

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task => {
                const taskText = task.text?.toLowerCase() || "";
                const labels = task.labels?.toLowerCase() || "";

                return taskText.includes(query) || labels.includes(query);
            });
        }

        return filtered;
    }, [tasks, projectId, searchQuery]);

    function handleEdit(item) {
        setEditingItem(item);
    }

    function handleDelete(itemId) {
        if (confirm("Are you sure you want to delete this reference item?")) {
            deleteTask(itemId);
        }
    }

    function handleMove(item) {
        // TODO: Implement move functionality
        console.log("Move reference item:", item);
    }

    function handleCreateReference(referenceData) {
        createTask({ ...referenceData, status: "REFERENCE", projectId });
        setShowAddFileModal(false);
    }

    if (isLoading || projectsLoading) {
        return <LoadingState message="Loading reference materials..." />;
    }

    if (isError) {
        return <ErrorState message="Failed to load reference materials" error={error} />;
    }

    return (
        <div>
            {/* Search and Add Button */}
            <div className="mb-4 flex items-center gap-3">
                <div className="flex-1">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search reference materials..."
                    />
                </div>
                <button
                    onClick={() => setShowAddFileModal(true)}
                    className="btn btn-primary"
                >
                    <Plus size={20} />
                    <span>Add Reference</span>
                </button>
            </div>

            {projectReferenceItems.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg text-black/60">No reference materials found</h3>
                    <p className="text-sm text-black/40 mt-2">
                        {searchQuery
                            ? "Try adjusting your search"
                            : "Reference materials for this project will appear here"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {projectReferenceItems.map(item => (
                        <ReferenceItemCard
                            key={item.id}
                            text={item.text}
                            labels={item.labels}
                            folderName={item.folder?.name}
                            attachments={item.attachments}
                            areaOfLife={item.areaOfLife}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.id)}
                            onMove={() => handleMove(item)}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <AddFileModal
                isOpen={showAddFileModal}
                onClose={() => setShowAddFileModal(false)}
                onSubmit={handleCreateReference}
                folderName={currentProject?.name || "Project"}
                defaultProjectId={projectId}
                defaultAreaOfLifeId={currentProject?.areaOfLifeId || null}
            />

            <EditFileModal
                isOpen={!!editingItem}
                item={editingItem}
                onClose={() => setEditingItem(null)}
                onSubmit={(updates) => {
                    if (editingItem) {
                        updateTask(editingItem.id, updates);
                    }
                }}
            />
        </div>
    );
}
