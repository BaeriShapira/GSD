import { useContexts } from "../../hooks/useContexts";
import { useTasks } from "../../hooks/useTasks";
import { Star, X } from "lucide-react";

export default function NextActionForm({
    actionText,
    contextId,
    urgency,
    estimatedTime,
    scheduleType,
    scheduledDate,
    scheduledTime,
    blockedByTaskId,
    projectId,
    showBlockedBy = false,
    onActionTextChange,
    onContextChange,
    onUrgencyChange,
    onEstimatedTimeChange,
    onScheduleTypeChange,
    onScheduledDateChange,
    onScheduledTimeChange,
    onBlockedByTaskChange,
    textLabel = "Next Action",
    textPlaceholder = "Define the specific next step...",
    scheduleTypeRadioName = "scheduleType"
}) {
    const { contexts, isLoading: contextsLoading } = useContexts();
    const { tasks: nextActions, isLoading: tasksLoading } = useTasks("NEXT_ACTION");

    return (
        <div className="space-y-4">
            {/* Action Text */}
            <div>
                <label className="block text-xs font-medium text-black/60 mb-1">
                    Next Action *
                </label>
                <input
                    type="text"
                    value={actionText}
                    onChange={(e) => onActionTextChange(e.target.value)}
                    placeholder={textPlaceholder}
                    className="input"
                />
            </div>

            {/* Blocked By Task */}
            {showBlockedBy && (
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Waiting for another task? (optional)
                    </label>
                    <select
                        value={blockedByTaskId || ""}
                        onChange={(e) => onBlockedByTaskChange(e.target.value ? Number(e.target.value) : null)}
                        className="input cursor-pointer"
                        disabled={tasksLoading}
                    >
                        <option value="">No dependency - can start immediately</option>
                        {/* Existing project: show tasks from that project */}
                        {projectId && projectId > 0 && nextActions
                            .filter(task => task.projectId === projectId)
                            .map(task => (
                                <option key={task.id} value={task.id}>
                                    {task.text}
                                </option>
                            ))}
                        {/* Additional Action in new project: wait for First Action */}
                        {projectId === -1 && (
                            <option value={-1}>First Action (will be created)</option>
                        )}
                        {/* First Action in new project: show all existing tasks */}
                        {projectId === -2 && nextActions.map(task => {
                            const displayText = task.project
                                ? `${task.text} (${task.project.name})`
                                : task.text;
                            return (
                                <option key={task.id} value={task.id}>
                                    {displayText}
                                </option>
                            );
                        })}
                    </select>
                    <p className="text-xs text-black/40 mt-1">
                        {projectId && projectId > 0
                            ? "Showing tasks from the selected project only"
                            : projectId === -1
                                ? "This action will wait for the first action to complete"
                                : projectId === -2
                                    ? "Choose any existing task from any project"
                                    : ""}
                    </p>
                </div>
            )}

            {/* Context, Urgency, Estimated Time */}
            <div className="grid gap-4 sm:grid-cols-3">
                {/* Context */}
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Context (optional)
                    </label>
                    <select
                        value={contextId || ""}
                        onChange={(e) => onContextChange(e.target.value ? Number(e.target.value) : null)}
                        className="input cursor-pointer"
                        disabled={contextsLoading}
                    >
                        <option value="">No context</option>
                        {contexts.map(context => (
                            <option key={context.id} value={context.id}>
                                {context.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Estimated Time */}
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Estimated Time (optional, in minutes)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={estimatedTime || ""}
                        onChange={(e) => onEstimatedTimeChange(e.target.value ? Number(e.target.value) : null)}
                        placeholder="e.g., 30"
                        className="input"
                    />
                </div>

                {/* Urgency */}
                <div>
                    <label className="block text-xs font-medium text-black/60 mb-1">
                        Urgency (optional)
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => onUrgencyChange(urgency === star ? null : star)}
                                className="transition-colors cursor-pointer"
                            >
                                <Star
                                    size={24}
                                    className={urgency && urgency >= star ? "fill-yellow-400 text-yellow-400" : "text-black/20"}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schedule Type */}
            <div>
                <label className="block text-xs font-medium text-black/60 mb-2">
                    Schedule Type
                </label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name={scheduleTypeRadioName}
                            value="list"
                            checked={scheduleType === "list"}
                            onChange={(e) => onScheduleTypeChange(e.target.value)}
                            className="cursor-pointer"
                        />
                        <span className="text-sm text-black/80">
                            Add to next actions list (no specific time)
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name={scheduleTypeRadioName}
                            value="calendar"
                            checked={scheduleType === "calendar"}
                            onChange={(e) => onScheduleTypeChange(e.target.value)}
                            className="cursor-pointer"
                        />
                        <span className="text-sm text-black/80">
                            Schedule for specific date/time
                        </span>
                    </label>
                </div>
            </div>

            {/* Calendar Details */}
            {scheduleType === "calendar" && (
                <div className="grid gap-4 sm:grid-cols-2 pl-6 border-l-2 border-black/10">
                    <div>
                        <label className="block text-xs font-medium text-black/60 mb-1">
                            Date *
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={scheduledDate || ""}
                                onChange={(e) => onScheduledDateChange(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="input flex-1"
                                lang="en-US"
                            />
                            {scheduledDate && (
                                <button
                                    type="button"
                                    onClick={() => onScheduledDateChange("")}
                                    className="cursor-pointer p-1.5 text-black hover:bg-red-50 rounded-lg transition-colors"
                                    title="Clear date"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-black/60 mb-1">
                            Time (optional)
                        </label>
                        <div className="flex items-center gap-2">
                            <select
                                value={scheduledTime || ""}
                                onChange={(e) => onScheduledTimeChange(e.target.value)}
                                className="input flex-1 cursor-pointer"
                            >
                                <option value="">No specific time</option>
                                {(() => {
                                    const options = [];
                                    for (let hour = 0; hour < 24; hour++) {
                                        for (let minute = 0; minute < 60; minute += 15) {
                                            const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                                            options.push(
                                                <option key={timeStr} value={timeStr}>
                                                    {timeStr}
                                                </option>
                                            );
                                        }
                                    }
                                    return options;
                                })()}
                            </select>
                            {scheduledTime && (
                                <button
                                    type="button"
                                    onClick={() => onScheduledTimeChange("")}
                                    className="cursor-pointer p-1.5 text-black hover:bg-red-50 rounded-lg transition-colors"
                                    title="Clear time"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
