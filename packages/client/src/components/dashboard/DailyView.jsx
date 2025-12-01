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
