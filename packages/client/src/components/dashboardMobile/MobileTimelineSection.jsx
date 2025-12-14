import { Plus, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import MobileNextActionItem from "../nextActionsMobile/MobileNextActionItem";
import MobileCard from "../UI/MobileCard";

/**
 * Mobile Timeline Section
 * Shows scheduled tasks and time blocks chronologically
 */
export default function MobileTimelineSection({
    orderedScheduleItems,
    projects,
    contexts,
    areas,
    onNewTimeBlock,
    onEditTimeBlock,
    onDeleteTimeBlock,
    onCompleteTask,
    onEditTask,
    onDeleteTask,
}) {
    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        return format(date, "h:mm a");
    };

    const formatTaskTime = (dueDate) => {
        if (!dueDate) return "";
        const date = parseISO(dueDate);
        return format(date, "h:mm a");
    };

    return (
        <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between px-2">
                <h3 >
                    Scheduled tasks for today
                </h3>
                <button
                    onClick={onNewTimeBlock}
                    className="btn btn-primary"
                    aria-label="Add time block"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>

            {/* Timeline */}
            {orderedScheduleItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No scheduled items</p>
                    <p className="text-xs mt-1">Tap + to add a time block</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orderedScheduleItems.map((item, index) => {
                        if (item.type === "timeBlock") {
                            const tb = item.timeBlock;
                            return (
                                <MobileCard key={`tb-${tb.id}`}>
                                    <div
                                        className="flex items-start gap-3 cursor-pointer"
                                        onClick={() => onEditTimeBlock(tb)}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatTime(tb.startTime)}
                                                </span>
                                                {tb.endTime && (
                                                    <span className="text-xs text-gray-500">
                                                        - {formatTime(tb.endTime)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1">{tb.title}</p>
                                            {tb.description && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {tb.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </MobileCard>
                            );
                        } else {
                            // Scheduled task
                            const { task } = item;
                            return (
                                <div key={`task-${task.id}`} className="flex items-start gap-2">
                                    <span className="text-sm font-semibold text-gray-600 mt-2 min-w-[60px]">
                                        {formatTaskTime(task.dueDate)}
                                    </span>
                                    <div className="flex-1">
                                        <MobileNextActionItem
                                            task={task}
                                            projects={projects}
                                            contexts={contexts}
                                            areas={areas}
                                            onComplete={onCompleteTask}
                                            onEdit={onEditTask}
                                            onDelete={onDeleteTask}
                                        />
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
}
