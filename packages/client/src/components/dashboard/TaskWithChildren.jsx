import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import DailyTaskCard from "./DailyTaskCard";

/**
 * Component to display a parent task with its blocked/dependent child tasks
 * Rule 4: Children are only shown when user clicks expand button
 */
export default function TaskWithChildren({
    parentTask,
    childTasks = [],
    onComplete,
    onEdit,
    onDelete,
    onRemove,
    showTime = false
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = childTasks.length > 0;

    return (
        <div className="space-y-2">
            {/* Parent Task with Expand/Collapse Button */}
            <div className="flex items-start gap-2">
                {/* Expand/Collapse Button - Rule 4: Only show if task has children */}
                {hasChildren && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(prev => !prev)}
                        className="flex-shrink-0 mt-3 text-black/60 hover:text-black/80 transition-colors"
                        title={isExpanded ? "Collapse dependent tasks" : "Expand dependent tasks"}
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 cursor-pointer" />
                        ) : (
                            <ChevronRight className="w-5 h-5 cursor-pointer" />
                        )}
                    </button>
                )}

                {/* Parent Task */}
                <div className="flex-1">
                    <DailyTaskCard
                        task={parentTask}
                        onComplete={onComplete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onRemove={onRemove}
                        showTime={showTime}
                    />
                </div>
            </div>

            {/* Child Tasks - Rule 4: Only visible when expanded */}
            {isExpanded && hasChildren && (
                <div className="pl-12 space-y-2 border-l-2 border-black/10 ml-2">
                    {childTasks.map(childTask => (
                        <div key={childTask.id} className="relative">
                            {/* Connecting line indicator */}
                            <div className="absolute left-0 top-6 w-4 h-px bg-black/10" style={{ marginLeft: '-1.5rem' }}></div>

                            {/* Child task with subtle styling */}
                            <div className="bg-black/5 rounded-lg p-2">
                                <DailyTaskCard
                                    task={childTask}
                                    onComplete={onComplete}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onRemove={onRemove}
                                    showTime={showTime}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
