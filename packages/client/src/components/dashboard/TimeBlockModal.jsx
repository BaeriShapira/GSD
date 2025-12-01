import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { useProjects } from "../../hooks/useProjects";
import { useAreas } from "../../hooks/useAreas";

/**
 * Modal for creating / editing time blocks
 * - Create: timeBlock = null
 * - Edit:   timeBlock = existing time block object
 */
export default function TimeBlockModal({
    isOpen,
    onClose,
    onSubmit,
    selectedDate,
    timeBlock,          // ← חדש: null = create, object = edit
}) {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [assignmentType, setAssignmentType] = useState("project"); // "project" or "area"
    const [projectId, setProjectId] = useState(null);
    const [areaId, setAreaId] = useState(null);

    const { projects, isLoading: projectsLoading } = useProjects();
    const { areas, isLoading: areasLoading } = useAreas();

    const isEditMode = !!timeBlock;

    // Generate time options in 15-minute intervals
    function generateTimeOptions() {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                options.push(timeStr);
            }
        }
        return options;
    }

    // Get end time options (only times after start time)
    const endTimeOptions = startTime
        ? generateTimeOptions().filter(time => time > startTime)
        : generateTimeOptions();

    // Auto-set end time to 1 hour after start time
    function handleStartTimeChange(newStartTime) {
        setStartTime(newStartTime);

        if (newStartTime && !endTime) {
            // Parse start time and add 1 hour
            const [hours, minutes] = newStartTime.split(':').map(Number);
            const endHours = (hours + 1) % 24;
            const endTimeStr = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            setEndTime(endTimeStr);
        }
    }

    function resetForm() {
        setTitle("");
        setStartTime("");
        setEndTime("");
        setAssignmentType("project");
        setProjectId(null);
        setAreaId(null);
    }

    // כשפותחים מודל – אם יש timeBlock → למלא לטופס; אם לא → טופס ריק
    useEffect(() => {
        if (!isOpen) {
            resetForm();
            return;
        }

        if (timeBlock) {
            // מצב עריכה
            setTitle(timeBlock.title || "");
            setStartTime(timeBlock.startTime || "");
            setEndTime(timeBlock.endTime || "");

            if (timeBlock.projectId) {
                setAssignmentType("project");
                setProjectId(timeBlock.projectId);
                setAreaId(null);
            } else if (timeBlock.areaOfLifeId) {
                setAssignmentType("area");
                setAreaId(timeBlock.areaOfLifeId);
                setProjectId(null);
            } else {
                setAssignmentType("project");
                setProjectId(null);
                setAreaId(null);
            }
        } else {
            // מצב יצירה
            resetForm();
        }
    }, [isOpen, timeBlock]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a title for the time block");
            return;
        }

        if (!startTime || !endTime) {
            alert("Please select start and end times");
            return;
        }

        if (startTime >= endTime) {
            alert("End time must be after start time");
            return;
        }

        if (assignmentType === "project" && !projectId) {
            alert("Please select a project");
            return;
        }

        if (assignmentType === "area" && !areaId) {
            alert("Please select an area of life");
            return;
        }

        onSubmit({
            title,
            startTime,
            endTime,
            projectId: assignmentType === "project" ? projectId : null,
            areaOfLifeId: assignmentType === "area" ? areaId : null,
            date: selectedDate.toISOString(),
        });
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
                    <h2>{isEditMode ? "Edit Time Block" : "Add Time Block"}</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Date Display */}
                        <div className="bg-brand-accent/10 rounded-lg p-4">
                            <p className="text-sm font-medium text-brand-primary">
                                Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                            </p>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-black/80 mb-2">
                                Time Block Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Deep Work, Meeting Block, Creative Time"
                                className="input"
                            />
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black/80 mb-2">
                                    Start Time
                                </label>
                                <select
                                    value={startTime}
                                    onChange={(e) => handleStartTimeChange(e.target.value)}
                                    className="input cursor-pointer"
                                >
                                    <option value="">Select start time</option>
                                    {generateTimeOptions().map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black/80 mb-2">
                                    End Time
                                </label>
                                <select
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="input cursor-pointer"
                                    disabled={!startTime}
                                >
                                    <option value="">Select end time</option>
                                    {endTimeOptions.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Assignment Type Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-black/80 mb-2">
                                Assign To
                            </label>
                            <div className="flex gap-2 bg-black/5 rounded-lg p-1 w-fit">
                                <button
                                    type="button"
                                    onClick={() => setAssignmentType("project")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${assignmentType === "project"
                                        ? "bg-white text-brand-primary shadow-sm"
                                        : "text-black/60 hover:text-black"
                                        }`}
                                >
                                    Project
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAssignmentType("area")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${assignmentType === "area"
                                        ? "bg-white text-brand-primary shadow-sm"
                                        : "text-black/60 hover:text-black"
                                        }`}
                                >
                                    Area of Life
                                </button>
                            </div>
                        </div>

                        {/* Project Selection */}
                        {assignmentType === "project" && (
                            <div>
                                <label className="block text-sm font-medium text-black/80 mb-2">
                                    Select Project
                                </label>
                                {projectsLoading ? (
                                    <p className="text-black/40">Loading projects...</p>
                                ) : (
                                    <select
                                        value={projectId || ""}
                                        onChange={(e) =>
                                            setProjectId(
                                                e.target.value ? parseInt(e.target.value) : null
                                            )
                                        }
                                        className="input cursor-pointer"
                                    >
                                        <option value="">Select a project</option>
                                        {projects?.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {/* Area of Life Selection */}
                        {assignmentType === "area" && (
                            <div>
                                <label className="block text-sm font-medium text-black/80 mb-2">
                                    Select Area of Life
                                </label>
                                {areasLoading ? (
                                    <p className="text-black/40">Loading areas...</p>
                                ) : (
                                    <select
                                        value={areaId || ""}
                                        onChange={(e) =>
                                            setAreaId(
                                                e.target.value ? parseInt(e.target.value) : null
                                            )
                                        }
                                        className="input cursor-pointer"
                                    >
                                        <option value="">Select an area of life</option>
                                        {areas?.map((area) => (
                                            <option key={area.id} value={area.id}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}
                    </div>

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
                            {isEditMode ? "Save Changes" : "Create Time Block"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
