import { useState, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTimeBlocks } from "../hooks/useTimeBlocks";
import { format, parseISO, addDays, subDays, isSameDay } from "date-fns";
import MobileDashboardHeader from "../components/dashboardMobile/MobileDashboardHeader";
import MobileUnscheduledSection from "../components/dashboardMobile/MobileUnscheduledSection";
import MobileTimelineSection from "../components/dashboardMobile/MobileTimelineSection";
import MobileNotesSection from "../components/dashboardMobile/MobileNotesSection";
import AddDailyTaskModal from "../components/dashboard/AddDailyTaskModal";
import TimeBlockModal from "../components/dashboard/TimeBlockModal";
import EditNextActionModal from "../components/next_actions/EditNextActionModal";

/**
 * Mobile-optimized Dashboard page
 * Shows daily tasks, time blocks, and notes with swipe gestures
 */
export default function DashboardMobile() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showTimeBlockModal, setShowTimeBlockModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editingTimeBlock, setEditingTimeBlock] = useState(null);

    const { tasks: nextActions, isLoading, updateTask, deleteTask, createTask } = useTasks("NEXT_ACTION");
    const { timeBlocks, addTimeBlock, editTimeBlock, removeTimeBlock } = useTimeBlocks(selectedDate);

    // Navigation handlers
    const handlePreviousDay = () => setSelectedDate((prev) => subDays(prev, 1));
    const handleNextDay = () => setSelectedDate((prev) => addDays(prev, 1));

    // Filter and structure tasks for selected date
    const { unscheduledTasks, scheduledTasks } = useMemo(() => {
        if (!nextActions) return { unscheduledTasks: [], scheduledTasks: [] };

        const tasksForDate = nextActions.filter((task) => {
            if (!task.dueDate) return false;
            const taskDate = parseISO(task.dueDate);
            return isSameDay(taskDate, selectedDate);
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
    }, [nextActions, selectedDate]);

    // Merge and sort schedule items (time blocks + scheduled tasks)
    const orderedScheduleItems = useMemo(() => {
        const items = [];

        if (timeBlocks && timeBlocks.length > 0) {
            timeBlocks.forEach((tb) => {
                let startScore = Number.POSITIVE_INFINITY;

                if (tb.startTime) {
                    const [hours, minutes] = tb.startTime.split(":").map(Number);
                    startScore = hours * 60 + minutes;
                }

                items.push({ type: "timeBlock", startScore, timeBlock: tb });
            });
        }

        if (scheduledTasks && scheduledTasks.length > 0) {
            scheduledTasks.forEach(({ task, children }) => {
                const startDate = task.dueDate ? parseISO(task.dueDate) : null;
                const startScore =
                    startDate != null
                        ? startDate.getUTCHours() * 60 + startDate.getUTCMinutes()
                        : Number.POSITIVE_INFINITY;

                items.push({ type: "task", startScore, task, children });
            });
        }

        items.sort((a, b) => a.startScore - b.startScore);
        return items;
    }, [timeBlocks, scheduledTasks]);

    // Task handlers
    const handleEdit = (task) => {
        setEditingTask(task);
        setShowEditModal(true);
    };

    const handleSaveEdit = (taskId, updates) => {
        updateTask(taskId, updates);
        setShowEditModal(false);
        setEditingTask(null);
    };

    const handleCompleteTask = (taskId) => {
        updateTask(taskId, { status: "COMPLETED" });
    };

    const handleAddTask = () => {
        setShowAddTaskModal(true);
    };

    const handleSaveTask = (data) => {
        if (data.isExisting) {
            updateTask(data.taskId, { dueDate: data.dueDate });
        } else {
            createTask(data);
        }
        setShowAddTaskModal(false);
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            {/* Header */}
            <MobileDashboardHeader
                selectedDate={selectedDate}
                onPreviousDay={handlePreviousDay}
                onNextDay={handleNextDay}
            />

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 pb-20 space-y-6">
                {/* Unscheduled Tasks */}
                <MobileUnscheduledSection
                    unscheduledTasks={unscheduledTasks}
                    onComplete={handleCompleteTask}
                    onDelete={deleteTask}
                    onEdit={handleEdit}
                    onAdd={handleAddTask}
                />

                {/* Timeline */}
                <MobileTimelineSection
                    orderedScheduleItems={orderedScheduleItems}
                    onNewTimeBlock={handleNewTimeBlock}
                    onEditTimeBlock={handleEditTimeBlock}
                    onDeleteTimeBlock={removeTimeBlock}
                    onCompleteTask={handleCompleteTask}
                    onEditTask={handleEdit}
                    onDeleteTask={deleteTask}
                />

                {/* Notes */}
                <MobileNotesSection selectedDate={selectedDate} />
            </div>

            {/* Modals */}
            <EditNextActionModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                }}
                onSubmit={handleSaveEdit}
                task={editingTask}
            />

            <AddDailyTaskModal
                isOpen={showAddTaskModal}
                onClose={() => setShowAddTaskModal(false)}
                onSubmit={handleSaveTask}
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
        </div>
    );
}
