import { useState, useEffect } from "react";
import { X } from "lucide-react";
import WaitingForDetails from "../ProcessBucket/WaitingForDetails";
import { convertToISOString, extractDate } from "../../utils/dateUtils";

export default function EditWaitingForModal({ isOpen, onClose, onSubmit, task }) {
    const [taskText, setTaskText] = useState("");
    const [areaOfLifeId, setAreaOfLifeId] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [waitingFor, setWaitingFor] = useState("");
    const [expectedDate, setExpectedDate] = useState("");

    // Populate form when task changes
    useEffect(() => {
        if (task) {
            setTaskText(task.text || "");
            setAreaOfLifeId(task.areaOfLifeId || null);
            setProjectId(task.projectId || null);
            setWaitingFor(task.waitingFor || "");

            // Handle expected date
            setExpectedDate(extractDate(task.expectedDate) || "");
        }
    }, [task]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!taskText.trim()) {
            alert("Please define what you're waiting for");
            return;
        }

        onSubmit(task.id, {
            text: taskText,
            areaOfLifeId,
            projectId,
            waitingFor,
            expectedDate: expectedDate ? convertToISOString(expectedDate, null) : null,
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
                    <h2>Edit Waiting For</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <WaitingForDetails
                        taskText={taskText}
                        areaOfLifeId={areaOfLifeId}
                        projectId={projectId}
                        waitingFor={waitingFor}
                        expectedDate={expectedDate}
                        onTaskTextChange={setTaskText}
                        onAreaChange={setAreaOfLifeId}
                        onProjectChange={setProjectId}
                        onWaitingForChange={setWaitingFor}
                        onExpectedDateChange={setExpectedDate}
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
