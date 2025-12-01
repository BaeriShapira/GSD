import { useMemo, useState } from "react";
import { useTasks } from "../../../hooks/useTasks";
import { useAreas } from "../../../hooks/useAreas";
import { useProjects } from "../../../hooks/useProjects";
import { bulkUpdateTasksOrder } from "../../../api/tasksApi";

import WaitingForRow from "../../waiting_for/WaitingForRow";
import SortableWaitingForRow from "../../waiting_for/SortableWaitingForRow";
import LoadingState from "../../UI/LoadingState";
import ErrorState from "../../UI/ErrorState";
import SearchInput from "../../UI/SearchInput";
import ColumnFilterPopover from "../../UI/ColumnFilterPopover";
import EditWaitingForModal from "../../waiting_for/EditWaitingForModal";
import NewWaitingForModal from "../../waiting_for/NewWaitingForModal";
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

export default function ProjectWaitingFor({ projectId }) {
    const { tasks, isLoading, isError, error, updateTask, deleteTask, createTask } = useTasks("WAITING_FOR");
    const { areas, isLoading: areasLoading } = useAreas();
    const { projects, isLoading: projectsLoading } = useProjects();

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
    const [waitingForFilter, setWaitingForFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [editingTask, setEditingTask] = useState(null);
    const [showNewWaitingForModal, setShowNewWaitingForModal] = useState(false);

    // Get unique waiting for options from this project's tasks
    const waitingForOptions = useMemo(() => {
        const projectTasks = tasks.filter(task => task.projectId === projectId);
        const uniqueWaitingFor = [...new Set(projectTasks.map(t => t.waitingFor).filter(Boolean))];
        return uniqueWaitingFor.map(wf => ({ id: wf, name: wf }));
    }, [tasks, projectId]);

    // Filter waiting for items for this project and apply filters
    const projectWaitingForItems = useMemo(() => {
        let filtered = tasks.filter(task => task.projectId === projectId);

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task => {
                const taskText = task.text?.toLowerCase() || "";
                const waitingFor = task.waitingFor?.toLowerCase() || "";

                return taskText.includes(query) || waitingFor.includes(query);
            });
        }

        // Apply waiting for filter
        if (waitingForFilter !== null) {
            filtered = filtered.filter(task => task.waitingFor === waitingForFilter);
        }

        return filtered;
    }, [tasks, projectId, searchQuery, waitingForFilter]);

    function handleUpdate(taskId, updates) {
        updateTask(taskId, updates);
    }

    function handleNudge(taskId) {
        updateTask(taskId, { lastNudgedAt: new Date().toISOString() });
    }

    function handleReceived(taskId) {
        if (confirm("Mark this item as done? It will be removed from the list.")) {
            deleteTask(taskId);
        }
    }

    function handleEdit(task) {
        setEditingTask(task);
    }

    function handleDelete(taskId) {
        if (confirm("Are you sure you want to delete this item?")) {
            deleteTask(taskId);
        }
    }

    function handleCreateWaitingFor(waitingForData) {
        createTask({ ...waitingForData, projectId });
        setShowNewWaitingForModal(false);
    }

    // Handle drag end - reorder tasks
    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = projectWaitingForItems.findIndex((t) => t.id === active.id);
        const newIndex = projectWaitingForItems.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reorderedTasks = arrayMove(projectWaitingForItems, oldIndex, newIndex);

        const updates = reorderedTasks.map((task, index) => ({
            id: task.id,
            sortOrder: index,
        }));

        bulkUpdateTasksOrder(updates).catch(console.error);

        updates.forEach((update) => {
            updateTask(update.id, { sortOrder: update.sortOrder });
        });
    }

    if (isLoading || areasLoading || projectsLoading) {
        return <LoadingState message="Loading waiting for items..." />;
    }

    if (isError) {
        return <ErrorState message="Failed to load waiting for items" error={error} />;
    }

    return (
        <div>
            {/* Search, Filters, and Add Button */}
            <div className="mb-4 flex items-center gap-3">
                <div className="flex-1">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search waiting for items..."
                    />
                </div>
                <button
                    onClick={() => setShowNewWaitingForModal(true)}
                    className="btn btn-primary"
                >
                    <Plus size={20} />
                    <span>Add Item</span>
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
                                <th className="w-1/3 p-3 pl-6 text-left text-xs font-semibold text-black/60 tracking-wider">
                                    Task
                                </th>
                                <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    <div className="flex items-center gap-2">
                                        Waiting For
                                        <ColumnFilterPopover
                                            options={waitingForOptions}
                                            selectedId={waitingForFilter}
                                            onChange={setWaitingForFilter}
                                            placeholder="All"
                                            title="Filter by Person/Entity"
                                        />
                                    </div>
                                </th>
                                <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Project
                                </th>
                                <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Expected
                                </th>
                                <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <SortableContext
                            items={projectWaitingForItems.map((t) => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <tbody>
                                {projectWaitingForItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12">
                                            <h3 className="text-lg text-black/60">No waiting for items found</h3>
                                            <p className="text-sm text-black/40 mt-2">
                                                {searchQuery || waitingForFilter !== null
                                                    ? "Try adjusting your filters"
                                                    : "Items you're waiting for related to this project will appear here"}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    projectWaitingForItems.map(task => (
                                        <SortableWaitingForRow
                                            key={task.id}
                                            task={task}
                                            areas={areas}
                                            projects={projects}
                                            onUpdate={handleUpdate}
                                            onNudge={handleNudge}
                                            onReceived={handleReceived}
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
            <NewWaitingForModal
                isOpen={showNewWaitingForModal}
                onClose={() => setShowNewWaitingForModal(false)}
                onSubmit={handleCreateWaitingFor}
                defaultProjectId={projectId}
                defaultAreaOfLifeId={currentProject?.areaOfLifeId || null}
            />

            <EditWaitingForModal
                isOpen={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={handleUpdate}
            />
        </div>
    );
}
