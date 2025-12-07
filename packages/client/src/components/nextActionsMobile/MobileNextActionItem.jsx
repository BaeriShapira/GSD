import { useState } from "react";
import { Calendar, AlertCircle, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import MobileNextActionMenu from "./MobileNextActionMenu";

export default function MobileNextActionItem({
    task,
    projects,
    contexts,
    onComplete,
    onEdit,
    onDelete
}) {
    const [showDetails, setShowDetails] = useState(false);

    const project = projects.find(p => p.id === task.projectId);
    const context = contexts.find(c => c.id === task.contextId);

    const handleComplete = () => {
        if (confirm("Mark as complete?")) {
            onComplete(task.id);
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 5: return "text-red-600 bg-red-50";
            case 4: return "text-orange-600 bg-orange-50";
            case 3: return "text-yellow-600 bg-yellow-50";
            case 2: return "text-blue-600 bg-blue-50";
            case 1: return "text-gray-600 bg-gray-50";
            default: return "text-gray-400 bg-gray-50";
        }
    };

    const getUrgencyLabel = (urgency) => {
        switch (urgency) {
            case 5: return "Critical";
            case 4: return "High";
            case 3: return "Medium";
            case 2: return "Low";
            case 1: return "Very Low";
            default: return "None";
        }
    };

    return (
        <div className="bg-white border border-black/10 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            {/* Header with Task Text and Menu */}
            <div className="flex items-start gap-2 mb-2">
                <div className="flex-1">
                    <h4 className="leading-tight text-sm sm:text-base font-medium">
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
                {/* Urgency Badge */}
                {task.urgency && (
                    <span className={`px-2 py-0.5 rounded-full font-medium ${getUrgencyColor(task.urgency)}`}>
                        {getUrgencyLabel(task.urgency)}
                    </span>
                )}

                {/* Project Badge */}
                {project && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">
                        {project.name}
                    </span>
                )}

                {/* Context Badge */}
                {context && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
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
                                <div>{getUrgencyLabel(task.urgency)} ({task.urgency}/5)</div>
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
                            <MapPin className="w-4 h-4 text-black/40 mt-0.5" />
                            <div>
                                <div className="text-black/60 text-xs">Context</div>
                                <div>{context.name}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
