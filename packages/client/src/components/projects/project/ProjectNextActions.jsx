import { useMemo, useState } from "react";
import { useTasks } from "../../../hooks/useTasks";
import { useAreas } from "../../../hooks/useAreas";
import { useProjects } from "../../../hooks/useProjects";
import { useContexts } from "../../../hooks/useContexts";
import { bulkUpdateTasksOrder } from "../../../api/tasksApi";

import NextActionsRow from "../../next_actions/NextActionsRow";
import SortableNextActionsRow from "../../next_actions/SortableNextActionsRow";
import LoadingState from "../../UI/LoadingState";
import ErrorState from "../../UI/ErrorState";
import SearchInput from "../../UI/SearchInput";
import UrgencyFilterPopover from "../../UI/UrgencyFilterPopup";
import ColumnFilterPopover from "../../UI/ColumnFilterPopover";
import EditNextActionModal from "../../next_actions/EditNextActionModal";
import NewNextActionModal from "../../next_actions/NewNextActionModal";
import { Plus } from "lucide-react";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function ProjectNextActions({ projectId }) {
    const { tasks, isLoading, isError, error, updateTask, deleteTask, createTask } = useTasks("NEXT_ACTION");
    const { areas, isLoading: areasLoading } = useAreas();
    const { projects, isLoading: projectsLoading } = useProjects();
    const { contexts, isLoading: contextsLoading } = useContexts();

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Get current project details
    const currentProject = useMemo(() => {
        return projects.find(p => p.id === projectId);
    }, [projects, projectId]);

    // Filter state
    const [urgencyFilter, setUrgencyFilter] = useState(null);
    const [contextFilter, setContextFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [editingTask, setEditingTask] = useState(null);
    const [showNewActionModal, setShowNewActionModal] = useState(false);

    // Filter tasks for this project only, exclude blocked tasks, and apply filters
    const projectTasks = useMemo(() => {
        let filtered = tasks.filter(task =>
            task.projectId === projectId && !task.blockedByTaskId
        );

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task => {
                const taskText = task.text?.toLowerCase() || "";
                const contextName = contexts.find(c => c.id === task.contextId)?.name?.toLowerCase() || "";

                return taskText.includes(query) || contextName.includes(query);
            });
        }

        // Apply urgency filter
        if (urgencyFilter !== null) {
            filtered = filtered.filter(task => task.urgency === urgencyFilter);
        }

        // Apply context filter
        if (contextFilter !== null) {
            filtered = filtered.filter(task => task.contextId === contextFilter);
        }

        return filtered;
    }, [tasks, projectId, searchQuery, urgencyFilter, contextFilter, contexts]);

    function handleUpdate(taskId, updates) {
        updateTask(taskId, updates);
    }

    function handleComplete(taskId) {
        if (confirm("Mark this action as complete?")) {
            deleteTask(taskId);
        }
    }

    function handleEdit(task) {
        setEditingTask(task);
    }

    function handleDelete(taskId) {
        if (confirm("Are you sure you want to delete this action?")) {
            deleteTask(taskId);
        }
    }

    function handleCreateAction(actionData) {
        // Set the projectId to current project
        createTask({ ...actionData, projectId });
        setShowNewActionModal(false);
    }

    // Handle drag end - reorder tasks
    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = projectTasks.findIndex((t) => t.id === active.id);
        const newIndex = projectTasks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reorderedTasks = arrayMove(projectTasks, oldIndex, newIndex);

        const updates = reorderedTasks.map((task, index) => ({
            id: task.id,
            sortOrder: index,
        }));

        bulkUpdateTasksOrder(updates).catch(console.error);

        updates.forEach((update) => {
            updateTask(update.id, { sortOrder: update.sortOrder });
        });
    }

    if (isLoading || areasLoading || projectsLoading || contextsLoading) {
        return <LoadingState message="Loading next actions..." />;
    }

    if (isError) {
        return <ErrorState message="Failed to load next actions" error={error} />;
    }

    return (
        <div>
            {/* Search, Filters, and Add Button */}
            <div className="mb-4 flex items-center gap-3">
                <div className="flex-1">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search tasks..."
                    />
                </div>
                <button
                    onClick={() => setShowNewActionModal(true)}
                    className="btn btn-primary"
                >
                    <Plus size={20} />
                    <span>Add Action</span>
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="border border-black/10 rounded-xl overflow-x-auto">
                    <table className="w-full table-fixed min-w-[800px]">
                        <thead>
                            <tr className="border-b border-black/10 bg-gray-50">
                                <th className="w-1/4 p-3 pl-6 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Task
                                </th>
                                <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Project
                                </th>
                                <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    <div className="flex items-center gap-2">
                                        Urgency
                                        <UrgencyFilterPopover
                                            selected={urgencyFilter}
                                            onChange={setUrgencyFilter}
                                        />
                                    </div>
                                </th>
                                <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    <div className="flex items-center gap-2">
                                        Context
                                        <ColumnFilterPopover
                                            options={contexts}
                                            selectedId={contextFilter}
                                            onChange={setContextFilter}
                                            labelKey="name"
                                            valueKey="id"
                                            placeholder="All contexts"
                                            title="Filter by context"
                                        />
                                    </div>
                                </th>
                                <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Est. Time
                                </th>
                                <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Due Date
                                </th>
                                <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <SortableContext
                            items={projectTasks.map((t) => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <tbody>
                                {projectTasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12">
                                            <h3 className="text-lg text-black/60">No next actions found</h3>
                                            <p className="text-sm text-black/40 mt-2">
                                                {searchQuery || urgencyFilter !== null || contextFilter !== null
                                                    ? "Try adjusting your filters"
                                                    : "Next actions for this project will appear here"}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    projectTasks.map(task => (
                                        <SortableNextActionsRow
                                            key={task.id}
                                            task={task}
                                            areas={areas}
                                            projects={projects}
                                            contexts={contexts}
                                            onUpdate={handleUpdate}
                                            onComplete={handleComplete}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            isCelebrating={false}
                                        />
                                    ))
                                )}
                            </tbody>
                        </SortableContext>
                    </table>
                </div>
            </DndContext>

            {/* Modals */}
            <NewNextActionModal
                isOpen={showNewActionModal}
                onClose={() => setShowNewActionModal(false)}
                onSubmit={handleCreateAction}
                defaultProjectId={projectId}
                defaultAreaOfLifeId={currentProject?.areaOfLifeId || null}
            />

            <EditNextActionModal
                isOpen={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={handleUpdate}
            />
        </div>
    );
}
