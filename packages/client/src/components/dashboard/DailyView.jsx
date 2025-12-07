import { useState, useMemo } from "react";
import UnscheduledTasksSection from "./UnscheduledTasksSection";
import ScheduledItemsSection from "./ScheduledItemsSection";
import NextActionsTableView from "../next_actions/NextActionsTableView";
import DailyNotes from "./DailyNotes";
import { PiTargetBold } from "react-icons/pi";


export default function DailyView({
    selectedDate,
    unscheduledTasks,
    orderedScheduleItems,
    onNewTimeBlock,
    onEditTimeBlock,
    onDeleteTimeBlock,
    onCompleteTask,
    onEditTask,
    onDeleteTask,
    onRemoveTask,
    onAddTask,
    // Next Actions props
    availableNextActions = [],
    areas = [],
    projects = [],
    contexts = [],
    onNextActionsUpdate,
    onNextActionsComplete,
    onNextActionsEdit,
    onNextActionsDelete,
    onNextActionsDragEnd
}) {
    // State for filtering and sorting
    const [sortBy, setSortBy] = useState(null);
    const [projectFilterId, setProjectFilterId] = useState(null);
    const [urgencyFilter, setUrgencyFilter] = useState(null);
    const [contextFilter, setContextFilter] = useState(null);

    // Filter and sort next actions
    const filteredAndSortedActions = useMemo(() => {
        let filtered = [...availableNextActions];

        // Apply filters
        if (projectFilterId) {
            filtered = filtered.filter(task => task.projectId === projectFilterId);
        }
        if (urgencyFilter) {
            filtered = filtered.filter(task => task.urgency === urgencyFilter);
        }
        if (contextFilter) {
            filtered = filtered.filter(task => task.contextId === contextFilter);
        }

        // Apply sorting
        if (sortBy) {
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case 'urgency':
                        return (b.urgency || 0) - (a.urgency || 0);
                    case 'estimatedTime':
                        return (a.estimatedTime || 0) - (b.estimatedTime || 0);
                    case 'due':
                        if (!a.dueDate) return 1;
                        if (!b.dueDate) return -1;
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    case 'task':
                        return a.text.localeCompare(b.text);
                    case 'context':
                        const aContext = contexts.find(c => c.id === a.contextId)?.name || '';
                        const bContext = contexts.find(c => c.id === b.contextId)?.name || '';
                        return aContext.localeCompare(bContext);
                    default:
                        return 0;
                }
            });
        }

        return filtered;
    }, [availableNextActions, projectFilterId, urgencyFilter, contextFilter, sortBy, contexts]);

    const handleSort = (column) => {
        setSortBy(sortBy === column ? null : column);
    };

    return (
        <>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UnscheduledTasksSection
                    unscheduledTasks={unscheduledTasks}
                    onComplete={onCompleteTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onRemove={onRemoveTask}
                    onAddTask={onAddTask}
                />

                <ScheduledItemsSection
                    orderedScheduleItems={orderedScheduleItems}
                    onNewTimeBlock={onNewTimeBlock}
                    onEditTimeBlock={onEditTimeBlock}
                    onDeleteTimeBlock={onDeleteTimeBlock}
                    onCompleteTask={onCompleteTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onRemoveTask={onRemoveTask}
                />
            </div>

            {/* Daily Notes */}
            <div className="mt-6">
                <DailyNotes selectedDate={selectedDate} />
            </div>

            {/* Next Actions Table */}
            {availableNextActions.length > 0 && (
                <div className="mt-6  border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <PiTargetBold className="text-xl" />
                        <h2>All next Actions</h2>
                    </div>
                    <NextActionsTableView
                        sortedTasks={filteredAndSortedActions}
                        areas={areas}
                        projects={projects}
                        contexts={contexts}
                        searchQuery=""
                        sortBy={sortBy}
                        projectFilterId={projectFilterId}
                        urgencyFilter={urgencyFilter}
                        contextFilter={contextFilter}
                        celebratingTaskId={null}
                        onSort={handleSort}
                        onProjectFilterChange={setProjectFilterId}
                        onUrgencyFilterChange={setUrgencyFilter}
                        onContextFilterChange={setContextFilter}
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
