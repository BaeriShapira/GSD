import { useState, useMemo } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useTimeBlocks } from "../../hooks/useTimeBlocks";
import { useAreas } from "../../hooks/useAreas";
import { useProjects } from "../../hooks/useProjects";
import { useContexts } from "../../hooks/useContexts";
import { format, parseISO, startOfWeek, endOfWeek, addDays, subDays, addWeeks, subWeeks, isSameDay } from "date-fns";
import { arrayMove } from "@dnd-kit/sortable";
import { bulkUpdateTasksOrder } from "../../api/tasksApi";
import DashboardHeader from "./DashboardHeader";
import WeeklyHeader from "./WeeklyHeader";
import DailyView from "./DailyView";
import WeeklyView from "./WeeklyView";
import LoadingState from "../UI/LoadingState";
import EditNextActionModal from "../next_actions/EditNextActionModal";
import AddDailyTaskModal from "./AddDailyTaskModal";
import TimeBlockModal from "./TimeBlockModal";
import Modal from "../UI/Modal";

export default function DashboardBoard() {
    const [viewMode, setViewMode] = useState("daily");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showAddUnscheduledModal, setShowAddUnscheduledModal] = useState(false);
    const [showAddScheduledModal, setShowAddScheduledModal] = useState(false);
    const [showTimeBlockModal, setShowTimeBlockModal] = useState(false);
    const [editingTimeBlock, setEditingTimeBlock] = useState(null);

    const { tasks: nextActions, isLoading, updateTask, deleteTask, createTask } = useTasks("NEXT_ACTION");
    const { timeBlocks, addTimeBlock, editTimeBlock, removeTimeBlock } = useTimeBlocks(
        viewMode === "daily" ? selectedDate : null
    );
    const { areas, isLoading: areasLoading } = useAreas();
    const { projects, isLoading: projectsLoading } = useProjects();
    const { contexts, isLoading: contextsLoading } = useContexts();

    const [showSyncModal, setShowSyncModal] = useState(false);

    // Navigation handlers
    const handlePreviousDay = () => setSelectedDate((prev) => subDays(prev, 1));
    const handleNextDay = () => setSelectedDate((prev) => addDays(prev, 1));
    const handlePreviousWeek = () => setSelectedDate((prev) => subWeeks(prev, 1));
    const handleNextWeek = () => setSelectedDate((prev) => addWeeks(prev, 1));

    // Task modal handlers
    const handleEdit = (task) => {
        setEditingTask(task);
        setShowEditModal(true);
    };

    const handleSaveEdit = (taskId, updates) => {
        updateTask(taskId, updates);
        setShowEditModal(false);
        setEditingTask(null);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setEditingTask(null);
    };

    const handleRemove = (taskId) => updateTask(taskId, { dueDate: null });
    const handleAddUnscheduled = () => setShowAddUnscheduledModal(true);

    const handleSaveUnscheduled = (data) => {
        if (data.isExisting) {
            const existingTask = nextActions.find((t) => t.id === data.taskId);
            updateTask(data.taskId, { dueDate: data.dueDate });

            if (existingTask?.blockedByTaskId) {
                const parentTask = nextActions.find((t) => t.id === existingTask.blockedByTaskId);
                if (parentTask && (!parentTask.dueDate || !isSameDay(parseISO(parentTask.dueDate), selectedDate))) {
                    updateTask(parentTask.id, { dueDate: data.dueDate });
                }
            }
        } else {
            createTask(data);
        }
        setShowAddUnscheduledModal(false);
    };

    const handleSaveScheduled = (data) => {
        if (data.isExisting) {
            const existingTask = nextActions.find((t) => t.id === data.taskId);
            updateTask(data.taskId, { dueDate: data.dueDate });

            if (existingTask?.blockedByTaskId) {
                const parentTask = nextActions.find((t) => t.id === existingTask.blockedByTaskId);
                if (parentTask && (!parentTask.dueDate || !isSameDay(parseISO(parentTask.dueDate), selectedDate))) {
                    updateTask(parentTask.id, { dueDate: data.dueDate });
                }
            }
        } else {
            createTask(data);
        }
        setShowAddScheduledModal(false);
    };

    // Time block handlers
    const handleNewTimeBlock = () => {
        setEditingTimeBlock(null);
        setShowTimeBlockModal(true);
    };

    const handleEditTimeBlock = (timeBlock) => {
        setEditingTimeBlock(timeBlock);
        setShowTimeBlockModal(true);
    };

    const handleSaveTimeBlock = async (data) => {
        try {
            if (editingTimeBlock) {
                await editTimeBlock(editingTimeBlock.id, { ...editingTimeBlock, ...data });
            } else {
                await addTimeBlock(data);
            }
            setShowTimeBlockModal(false);
            setEditingTimeBlock(null);
        } catch (error) {
            console.error("Failed to save time block:", error);
            alert("Failed to save time block. Please try again.");
        }
    };

    const handleDeleteTimeBlock = async (id) => {
        try {
            await removeTimeBlock(id);
        } catch (error) {
            console.error("Failed to delete time block:", error);
            alert("Failed to delete time block. Please try again.");
        }
    };

    // Filter and structure tasks
    const { unscheduledTasks, scheduledTasks } = useMemo(() => {
        if (!nextActions) return { unscheduledTasks: [], scheduledTasks: [] };

        const tasksForDate = nextActions.filter((task) => {
            if (!task.dueDate) return false;
            const taskDate = parseISO(task.dueDate);

            if (viewMode === "daily") {
                return isSameDay(taskDate, selectedDate);
            } else {
                const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
                const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
                return taskDate >= weekStart && taskDate <= weekEnd;
            }
        });

        const unscheduled = [];
        const scheduled = [];

        tasksForDate.forEach((task) => {
            const date = parseISO(task.dueDate);
            const utcHours = date.getUTCHours();
            const utcMinutes = date.getUTCMinutes();

            if (utcHours === 0 && utcMinutes === 0) {
                unscheduled.push(task);
            } else {
                scheduled.push(task);
            }
        });

        const createHierarchicalStructure = (tasks) => {
            const taskMap = new Map(tasks.map((t) => [t.id, t]));
            const parentTasks = [];
            const childTasksByParent = new Map();

            tasks.forEach((task) => {
                if (task.blockedByTaskId && taskMap.has(task.blockedByTaskId)) {
                    const parentId = task.blockedByTaskId;
                    if (!childTasksByParent.has(parentId)) {
                        childTasksByParent.set(parentId, []);
                    }
                    childTasksByParent.get(parentId).push(task);
                } else {
                    parentTasks.push(task);
                }
            });

            return parentTasks.map((parent) => ({
                task: parent,
                children: childTasksByParent.get(parent.id) || [],
            }));
        };

        unscheduled.sort((a, b) => (b.urgency || 0) - (a.urgency || 0));
        scheduled.sort((a, b) => {
            const dateA = parseISO(a.dueDate);
            const dateB = parseISO(b.dueDate);
            return dateA.getTime() - dateB.getTime();
        });

        return {
            unscheduledTasks: createHierarchicalStructure(unscheduled),
            scheduledTasks: createHierarchicalStructure(scheduled),
        };
    }, [nextActions, viewMode, selectedDate]);

    const orderedScheduleItems = useMemo(() => {
        const items = [];

        if (timeBlocks && timeBlocks.length > 0) {
            timeBlocks.forEach((tb) => {
                let startScore = Number.POSITIVE_INFINITY;

                if (tb.startTime) {
                    // Parse startTime (HH:MM format)
                    const [hours, minutes] = tb.startTime.split(':').map(Number);
                    startScore = hours * 60 + minutes;
                }

                items.push({ type: "timeBlock", startScore, timeBlock: tb });
            });
        }

        if (scheduledTasks && scheduledTasks.length > 0) {
            scheduledTasks.forEach(({ task, children }) => {
                const startDate = task.dueDate ? parseISO(task.dueDate) : null;
                const startScore = startDate != null
                    ? startDate.getUTCHours() * 60 + startDate.getUTCMinutes()
                    : Number.POSITIVE_INFINITY;

                items.push({ type: "task", startScore, task, children });
            });
        }

        items.sort((a, b) => a.startScore - b.startScore);
        return items;
    }, [timeBlocks, scheduledTasks]);

    const groupedTasks = useMemo(() => {
        if (viewMode === "daily") return null;

        const tasksForWeek = nextActions.filter((task) => {
            if (!task.dueDate) return false;
            const taskDate = parseISO(task.dueDate);
            const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
            const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
            return taskDate >= weekStart && taskDate <= weekEnd;
        });

        const groups = {};
        tasksForWeek.forEach((task) => {
            const dateKey = format(parseISO(task.dueDate), "yyyy-MM-dd");
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(task);
        });

        return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }, [nextActions, viewMode, selectedDate]);

    // Filter unblocked next actions
    const availableNextActions = useMemo(() => {
        return nextActions.filter(task => !task.blockedByTaskId && !task.dueDate);
    }, [nextActions]);

    // Handle drag end for next actions reordering
    function handleNextActionsDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = availableNextActions.findIndex(t => t.id === active.id);
        const newIndex = availableNextActions.findIndex(t => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reorderedTasks = arrayMove(availableNextActions, oldIndex, newIndex);
        const updates = reorderedTasks.map((task, index) => ({
            id: task.id,
            sortOrder: index,
        }));

        bulkUpdateTasksOrder(updates).catch(console.error);

        updates.forEach(update => {
            updateTask(update.id, { sortOrder: update.sortOrder });
        });
    }

    if (isLoading || areasLoading || projectsLoading || contextsLoading) {
        return <LoadingState message="Loading your tasks..." />;
    }

    return (
        <div className="mt-6">
            {viewMode === "daily" ? (
                <DashboardHeader
                    selectedDate={selectedDate}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onPreviousDay={handlePreviousDay}
                    onNextDay={handleNextDay}
                />
            ) : (
                <WeeklyHeader
                    selectedDate={selectedDate}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onPreviousWeek={handlePreviousWeek}
                    onNextWeek={handleNextWeek}
                    onSyncClick={() => setShowSyncModal(true)}
                    weeklyGoal=""
                    isLoadingGoal={false}
                    onSaveGoal={(goal) => {
                        console.log("Save weekly goal:", goal);
                    }}
                />
            )}

            {viewMode === "daily" ? (
                <DailyView
                    selectedDate={selectedDate}
                    unscheduledTasks={unscheduledTasks}
                    orderedScheduleItems={orderedScheduleItems}
                    onNewTimeBlock={handleNewTimeBlock}
                    onEditTimeBlock={handleEditTimeBlock}
                    onDeleteTimeBlock={handleDeleteTimeBlock}
                    onCompleteTask={(id) => updateTask(id, { status: "COMPLETED" })}
                    onEditTask={handleEdit}
                    onAddTask={handleAddUnscheduled}
                    onDeleteTask={deleteTask}
                    onRemoveTask={handleRemove}
                    availableNextActions={availableNextActions}
                    areas={areas}
                    projects={projects}
                    contexts={contexts}
                    onNextActionsUpdate={updateTask}
                    onNextActionsComplete={(taskId) => {
                        if (confirm("Mark this action as complete?")) {
                            deleteTask(taskId);
                        }
                    }}
                    onNextActionsEdit={handleEdit}
                    onNextActionsDelete={deleteTask}
                    onNextActionsDragEnd={handleNextActionsDragEnd}
                />
            ) : (
                <WeeklyView
                    selectedDate={selectedDate}
                    nextActions={nextActions}
                    timeBlocks={timeBlocks}
                    onNewTimeBlock={handleNewTimeBlock}
                    onEditTimeBlock={handleEditTimeBlock}
                    onDeleteTimeBlock={handleDeleteTimeBlock}
                    onCompleteTask={(id) => updateTask(id, { status: "COMPLETED" })}
                    onEditTask={handleEdit}
                    onDeleteTask={deleteTask}
                    onRemoveTask={handleRemove}
                    onAddTask={handleAddUnscheduled}
                    areas={areas}
                    projects={projects}
                    contexts={contexts}
                    onNextActionsUpdate={updateTask}
                    onNextActionsComplete={(taskId) => {
                        if (confirm("Mark this action as complete?")) {
                            deleteTask(taskId);
                        }
                    }}
                    onNextActionsEdit={handleEdit}
                    onNextActionsDelete={deleteTask}
                    onNextActionsDragEnd={handleNextActionsDragEnd}
                />
            )}

            <EditNextActionModal
                isOpen={showEditModal}
                onClose={handleCloseEdit}
                onSubmit={handleSaveEdit}
                task={editingTask}
            />

            <AddDailyTaskModal
                isOpen={showAddUnscheduledModal}
                onClose={() => setShowAddUnscheduledModal(false)}
                onSubmit={handleSaveUnscheduled}
                selectedDate={selectedDate}
            />

            <AddDailyTaskModal
                isOpen={showAddScheduledModal}
                onClose={() => setShowAddScheduledModal(false)}
                onSubmit={handleSaveScheduled}
                selectedDate={selectedDate}
            />

            <TimeBlockModal
                isOpen={showTimeBlockModal}
                onClose={() => {
                    setShowTimeBlockModal(false);
                    setEditingTimeBlock(null);
                }}
                onSubmit={handleSaveTimeBlock}
                selectedDate={selectedDate}
                timeBlock={editingTimeBlock}
            />

            {/* Google Calendar Sync Modal */}
            <Modal
                isOpen={showSyncModal}
                onClose={() => setShowSyncModal(false)}
                title="Google Calendar Sync"
            >
                <p className="text-black/70">
                    Google Calendar sync feature is not yet available.
                </p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowSyncModal(false)}
                        className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 transition-colors cursor-pointer"
                    >
                        OK
                    </button>
                </div>
            </Modal>
        </div>
    );
}
