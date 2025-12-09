import { Plus } from "lucide-react";
import SwipeableTaskCard from "./SwipeableTaskCard";

/**
 * Mobile Unscheduled Tasks Section
 * Shows unscheduled tasks with urgency indicators
 */
export default function MobileUnscheduledSection({
    unscheduledTasks,
    onComplete,
    onDelete,
    onEdit,
    onAdd,
}) {
    const getUrgencyIndicator = (urgency) => {
        if (urgency === 3) return "⚡⚡⚡";
        if (urgency === 2) return "⚡⚡";
        if (urgency === 1) return "⚡";
        return "";
    };

    const getUrgencyColor = (urgency) => {
        if (urgency === 3) return "text-red-500";
        if (urgency === 2) return "text-orange-500";
        if (urgency === 1) return "text-yellow-500";
        return "text-gray-400";
    };

    return (
        <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    📋 Unscheduled
                </h3>
                <button
                    onClick={onAdd}
                    className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                    aria-label="Add task"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Tasks List */}
            {unscheduledTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No unscheduled tasks</p>
                    <p className="text-xs mt-1">Tap + to add one</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {unscheduledTasks.map(({ task, children }) => (
                        <SwipeableTaskCard
                            key={task.id}
                            task={task}
                            onComplete={onComplete}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        >
                            <div className="flex items-start gap-2">
                                {/* Urgency Indicator */}
                                <span className={`text-sm ${getUrgencyColor(task.urgency)}`}>
                                    {getUrgencyIndicator(task.urgency)}
                                </span>

                                {/* Task Content */}
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
                    ))}
                </div>
            )}
        </div>
    );
}
