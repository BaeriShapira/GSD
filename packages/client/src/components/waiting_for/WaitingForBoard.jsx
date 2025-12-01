import { useState, useMemo } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useAreas } from "../../hooks/useAreas";
import { useProjects } from "../../hooks/useProjects";
import { bulkUpdateTasksOrder } from "../../api/tasksApi";

import WaitingForHeader from "./WaitingForHeader";
import WaitingForTableView from "./WaitingForTableView";
import WaitingForGroupedView from "./WaitingForGroupedView";
import NewWaitingForModal from "./NewWaitingForModal";
import EditWaitingForModal from "./EditWaitingForModal";

import LoadingState from "../UI/LoadingState";
import ErrorState from "../UI/ErrorState";

import { arrayMove } from "@dnd-kit/sortable";

export default function WaitingForBoard() {
    const { tasks, isLoading, isError, error, updateTask, deleteTask, createTask } =
        useTasks("WAITING_FOR");
    const { areas, isLoading: areasLoading } = useAreas();
    const { projects, isLoading: projectsLoading } = useProjects();

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // View mode state
    const [viewMode, setViewMode] = useState("table"); // "table" or "grouped"
    const [groupBy, setGroupBy] = useState("area"); // "area" or "project"

    // Sort states
    const [sortBy, setSortBy] = useState(null); // 'waitingFor' | 'project' | 'expected'
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

    // Celebration animation state
    const [celebratingTaskId, setCelebratingTaskId] = useState(null);

    // Modal state
    const [showNewItemModal, setShowNewItemModal] = useState(false);
    const [showEditItemModal, setShowEditItemModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filters
    const [projectFilterId, setProjectFilterId] = useState(null);
    const [waitingForFilter, setWaitingForFilter] = useState(null);

    // Options ל-Waiting For (מכל המשימות)
    const waitingForOptions = useMemo(() => {
        const values = Array.from(
            new Set(
                tasks
                    .map((t) => t.waitingFor)
                    .filter(Boolean) // מוריד null / undefined / ""
            )
        );

        return values.map((v) => ({
            id: v,
            name: v,
        }));
    }, [tasks]);

    // Handle sort toggle
    function handleSort(field) {
        if (sortBy === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    }

    // Filter by search + filters
    const filteredTasks = useMemo(() => {
        let availableTasks = [...tasks];

        // חיפוש כללי בטקסט המשימה או waitingFor
        if (searchQuery) {
            const query = searchQuery.toLowerCase();

            availableTasks = availableTasks.filter(task => {
                const textMatch =
                    task.text?.toLowerCase().includes(query);

                const waitingMatch =
                    task.waitingFor?.toLowerCase().includes(query);

                const projectMatch = (() => {
                    const project = projects.find(p => p.id === task.projectId);
                    return project?.name?.toLowerCase().includes(query);
                })();


                return (
                    textMatch ||
                    waitingMatch ||
                    projectMatch
                );
            });
        }

        // פילטר לפי פרויקט
        if (projectFilterId) {
            availableTasks = availableTasks.filter(
                (task) =>
                    task.projectId &&
                    String(task.projectId) === String(projectFilterId)
            );
        }

        // פילטר לפי waitingFor (string)
        if (waitingForFilter) {
            availableTasks = availableTasks.filter(
                (task) =>
                    task.waitingFor &&
                    task.waitingFor === waitingForFilter
            );
        }

        return availableTasks;
    }, [tasks, searchQuery, projectFilterId, waitingForFilter]);

    // Sort tasks
    const sortedTasks = useMemo(() => {
        let result = [...filteredTasks];

        if (sortBy === "waitingFor") {
            result.sort((a, b) => {
                const aVal = (a.waitingFor || "").toLowerCase();
                const bVal = (b.waitingFor || "").toLowerCase();
                return sortOrder === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        } else if (sortBy === "project") {
            result.sort((a, b) => {
                const aProject = projects.find((p) => p.id === a.projectId);
                const bProject = projects.find((p) => p.id === b.projectId);
                const aVal = (aProject?.name || "").toLowerCase();
                const bVal = (bProject?.name || "").toLowerCase();
                return sortOrder === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });
        } else if (sortBy === "expected") {
            result.sort((a, b) => {
                const aTime = a.expectedDate
                    ? new Date(a.expectedDate).getTime()
                    : 0;
                const bTime = b.expectedDate
                    ? new Date(b.expectedDate).getTime()
                    : 0;
                return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
            });
        }

        return result;
    }, [filteredTasks, sortBy, sortOrder, projects]);

    // Group tasks by area or project
    const groupedTasks = useMemo(() => {
        const groups = [];

        if (groupBy === "area") {
            // קבוצה לכל Area
            areas.forEach((area) => {
                groups.push({
                    area,
                    tasks: filteredTasks.filter(
                        (task) => task.areaOfLifeId === area.id
                    ),
                });
            });

            // קבוצה כללית (ללא Area)
            groups.push({
                area: null,
                tasks: filteredTasks.filter(
                    (task) => task.areaOfLifeId === null
                ),
            });
        } else if (groupBy === "project") {
            // קבוצה לכל Project
            projects.forEach((project) => {
                groups.push({
                    project,
                    tasks: filteredTasks.filter(
                        (task) => task.projectId === project.id
                    ),
                });
            });

            // קבוצה ללא Project
            groups.push({
                project: null,
                tasks: filteredTasks.filter(
                    (task) => task.projectId === null
                ),
            });
        }

        return groups;
    }, [filteredTasks, areas, projects, groupBy]);

    // Handle update of any field
    function handleUpdate(taskId, updates) {
        updateTask(taskId, updates);
    }

    // Handle "Nudge" button
    function handleNudge(taskId) {
        updateTask(taskId, { lastNudgedAt: new Date().toISOString() });
    }

    // Handle "Received" button
    function handleReceived(taskId) {
        if (
            confirm(
                "Mark this item as done? It will be removed from the list."
            )
        ) {
            setCelebratingTaskId(taskId);
            setTimeout(() => {
                deleteTask(taskId);
                setCelebratingTaskId(null);
            }, 0);
        }
    }

    // Handle add new item
    function handleAddItem() {
        setShowNewItemModal(true);
    }

    // Handle create new waiting for item
    function handleCreateItem(itemData) {
        createTask(itemData);
        setShowNewItemModal(false);
    }

    // Handle edit item
    function handleEditItem(task) {
        setEditingTask(task);
        setShowEditItemModal(true);
    }

    // Handle save edited item
    function handleSaveEditedItem(taskId, updates) {
        updateTask(taskId, updates);
        setShowEditItemModal(false);
        setEditingTask(null);
    }

    // Handle delete item
    function handleDeleteItem(taskId) {
        if (confirm("Are you sure you want to delete this item?")) {
            deleteTask(taskId);
        }
    }

    // Handle drag end - reorder tasks
    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = sortedTasks.findIndex((t) => t.id === active.id);
        const newIndex = sortedTasks.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reorderedTasks = arrayMove(sortedTasks, oldIndex, newIndex);

        const updates = reorderedTasks.map((task, index) => ({
            id: task.id,
            sortOrder: index,
        }));

        bulkUpdateTasksOrder(updates).catch(console.error);

        updates.forEach((update) => {
            updateTask(update.id, { sortOrder: update.sortOrder });
        });
    }

    // Loading / Error
    if (isLoading || areasLoading || projectsLoading) {
        return <LoadingState message="Loading waiting for items..." />;
    }

    if (isError) {
        return (
            <ErrorState
                message={error?.message || "Failed to load waiting for items"}
            />
        );
    }

    return (
        <>
            <WaitingForHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                onAddItem={handleAddItem}
            />

            <NewWaitingForModal
                isOpen={showNewItemModal}
                onClose={() => setShowNewItemModal(false)}
                onSubmit={handleCreateItem}
            />

            <EditWaitingForModal
                isOpen={showEditItemModal}
                onClose={() => {
                    setShowEditItemModal(false);
                    setEditingTask(null);
                }}
                onSubmit={handleSaveEditedItem}
                task={editingTask}
            />

            {viewMode === "grouped" ? (
                <WaitingForGroupedView
                    groupedTasks={groupedTasks}
                    groupBy={groupBy}
                    areas={areas}
                    projects={projects}
                    filteredTasks={filteredTasks}
                    onUpdate={handleUpdate}
                    onNudge={handleNudge}
                    onReceived={handleReceived}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    celebratingTaskId={celebratingTaskId}
                />
            ) : (
                <WaitingForTableView
                    sortedTasks={sortedTasks}
                    areas={areas}
                    projects={projects}
                    searchQuery={searchQuery}
                    sortBy={sortBy}
                    projectFilterId={projectFilterId}
                    waitingForFilter={waitingForFilter}
                    waitingForOptions={waitingForOptions}
                    celebratingTaskId={celebratingTaskId}
                    onSort={handleSort}
                    onProjectFilterChange={setProjectFilterId}
                    onWaitingForFilterChange={setWaitingForFilter}
                    onUpdate={handleUpdate}
                    onNudge={handleNudge}
                    onReceived={handleReceived}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onDragEnd={handleDragEnd}
                />
            )}
        </>
    );
}
