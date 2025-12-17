import { useState, useMemo } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useTasks } from "../../hooks/useTasks";
import { useAreas } from "../../hooks/useAreas";
import { useProjects } from "../../hooks/useProjects";
import { useContexts } from "../../hooks/useContexts";
import { bulkUpdateTasksOrder } from "../../api/tasksApi";
import NextActionsHeader from "./NextActionsHeader";
import NextActionsTableView from "./NextActionsTableView";
import NextActionsGroupedView from "./NextActionsGroupedView";
import NewNextActionModal from "./NewNextActionModal";
import EditNextActionModal from "./EditNextActionModal";
import LoadingState from "../UI/LoadingState";
import ErrorState from "../UI/ErrorState";


export default function NextActionsBoard() {
    const { tasks, isLoading, isError, error, updateTask, deleteTask, createTask } = useTasks("NEXT_ACTION");
    const { areas, isLoading: areasLoading } = useAreas();
    const { projects, isLoading: projectsLoading } = useProjects();
    const { contexts, isLoading: contextsLoading } = useContexts();

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // View mode state
    const [viewMode, setViewMode] = useState("table"); // "table" or "grouped"
    const [groupBy, setGroupBy] = useState("area"); // "area", "project", or "context"

    // Sort states
    const [sortBy, setSortBy] = useState(null); // 'task', 'project', 'urgency', 'context', 'estimatedTime', 'due'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Celebration animation state
    const [celebratingTaskId, setCelebratingTaskId] = useState(null);

    // Modal state
    const [showNewActionModal, setShowNewActionModal] = useState(false);
    const [showEditActionModal, setShowEditActionModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filters
    const [projectFilterId, setProjectFilterId] = useState(null); // מסנן לפי פרויקט
    const [urgencyFilter, setUrgencyFilter] = useState(null);
    const [contextFilter, setContextFilter] = useState(null);

    // Handle sort toggle
    function handleSort(field) {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    }

    // Filter by search query and blocked status
    const filteredTasks = useMemo(() => {
        // מסנן משימות חסומות
        let availableTasks = tasks.filter(task => !task.blockedByTaskId);

        // סינון לפי חיפוש
        if (searchQuery) {
            const query = searchQuery.toLowerCase();

            availableTasks = availableTasks.filter(task => {
                const textMatch =
                    task.text?.toLowerCase().includes(query);

                const projectMatch = (() => {
                    const project = projects.find(p => p.id === task.projectId);
                    return project?.name?.toLowerCase().includes(query);
                })();

                const contextMatch = (() => {
                    const context = contexts.find(c => c.id === task.contextId);
                    return context?.name?.toLowerCase().includes(query);
                })();

                return textMatch || projectMatch || contextMatch;
            });
        }

        // סינון לפי פרויקט
        if (projectFilterId) {
            availableTasks = availableTasks.filter(task =>
                task.projectId && String(task.projectId) === String(projectFilterId)
            );
        }

        // urgency filter
        if (urgencyFilter !== null) {
            availableTasks = availableTasks.filter(
                t => (t.urgency || 0) === urgencyFilter
            );
        }

        if (contextFilter) {
            availableTasks = availableTasks.filter(task =>
                task.contextId && String(task.contextId) === String(contextFilter)
            );
        }

        return availableTasks;
    }, [tasks, searchQuery, projectFilterId, urgencyFilter, contextFilter]);

    // Sort tasks
    const sortedTasks = useMemo(() => {
        let result = [...filteredTasks];

        if (sortBy === 'task') {
            result.sort((a, b) => {
                const aVal = (a.text || '').toLowerCase();
                const bVal = (b.text || '').toLowerCase();
                return sortOrder === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        } else if (sortBy === 'project') {
            result.sort((a, b) => {
                const aArea = areas.find(area => area.id === a.areaOfLifeId);
                const bArea = areas.find(area => area.id === b.areaOfLifeId);
                const aVal = (aArea?.name || '').toLowerCase();
                const bVal = (bArea?.name || '').toLowerCase();
                return sortOrder === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        } else if (sortBy === 'urgency') {
            result.sort((a, b) => {
                const aVal = a.urgency || 0;
                const bVal = b.urgency || 0;
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            });
        } else if (sortBy === 'context') {
            result.sort((a, b) => {
                const aContext = contexts.find(ctx => ctx.id === a.contextId);
                const bContext = contexts.find(ctx => ctx.id === b.contextId);
                const aVal = (aContext?.name || '').toLowerCase();
                const bVal = (bContext?.name || '').toLowerCase();
                return sortOrder === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        } else if (sortBy === 'estimatedTime') {
            result.sort((a, b) => {
                const aVal = a.estimatedTime || 0;
                const bVal = b.estimatedTime || 0;
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            });
        } else if (sortBy === 'due') {
            result.sort((a, b) => {
                const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
            });
        }

        return result;
    }, [filteredTasks, sortBy, sortOrder, areas, contexts]);

    // Group tasks by area, project, or context
    const groupedTasks = useMemo(() => {
        const groups = [];

        if (groupBy === "area") {
            // Create a group for each area
            areas.forEach(area => {
                groups.push({
                    area,
                    tasks: filteredTasks.filter(task => task.areaOfLifeId === area.id)
                });
            });

            // Add General group (no area)
            groups.push({
                area: null,
                tasks: filteredTasks.filter(task => task.areaOfLifeId === null)
            });
        } else if (groupBy === "project") {
            // Create a group for each project
            projects.forEach(project => {
                groups.push({
                    project,
                    tasks: filteredTasks.filter(task => task.projectId === project.id)
                });
            });

            // Add No Project group
            groups.push({
                project: null,
                tasks: filteredTasks.filter(task => task.projectId === null)
            });
        } else if (groupBy === "context") {
            // Create a group for each context
            contexts.forEach(context => {
                groups.push({
                    context,
                    tasks: filteredTasks.filter(task => task.contextId === context.id)
                });
            });

            // Add No Context group
            groups.push({
                context: null,
                tasks: filteredTasks.filter(task => task.contextId === null)
            });
        }

        return groups;
    }, [filteredTasks, areas, projects, contexts, groupBy]);

    // Handle update
    function handleUpdate(taskId, updates) {
        updateTask(taskId, updates);
    }

    // Handle complete - move task to archive with celebration
    function handleComplete(taskId) {
        if (confirm("Mark this action as complete? It will be moved to the Archive.")) {
            setCelebratingTaskId(taskId);
            setTimeout(() => {
                updateTask(taskId, { status: "COMPLETED" });
                setCelebratingTaskId(null);
            }, 0);
        }
    }

    // Handle add action
    function handleAddAction() {
        setShowNewActionModal(true);
    }

    // Handle create new next action
    function handleCreateAction(actionData) {
        createTask(actionData);
        setShowNewActionModal(false);
    }

    // Handle edit action
    function handleEditAction(task) {
        setEditingTask(task);
        setShowEditActionModal(true);
    }

    // Handle save edited action
    function handleSaveEditedAction(taskId, updates) {
        updateTask(taskId, updates);
        setShowEditActionModal(false);
        setEditingTask(null);
    }

    // Handle delete action
    function handleDeleteAction(taskId) {
        if (confirm("Are you sure you want to delete this action?")) {
            deleteTask(taskId);
        }
    }

    // Handle drag end
    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = sortedTasks.findIndex(t => t.id === active.id);
        const newIndex = sortedTasks.findIndex(t => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reorderedTasks = arrayMove(sortedTasks, oldIndex, newIndex);
        const updates = reorderedTasks.map((task, index) => ({
            id: task.id,
            sortOrder: index,
        }));

        bulkUpdateTasksOrder(updates).catch(console.error);

        // Optimistic update
        updates.forEach(update => {
            updateTask(update.id, { sortOrder: update.sortOrder });
        });
    }

    if (isLoading || areasLoading || projectsLoading || contextsLoading) {
        return <LoadingState message="Loading next actions..." />;
    }

    if (isError) {
        return <ErrorState message={error?.message || "Failed to load next actions"} />;
    }

    return (
        <>
            <NextActionsHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                onAddAction={handleAddAction}
            />

            <NewNextActionModal
                isOpen={showNewActionModal}
                onClose={() => setShowNewActionModal(false)}
                onSubmit={handleCreateAction}
            />

            <EditNextActionModal
                isOpen={showEditActionModal}
                onClose={() => {
                    setShowEditActionModal(false);
                    setEditingTask(null);
                }}
                onSubmit={handleSaveEditedAction}
                task={editingTask}
            />

            {viewMode === "grouped" ? (
                <NextActionsGroupedView
                    groupedTasks={groupedTasks}
                    groupBy={groupBy}
                    areas={areas}
                    projects={projects}
                    contexts={contexts}
                    filteredTasks={filteredTasks}
                    onUpdate={handleUpdate}
                    onComplete={handleComplete}
                    onEdit={handleEditAction}
                    onDelete={handleDeleteAction}
                    celebratingTaskId={celebratingTaskId}
                />
            ) : (
                <NextActionsTableView
                    sortedTasks={sortedTasks}
                    areas={areas}
                    projects={projects}
                    contexts={contexts}
                    searchQuery={searchQuery}
                    sortBy={sortBy}
                    projectFilterId={projectFilterId}
                    urgencyFilter={urgencyFilter}
                    contextFilter={contextFilter}
                    celebratingTaskId={celebratingTaskId}
                    onSort={handleSort}
                    onProjectFilterChange={setProjectFilterId}
                    onUrgencyFilterChange={setUrgencyFilter}
                    onContextFilterChange={setContextFilter}
                    onUpdate={handleUpdate}
                    onComplete={handleComplete}
                    onEdit={handleEditAction}
                    onDelete={handleDeleteAction}
                    onDragEnd={handleDragEnd}
                />
            )}
        </>
    );
}
