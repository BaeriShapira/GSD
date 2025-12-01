import { useState, useEffect } from "react";
import { X } from "lucide-react";
import WaitingForDetails from "../ProcessBucket/WaitingForDetails";

export default function NewWaitingForModal({
    isOpen,
    onClose,
    onSubmit,
    defaultProjectId = null,
    defaultAreaOfLifeId = null
}) {
    const [taskText, setTaskText] = useState("");
    const [waitingFor, setWaitingFor] = useState("");
    const [expectedDate, setExpectedDate] = useState("");
    const [areaOfLifeId, setAreaOfLifeId] = useState(defaultAreaOfLifeId);
    const [projectId, setProjectId] = useState(defaultProjectId);

    // Update defaults when modal opens with new values
    useEffect(() => {
        if (isOpen) {
            setProjectId(defaultProjectId);
            setAreaOfLifeId(defaultAreaOfLifeId);
        }
    }, [isOpen, defaultProjectId, defaultAreaOfLifeId]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!taskText.trim() || !waitingFor.trim()) {
            alert("Please fill in task description and who/what you're waiting for");
            return;
        }

        onSubmit({
            text: taskText,
            waitingFor,
            expectedDate: expectedDate || null,
            areaOfLifeId,
            projectId,
            status: "WAITING_FOR"
        });

        // Reset form
        setTaskText("");
        setWaitingFor("");
        setExpectedDate("");
        setAreaOfLifeId(defaultAreaOfLifeId);
        setProjectId(defaultProjectId);
    }

    function handleClose() {
        setTaskText("");
        setWaitingFor("");
        setExpectedDate("");
        setAreaOfLifeId(defaultAreaOfLifeId);
        setProjectId(defaultProjectId);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-black/10 p-6 flex items-center justify-between">
                    <h2>Add Waiting For Item</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Task Description */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-black/60 mb-1">
                            Task Description *
                        </label>
                        <input
                            type="text"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            placeholder="What is this task about?"
                            className="input"
                            autoFocus
                        />
                    </div>

                    {/* Waiting For Details */}
                    <WaitingForDetails
                        waitingFor={waitingFor}
                        expectedDate={expectedDate}
                        areaOfLifeId={areaOfLifeId}
                        projectId={projectId}
                        onWaitingForChange={setWaitingFor}
                        onExpectedDateChange={setExpectedDate}
                        onAreaChange={setAreaOfLifeId}
                        onProjectChange={setProjectId}
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
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
