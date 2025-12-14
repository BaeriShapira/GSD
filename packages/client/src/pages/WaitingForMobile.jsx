import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useProjects } from "../hooks/useProjects";
import { useContexts } from "../hooks/useContexts";
import { useAreas } from "../hooks/useAreas";
import MobileNextActionList from "../components/nextActionsMobile/MobileNextActionList";
import MobileNextActionFilters from "../components/nextActionsMobile/MobileNextActionFilters";
import EditNextActionModal from "../components/next_actions/EditNextActionModal";
import { Filter } from "lucide-react";
import logoUrl from "../assets/GSD_LOGO_PURPLE.svg";

/**
 * Mobile-optimized Waiting For page
 * Simple layout for mobile users to view and manage their waiting for items
 */
export default function WaitingForMobile() {
    const { tasks, isLoading, isError, error, updateTask } = useTasks("WAITING_FOR");
    const deleteTaskMutation = useDeleteTask();
    const { projects } = useProjects();
    const { contexts } = useContexts();
    const { areas } = useAreas();

    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedContextId, setSelectedContextId] = useState(null);
    const [selectedAreaId, setSelectedAreaId] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filter tasks
    const filteredTasks = useMemo(() => {
        let filtered = [...tasks];

        if (selectedProjectId) {
            filtered = filtered.filter(task => task.projectId === selectedProjectId);
        }
        if (selectedContextId) {
            filtered = filtered.filter(task => task.contextId === selectedContextId);
        }
        if (selectedAreaId) {
            filtered = filtered.filter(task => task.areaOfLifeId === selectedAreaId);
        }

        // Sort by expected date
        filtered.sort((a, b) => {
            if (!a.expectedDate) return 1;
            if (!b.expectedDate) return -1;
            return new Date(a.expectedDate) - new Date(b.expectedDate);
        });

        return filtered;
    }, [tasks, selectedProjectId, selectedContextId, selectedAreaId]);

    const handleComplete = (taskId) => {
        updateTask(taskId, { status: "COMPLETED" });
    };

    const handleEdit = (task) => {
        setEditingTask(task);
    };

    const handleSaveEdit = (taskId, updates) => {
        updateTask(taskId, updates);
        setEditingTask(null);
    };

    const handleDelete = (taskId) => {
        deleteTaskMutation.mutate(taskId);
    };

    const handleClearFilters = () => {
        setSelectedProjectId(null);
        setSelectedContextId(null);
        setSelectedAreaId(null);
    };

    const hasActiveFilters = selectedProjectId || selectedContextId || selectedAreaId;

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            {/* Header - responsive logo and title */}
            <div className="pt-2 sm:pt-4 pb-2 px-2 sm:px-4">
                <img
                    src={logoUrl}
                    alt="GSD cat"
                    className="w-40 sm:w-52 md:w-60 object-contain select-none mx-auto"
                    draggable="false"
                />
            </div>

            {/* Filter Toggle Button */}
            <div className="px-2 sm:px-4 pb-2">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-full btn ${hasActiveFilters ? 'btn-primary' : 'btn-secondary'} flex items-center justify-center gap-2`}
                >
                    <Filter className="w-4 h-4" />
                    {hasActiveFilters ? 'Filters Active' : 'Show Filters'}
                    {hasActiveFilters && (
                        <span className="bg-white text-brand-primary px-2 py-0.5 rounded-full text-xs font-medium">
                            {[selectedProjectId, selectedContextId, selectedAreaId].filter(Boolean).length}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters - collapsible */}
            {showFilters && (
                <div className="px-2 sm:px-4 pb-3">
                    <MobileNextActionFilters
                        projects={projects}
                        contexts={contexts}
                        areas={areas}
                        selectedProjectId={selectedProjectId}
                        selectedContextId={selectedContextId}
                        selectedAreaId={selectedAreaId}
                        selectedUrgency={null}
                        onProjectChange={setSelectedProjectId}
                        onContextChange={setSelectedContextId}
                        onAreaChange={setSelectedAreaId}
                        onUrgencyChange={() => {}}
                        onClearFilters={handleClearFilters}
                        hideUrgency={true}
                    />
                </div>
            )}

            {/* Tasks Count */}
            <div className="px-2 sm:px-4 pb-2">
                <p className="text-xs sm:text-sm text-black/60 text-center">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'} waiting
                    {hasActiveFilters && ` (filtered from ${tasks.length})`}
                </p>
            </div>

            {/* Tasks List - scrollable area with responsive padding */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 pb-4">
                {isLoading ? (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-sm sm:text-base text-black/50">Loading...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 sm:py-12">
                        <p className="text-sm sm:text-base text-red-600">Error: {error?.message}</p>
                    </div>
                ) : (
                    <MobileNextActionList
                        tasks={filteredTasks}
                        projects={projects}
                        contexts={contexts}
                        areas={areas}
                        onComplete={handleComplete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Edit Modal */}
            {editingTask && (
                <EditNextActionModal
                    task={editingTask}
                    projects={projects}
                    contexts={contexts}
                    areas={areas}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingTask(null)}
                />
            )}
        </div>
    );
}
