import { Plus } from "lucide-react";
import MobileNextActionItem from "../nextActionsMobile/MobileNextActionItem";

/**
 * Mobile Unscheduled Tasks Section
 * Shows unscheduled tasks with urgency indicators
 */
export default function MobileUnscheduledSection({
    unscheduledTasks,
    projects,
    contexts,
    areas,
    onComplete,
    onDelete,
    onEdit,
    onAdd,
}) {
    return (
        <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between px-2">
                <h3 >
                    Unscheduled tasks
                </h3>
                <button
                    onClick={onAdd}
                    className="btn btn-primary"
                    aria-label="Add task"
                >
                    <Plus className="w-3 h-3" />
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
                    {unscheduledTasks.map(({ task }) => (
                        <MobileNextActionItem
                            key={task.id}
                            task={task}
                            projects={projects}
                            contexts={contexts}
                            areas={areas}
                            onComplete={onComplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
