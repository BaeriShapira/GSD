import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Star } from "lucide-react";
import { colorClasses400 } from "../../config/areaColors";
import DropdownMenu from "../UI/DropdownMenu";


/**
 * Task card component for daily dashboard
 * Shows task with colored left border (by area of life), urgency stars, project name, and actions
 */
export default function DailyTaskCard({ task, onComplete, onEdit, onDelete, onRemove, showTime = false }) {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = () => {
        setIsCompleting(true);
        try {
            onComplete(task.id);
        } catch (error) {
            console.error("Error completing task:", error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleRemove = () => {
        if (window.confirm("Remove this task from the dashboard? It will return to your Next Actions list without a date.")) {
            onRemove && onRemove(task.id);
        }
    };

    // Get area of life color for the left border
    const areaColor = task.areaOfLife?.color || task.project?.areaOfLife?.color;
    const borderColorClass = areaColor ? colorClasses400[areaColor] : "bg-gray-400";

    // Get time if task is scheduled
    const dueTime = showTime && task.dueDate ? format(parseISO(task.dueDate), "HH:mm") : null;

    // Generate urgency stars (filled and empty)
    const getUrgencyStars = (urgency = 0) => {
        if (!urgency) return null;
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={i < urgency ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-100 rounded-lg flex items-center gap-3 p-3 hover:bg-gray-200 transition-colors group">
            {/* Color Bar on the Left */}
            <div className={`w-1 h-12 rounded-full ${borderColorClass}`} />

            {/* Task Content */}
            <div className="flex-1 min-w-0">
                <h3>
                    {task.text}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    {/* Project Name */}
                    {task.project && (
                        <a
                            href={`/app/projects/${task.project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500  hover:text-gray-800"
                        >
                            {task.project.name}
                        </a>
                    )}
                    {/* Urgency Stars */}
                    {getUrgencyStars(task.urgency)}
                </div>
            </div>

            {/* Scheduled Time (if applicable) */}
            {dueTime && dueTime !== "00:00" && (
                <span className="text-sm text-gray-600 font-medium">
                    {dueTime}
                </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Done Button - Rule 3: Disabled if task has parent (blockedByTaskId) */}


                {/* Blocked indicator for child tasks */}
                {task.blockedByTaskId && (
                    <span className="text-xs text-black/40 italic">
                        Blocked
                    </span>
                )}

                {/* Dropdown Menu */}
                <DropdownMenu
                    onComplete={!task.blockedByTaskId ? handleComplete : null}
                    onEdit={() => onEdit && onEdit(task)}
                    onRemove={handleRemove}
                    onDelete={() => onDelete && onDelete(task.id)}
                    position="right"
                />
            </div>
        </div>
    );
}
