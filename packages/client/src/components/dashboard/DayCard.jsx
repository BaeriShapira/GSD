import { useState } from "react";
import { format, isToday } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import UnscheduledTasksSection from "./UnscheduledTasksSection";
import ScheduledItemsSection from "./ScheduledItemsSection";

export default function DayCard({
    date,
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
}) {
    const isCurrentDay = isToday(date);
    const [isExpanded, setIsExpanded] = useState(isCurrentDay);

    const totalTasks = unscheduledTasks.length + orderedScheduleItems.length;

    return (
        <div className="border border-black/10 rounded-xl bg-white shadow-sm">
            {/* Day Header - Clickable */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full p-4 flex items-center justify-between  ${isCurrentDay ? "border-brand-primary" : "border-black/10"
                    } hover:bg-black/5 transition-colors cursor-pointer`}
            >
                <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-black/60" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-black/60" />
                    )}
                    <h3 className={`text-lg font-bold ${isCurrentDay ? "text-brand-primary" : "text-black/80"}`}>
                        {format(date, "EEEE, MMM d")}
                        {isCurrentDay && <span className="ml-2 text-sm font-normal">(Today)</span>}
                    </h3>
                </div>
                <div className="text-sm text-black/60">
                    {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
                </div>
            </button>

            {/* Day Content - Collapsible */}
            {isExpanded && (
                <div className="p-4 space-y-4">
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
            )}
        </div>
    );
}
