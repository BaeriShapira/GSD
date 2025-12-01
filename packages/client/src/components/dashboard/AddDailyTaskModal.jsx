import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import NextActionDetails from "../ProcessBucket/NextActionDetails";
import { convertToISOString } from "../../utils/dateUtils";
import { useTasks } from "../../hooks/useTasks";

export default function AddDailyTaskModal({
    isOpen,
    onClose,
    onSubmit,
    selectedDate // The date selected in the dashboard
}) {
    const [taskChoice, setTaskChoice] = useState("new"); // "existing" or "new"
    const [existingTaskId, setExistingTaskId] = useState(null);

    // Form state for new task
    const [nextActionText, setNextActionText] = useState("");
    const [areaOfLifeId, setAreaOfLifeId] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [contextId, setContextId] = useState(null);
    const [urgency, setUrgency] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [scheduleType, setScheduleType] = useState("list");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");

    // Get existing Next Actions without dueDate
    const { tasks: allNextActions, isLoading: tasksLoading } = useTasks("NEXT_ACTION");
    const unscheduledNextActions = allNextActions?.filter(task => !task.dueDate) || [];

    // Set default scheduled date when modal opens
    useEffect(() => {
        if (isOpen && selectedDate) {
            setScheduledDate(format(selectedDate, "yyyy-MM-dd"));
            setScheduleType("list"); // Default to unscheduled (no time)
        }
    }, [isOpen, selectedDate]);

    function handleSubmit(e) {
        e.preventDefault();

        if (taskChoice === "existing") {
            // Update existing task with the selected date
            if (!existingTaskId) {
                alert("Please select a task");
                return;
            }

            onSubmit({
                taskId: existingTaskId,
                isExisting: true,
                dueDate: convertToISOString(scheduledDate, null) // No time, just date
            });
        } else {
            // Create new task
            if (!nextActionText.trim()) {
                alert("Please define the specific next step");
                return;
            }

            if (scheduleType === "calendar" && !scheduledDate) {
                alert("Please select a date for the scheduled action");
                return;
            }

            onSubmit({
                isExisting: false,
                text: nextActionText,
                status: "NEXT_ACTION",
                areaOfLifeId,
                projectId,
                contextId,
                urgency,
                estimatedTime,
                dueDate: scheduleType === "calendar" && scheduledDate
                    ? convertToISOString(scheduledDate, scheduledTime)
                    : convertToISOString(scheduledDate, null), // Default: today with no time
            });
        }

        // Reset form
        resetForm();
    }

    function resetForm() {
        setTaskChoice("new");
        setExistingTaskId(null);
        setNextActionText("");
        setAreaOfLifeId(null);
        setProjectId(null);
        setContextId(null);
        setUrgency(null);
        setEstimatedTime(null);
        setScheduleType("list");
        setScheduledDate("");
        setScheduledTime("");
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-black/10 p-6 flex items-center justify-between">
                    <h2>Add Task to {format(selectedDate, "MMM d, yyyy")}</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Task Choice: Existing or New */}
                    <div className="mb-6">
                        <label className="block text-xs font-medium text-black/60 mb-2">
                            Task Type
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="taskChoice"
                                    value="existing"
                                    checked={taskChoice === "existing"}
                                    onChange={(e) => setTaskChoice(e.target.value)}
                                    className="cursor-pointer"
                                />
                                <span className="text-sm text-black/80">
                                    Select existing next action
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="taskChoice"
                                    value="new"
                                    checked={taskChoice === "new"}
                                    onChange={(e) => setTaskChoice(e.target.value)}
                                    className="cursor-pointer"
                                />
                                <span className="text-sm text-black/80">
                                    Create new next action
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Existing Task Selection */}
                    {taskChoice === "existing" && (
                        <div className="pl-6 border-l-2 border-black/10">
                            <div>
                                <label className="block text-xs font-medium text-black/60 mb-1">
                                    Select Task *
                                </label>
                                <select
                                    value={existingTaskId || ""}
                                    onChange={(e) => setExistingTaskId(e.target.value ? Number(e.target.value) : null)}
                                    className="input cursor-pointer"
                                    disabled={tasksLoading}
                                >
                                    <option value="">Choose a task...</option>
                                    {unscheduledNextActions.map(task => (
                                        <option key={task.id} value={task.id}>
                                            {task.text}
                                            {task.project ? ` (${task.project.name})` : ""}
                                        </option>
                                    ))}
                                </select>
                                {unscheduledNextActions.length === 0 && !tasksLoading && (
                                    <p className="text-xs text-black/40 mt-1">
                                        No unscheduled next actions available
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* New Task Form */}
                    {taskChoice === "new" && (
                        <div className="pl-6 border-l-2 border-black/10">
                            <NextActionDetails
                                nextActionText={nextActionText}
                                areaOfLifeId={areaOfLifeId}
                                projectId={projectId}
                                contextId={contextId}
                                urgency={urgency}
                                estimatedTime={estimatedTime}
                                scheduleType={scheduleType}
                                scheduledDate={scheduledDate}
                                scheduledTime={scheduledTime}
                                blockedByTaskId={null}
                                onNextActionTextChange={setNextActionText}
                                onAreaChange={setAreaOfLifeId}
                                onProjectChange={setProjectId}
                                onContextChange={setContextId}
                                onUrgencyChange={setUrgency}
                                onEstimatedTimeChange={setEstimatedTime}
                                onScheduleTypeChange={setScheduleType}
                                onScheduledDateChange={setScheduledDate}
                                onScheduledTimeChange={setScheduledTime}
                                onBlockedByTaskChange={() => {}}
                                hideBlockedBy={true}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-black/10">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {taskChoice === "existing" ? "Add to Day" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
