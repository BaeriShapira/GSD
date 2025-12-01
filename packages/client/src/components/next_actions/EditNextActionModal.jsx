import { useState, useEffect } from "react";
import { X } from "lucide-react";
import NextActionDetails from "../ProcessBucket/NextActionDetails";
import { convertToISOString, extractDate, extractTime } from "../../utils/dateUtils";

export default function EditNextActionModal({ isOpen, onClose, onSubmit, task }) {
    const [nextActionText, setNextActionText] = useState("");
    const [areaOfLifeId, setAreaOfLifeId] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [contextId, setContextId] = useState(null);
    const [urgency, setUrgency] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [scheduleType, setScheduleType] = useState("list");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [blockedByTaskId, setBlockedByTaskId] = useState(null);

    // Populate form when task changes
    useEffect(() => {
        if (task) {
            setNextActionText(task.text || "");
            setAreaOfLifeId(task.areaOfLifeId || null);
            setProjectId(task.projectId || null);
            setContextId(task.contextId || null);
            setUrgency(task.urgency || null);
            setEstimatedTime(task.estimatedTime || null);
            setBlockedByTaskId(task.blockedByTaskId || null);

            // Handle due date
            if (task.dueDate) {
                setScheduleType("calendar");
                setScheduledDate(extractDate(task.dueDate) || "");
                setScheduledTime(extractTime(task.dueDate) || "");
            } else {
                setScheduleType("list");
                setScheduledDate("");
                setScheduledTime("");
            }
        }
    }, [task]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!nextActionText.trim()) {
            alert("Please define the specific next step");
            return;
        }

        if (scheduleType === "calendar" && !scheduledDate) {
            alert("Please select a date for the scheduled action");
            return;
        }

        onSubmit(task.id, {
            text: nextActionText,
            areaOfLifeId,
            projectId,
            contextId,
            urgency,
            estimatedTime,
            dueDate: scheduleType === "calendar" && scheduledDate
                ? convertToISOString(scheduledDate, scheduledTime)
                : null,
            blockedByTaskId,
        });

        onClose();
    }

    function handleClose() {
        onClose();
    }

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-black/10 p-6 flex items-center justify-between">
                    <h2>Edit Next Action</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
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
                        blockedByTaskId={blockedByTaskId}
                        onNextActionTextChange={setNextActionText}
                        onAreaChange={setAreaOfLifeId}
                        onProjectChange={setProjectId}
                        onContextChange={setContextId}
                        onUrgencyChange={setUrgency}
                        onEstimatedTimeChange={setEstimatedTime}
                        onScheduleTypeChange={setScheduleType}
                        onScheduledDateChange={setScheduledDate}
                        onScheduledTimeChange={setScheduledTime}
                        onBlockedByTaskChange={setBlockedByTaskId}
                    />

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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
