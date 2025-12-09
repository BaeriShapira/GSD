import { Plus, Clock, CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import SwipeableTaskCard from "./SwipeableTaskCard";
import MobileCard from "../UI/MobileCard";

/**
 * Mobile Timeline Section
 * Shows scheduled tasks and time blocks chronologically
 */
export default function MobileTimelineSection({
    orderedScheduleItems,
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
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    📅 Today's Schedule
                </h3>
                <button
                    onClick={onNewTimeBlock}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    aria-label="Add time block"
                >
                    <Plus className="w-5 h-5" />
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
                            const { task, children } = item;
                            return (
                                <div key={`task-${task.id}`} className="flex items-start gap-2">
                                    <span className="text-sm font-semibold text-gray-600 mt-2 min-w-[60px]">
                                        {formatTaskTime(task.dueDate)}
                                    </span>
                                    <div className="flex-1">
                                        <SwipeableTaskCard
                                            task={task}
                                            onComplete={onCompleteTask}
                                            onDelete={onDeleteTask}
                                            onEdit={onEditTask}
                                        >
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm sm:text-base text-gray-900">
                                                        {task.text}
                                                    </p>

                                                    {/* Child tasks */}
                                                    {children && children.length > 0 && (
                                                        <div className="mt-2 space-y-1 pl-3 border-l-2 border-gray-200">
                                                            {children.map((child) => (
                                                                <p
                                                                    key={child.id}
                                                                    className="text-xs sm:text-sm text-gray-600"
                                                                >
                                                                    → {child.text}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Estimated Time */}
                                                    {task.estimatedTime && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            ⏱️ {task.estimatedTime} min
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </SwipeableTaskCard>
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
