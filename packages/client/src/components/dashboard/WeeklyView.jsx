import { startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay } from "date-fns";
import DayCard from "./DayCard";
import WeeklyNotes from "./WeeklyNotes";
import NextActionsTableView from "../next_actions/NextActionsTableView";
import { useMemo } from "react";
import { PiTargetBold } from "react-icons/pi";

export default function WeeklyView({
    selectedDate,
    nextActions,
    timeBlocks,
    onNewTimeBlock,
    onEditTimeBlock,
    onDeleteTimeBlock,
    onCompleteTask,
    onEditTask,
    onDeleteTask,
    onRemoveTask,
    onAddTask,
    // Next Actions props
    areas = [],
    projects = [],
    contexts = [],
    onNextActionsUpdate,
    onNextActionsComplete,
    onNextActionsEdit,
    onNextActionsDelete,
    onNextActionsDragEnd,
}) {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Process data for each day
    const weekData = useMemo(() => {
        return daysOfWeek.map((day) => {
            // Filter tasks for this day
            const tasksForDay = nextActions.filter((task) => {
                if (!task.dueDate) return false;
                const taskDate = parseISO(task.dueDate);
                return isSameDay(taskDate, day);
            });

            // Separate unscheduled and scheduled tasks
            const unscheduled = [];
            const scheduled = [];

            tasksForDay.forEach((task) => {
                const date = parseISO(task.dueDate);
                const utcHours = date.getUTCHours();
                const utcMinutes = date.getUTCMinutes();

                if (utcHours === 0 && utcMinutes === 0) {
                    unscheduled.push(task);
                } else {
                    scheduled.push(task);
                }
            });

            // Create hierarchical structure
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

            const unscheduledTasks = createHierarchicalStructure(unscheduled);
            const scheduledTasks = createHierarchicalStructure(scheduled);

            // Filter time blocks for this day
            const timeBlocksForDay = timeBlocks.filter((tb) => {
                if (!tb.date) return false;
                const tbDate = parseISO(tb.date);
                return isSameDay(tbDate, day);
            });

            // Create ordered schedule items
            const items = [];

            if (timeBlocksForDay && timeBlocksForDay.length > 0) {
                timeBlocksForDay.forEach((tb) => {
                    let startScore = Number.POSITIVE_INFINITY;

                    if (tb.startTime) {
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

            return {
                date: day,
                unscheduledTasks,
                orderedScheduleItems: items,
            };
        });
    }, [daysOfWeek, nextActions, timeBlocks]);

    // Filter unblocked next actions
    const availableNextActions = useMemo(() => {
        return nextActions.filter(task => !task.blockedByTaskId && !task.dueDate);
    }, [nextActions]);

    return (
        <>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {weekData.map(({ date, unscheduledTasks, orderedScheduleItems }) => (
                    <DayCard
                        key={date.toISOString()}
                        date={date}
                        unscheduledTasks={unscheduledTasks}
                        orderedScheduleItems={orderedScheduleItems}
                        onNewTimeBlock={onNewTimeBlock}
                        onEditTimeBlock={onEditTimeBlock}
                        onDeleteTimeBlock={onDeleteTimeBlock}
                        onCompleteTask={onCompleteTask}
                        onEditTask={onEditTask}
                        onDeleteTask={onDeleteTask}
                        onRemoveTask={onRemoveTask}
                        onAddTask={onAddTask}
                    />
                ))}
            </div>

            {/* Weekly Notes */}
            <div className="mt-6">
                <WeeklyNotes selectedDate={selectedDate} />
            </div>

            {/* Next Actions Table */}
            {availableNextActions.length > 0 && (
                <div className="mt-6 border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <PiTargetBold className="text-xl" />
                        <h2>All next Actions</h2>
                    </div>
                    <NextActionsTableView
                        sortedTasks={availableNextActions}
                        areas={areas}
                        projects={projects}
                        contexts={contexts}
                        searchQuery=""
                        sortBy={null}
                        projectFilterId={null}
                        urgencyFilter={null}
                        contextFilter={null}
                        celebratingTaskId={null}
                        onSort={() => { }}
                        onProjectFilterChange={() => { }}
                        onUrgencyFilterChange={() => { }}
                        onContextFilterChange={() => { }}
                        onUpdate={onNextActionsUpdate}
                        onComplete={onNextActionsComplete}
                        onEdit={onNextActionsEdit}
                        onDelete={onNextActionsDelete}
                        onDragEnd={onNextActionsDragEnd}
                    />
                </div>
            )}
        </>
    );
}
