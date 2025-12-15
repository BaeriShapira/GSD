import { useState, useMemo } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useTasks } from "../../hooks/useTasks";
import { useAreas } from "../../hooks/useAreas";
import { useSearch } from "../../hooks/useSearch";
import { bulkUpdateTasksOrder } from "../../api/tasksApi";
import SomedayTableView from "./SomedayTableView";
import SomedayGroupedView from "./SomedayGroupedView";
import PageHeader from "../UI/PageHeader";
import EditSomedayModal from "./EditSomedayModal";
import NewSomedayModal from "./NewSomedayModal";

export default function SomedayBoard() {
    const { tasks, isLoading, isError, error, updateTask, deleteTask, createTask } = useTasks("SOMEDAY");
    const { areas, isLoading: areasLoading } = useAreas();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("table"); // "table" or "grouped"
    const [groupBy, setGroupBy] = useState("area");
    const [editingTask, setEditingTask] = useState(null);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const filteredTasks = useSearch(tasks, searchQuery);

    const groupedTasks = useMemo(() => {
        const groups = [];

        // Create a group for each area (even if empty)
        areas.forEach(area => {
            groups.push({
                area,
                tasks: filteredTasks.filter(task => task.areaOfLifeId === area.id)
            });
        });

        // Add None group
        groups.push({
            area: null,
            tasks: filteredTasks.filter(task => task.areaOfLifeId === null)
        });

        return groups;
    }, [filteredTasks, areas]);

    // Table view handlers
    function handleMoveToBucketSingle(taskId) {
        updateTask(taskId, { status: "BUCKET" });
    }

    function handleEdit(task) {
        setEditingTask(task);
    }

    function handleDeleteSingle(taskId) {
        deleteTask(taskId);
    }

    function handleTableDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
        const newIndex = filteredTasks.findIndex(t => t.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedTasks = arrayMove(filteredTasks, oldIndex, newIndex);
            const updates = reorderedTasks.map((task, index) => ({
                id: task.id,
                sortOrder: index,
            }));

            bulkUpdateTasksOrder(updates).catch(console.error);
        }
    }

    function handleEditSubmit(taskId, updates) {
        updateTask(taskId, updates);
    }

    function handleCloseEditModal() {
        setEditingTask(null);
    }

    function handleNewItem(taskData) {
        createTask(taskData);
    }

    function handleOpenNewModal() {
        setIsNewModalOpen(true);
    }

    function handleCloseNewModal() {
        setIsNewModalOpen(false);
    }

    if (isLoading || areasLoading) {
        return (
            <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm max-w-5xl">
                <div className="text-sm text-black/50">Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm max-w-5xl">
                <div className="text-sm text-red-500">Error: {error?.message}</div>
            </div>
        );
    }

    // Group by options for ViewModeToggle
    const groupByOptions = [
        { value: "area", label: "Area of Life", icon: "users" }
    ];

    // Render table view
    if (viewMode === "table") {
        return (
            <>
                <PageHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search by text, label, or file..."
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    groupBy={groupBy}
                    onGroupByChange={setGroupBy}
                    groupByOptions={groupByOptions}
                    defaultViewLabel="Table view"
                    actionLabel="Add Item"
                    onAction={handleOpenNewModal}
                    searchClassName="someday-search"
                    actionClassName="someday-add-button"
                />

                <SomedayTableView
                    sortedTasks={filteredTasks}
                    searchQuery={searchQuery}
                    onMoveToBucket={handleMoveToBucketSingle}
                    onEdit={handleEdit}
                    onDelete={handleDeleteSingle}
                    onDragEnd={handleTableDragEnd}
                    areas={areas}
                    onUpdate={updateTask}
                />

                {/* Edit Modal */}
                <EditSomedayModal
                    isOpen={!!editingTask}
                    onClose={handleCloseEditModal}
                    onSubmit={handleEditSubmit}
                    task={editingTask}
                />

                {/* New Modal */}
                <NewSomedayModal
                    isOpen={isNewModalOpen}
                    onClose={handleCloseNewModal}
                    onSubmit={handleNewItem}
                />
            </>
        );
    }

    // Render grouped view
    return (
        <>
            <PageHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search by text, label, or file..."
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                groupByOptions={groupByOptions}
                defaultViewLabel="Table view"
                actionLabel="Add Item"
                onAction={handleOpenNewModal}
                searchClassName="someday-search"
                actionClassName="someday-add-button"
            />

            <SomedayGroupedView
                groupedTasks={groupedTasks}
                areas={areas}
                onUpdate={updateTask}
                onMoveToBucket={handleMoveToBucketSingle}
                onEdit={handleEdit}
                onDelete={handleDeleteSingle}
                filteredTasks={filteredTasks}
            />

            {/* Edit Modal */}
            <EditSomedayModal
                isOpen={!!editingTask}
                onClose={handleCloseEditModal}
                onSubmit={handleEditSubmit}
                task={editingTask}
            />

            {/* New Modal */}
            <NewSomedayModal
                isOpen={isNewModalOpen}
                onClose={handleCloseNewModal}
                onSubmit={handleNewItem}
            />
        </>
    );
}
