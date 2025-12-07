import { useState } from "react";
import { Calendar, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import MobileNextActionMenu from "./MobileNextActionMenu";
import MobileCard from "../UI/MobileCard";
import { colorClasses400 } from "../../config/areaColors";
import { getContextIcon } from "../../config/contextIcons";

export default function MobileNextActionItem({
    task,
    projects,
    contexts,
    areas,
    onComplete,
    onEdit,
    onDelete
}) {
    const [showDetails, setShowDetails] = useState(false);

    const project = projects.find(p => p.id === task.projectId);
    const context = contexts.find(c => c.id === task.contextId);
    const area = areas?.find(a => a.id === task.areaOfLifeId);
    const borderColor = area ? colorClasses400[area.color] || "" : "";

    const handleComplete = () => {
        if (confirm("Mark as complete?")) {
            onComplete(task.id);
        }
    };

    const getUrgencyStars = (urgency = 0) => {
        if (!urgency) return null;
        return "★".repeat(urgency) + "☆".repeat(5 - urgency);
    };

    const ContextIcon = context?.icon ? getContextIcon(context.icon) : null;

    return (
        <MobileCard className="p-3 sm:p-4">
            {/* Header with Task Text and Menu */}
            <div className="flex items-start gap-2 mb-2">
                {/* Area of Life Color Bar */}
                {borderColor && (
                    <div className={`w-1 h-6 rounded-full ${borderColor} flex-shrink-0 mt-1`} />
                )}

                <div className="flex-1">
                    <h4>
                        {task.text}
                    </h4>
                </div>
                <MobileNextActionMenu
                    onComplete={handleComplete}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task.id)}
                    onToggleDetails={() => setShowDetails(!showDetails)}
                    showDetails={showDetails}
                />
            </div>

            {/* Quick Info Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-2">


                {/* Project Badge */}
                {project && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {project.name}
                    </span>
                )}

                {/* Context Badge with Icon */}
                {context && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                        {ContextIcon && <ContextIcon className="w-3 h-3" />}
                        {context.name}
                    </span>
                )}
            </div>

            {/* Compact Info Row */}
            <div className="flex items-center gap-3 text-xs text-black/60">
                {/* Due Date */}
                {task.dueDate && (
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(task.dueDate), "MMM d")}</span>
                    </div>
                )}

                {/* Estimated Time */}
                {task.estimatedTime && (
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedTime}m</span>
                    </div>
                )}

                {/* Urgency Stars */}
                {task.urgency && (
                    <span className="text-yellow-500 text-base leading-none" title={`Urgency: ${task.urgency}/5`}>
                        {getUrgencyStars(task.urgency)}
                    </span>
                )}
            </div>

            {/* Expanded Details */}
            {showDetails && (
                <div className="mt-3 pt-3 border-t border-black/10 space-y-2 text-sm">
                    {task.dueDate && (
                        <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-black/40 mt-0.5" />
                            <div>
                                <div className="text-black/60 text-xs">Due Date</div>
                                <div>{format(new Date(task.dueDate), "EEEE, MMMM d, yyyy")}</div>
                            </div>
                        </div>
                    )}

                    {task.estimatedTime && (
                        <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-black/40 mt-0.5" />
                            <div>
                                <div className="text-black/60 text-xs">Estimated Time</div>
                                <div>{task.estimatedTime} minutes</div>
                            </div>
                        </div>
                    )}

                    {task.urgency && (
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-black/40 mt-0.5" />
                            <div>
                                <div className="text-black/60 text-xs">Urgency</div>
                                <div className="text-yellow-500 text-lg">{getUrgencyStars(task.urgency)}</div>
                            </div>
                        </div>
                    )}

                    {project && (
                        <div className="flex items-start gap-2">
                            <div className="w-4 h-4 text-black/40 mt-0.5">📁</div>
                            <div>
                                <div className="text-black/60 text-xs">Project</div>
                                <div>{project.name}</div>
                            </div>
                        </div>
                    )}

                    {context && (
                        <div className="flex items-start gap-2">
                            {ContextIcon ? (
                                <ContextIcon className="w-4 h-4 text-black/40 mt-0.5" />
                            ) : (
                                <div className="w-4 h-4 text-black/40 mt-0.5">📍</div>
                            )}
                            <div>
                                <div className="text-black/60 text-xs">Context</div>
                                <div>{context.name}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </MobileCard>
    );
}
