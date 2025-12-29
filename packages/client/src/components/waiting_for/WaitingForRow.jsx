import { useState, useRef, useEffect } from "react";
import { useInlineEdit } from "../../hooks/useInlineEdit";
import { formatDistanceToNow } from "date-fns";
import { colorClasses400 } from "../../config/areaColors";
import AttachmentList from "../UI/AttachmentList";
import Confetti from "react-confetti";
import DropdownMenu from "../UI/DropdownMenu";
import { X } from "lucide-react";


export default function WaitingForRow({
    task,
    areas,
    projects,
    onUpdate,
    onNudge,
    onReceived,
    onEdit,
    onDelete,
    isCelebrating,
    dragRef,
    dragAttributes,
    dragListeners,
    style: dragStyle,
}) {
    const rowRef = useRef(null);

    // Merge refs: use dragRef for drag-drop, rowRef for celebration dimensions
    const mergedRef = (element) => {
        rowRef.current = element;
        if (dragRef) {
            dragRef(element);
        }
    };

    const [rowDimensions, setRowDimensions] = useState({ width: 0, height: 100 });
    const [isEditingWaitingFor, setIsEditingWaitingFor] = useState(false);
    const [waitingForDraft, setWaitingForDraft] = useState(task.waitingFor || "");

    useEffect(() => {
        if (rowRef.current && isCelebrating) {
            setRowDimensions({
                width: rowRef.current.offsetWidth,
                height: rowRef.current.offsetHeight || 100,
            });
        }
    }, [isCelebrating]);

    const {
        isEditing: isEditingTask,
        draft: taskDraft,
        setDraft: setTaskDraft,
        startEdit: startTaskEdit,
        commitEdit: commitTaskEdit,
        handleKeyDown: handleTaskKeyDown,
    } = useInlineEdit(task.text, (newText) =>
        onUpdate(task.id, { text: newText })
    );

    function handleWaitingForBlur() {
        setIsEditingWaitingFor(false);
        if (waitingForDraft !== task.waitingFor) {
            onUpdate(task.id, { waitingFor: waitingForDraft });
        }
    }

    function handleWaitingForKeyDown(e) {
        if (e.key === "Enter") {
            e.target.blur();
        } else if (e.key === "Escape") {
            setWaitingForDraft(task.waitingFor || "");
            setIsEditingWaitingFor(false);
        }
    }

    function handleExpectedDateChange(e) {
        const dateValue = e.target.value;
        onUpdate(task.id, {
            expectedDate: dateValue ? new Date(dateValue).toISOString() : null,
        });
    }

    const createdAgo = task.createdAt
        ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
        : "";

    const expectedDateFormatted = task.expectedDate
        ? new Date(task.expectedDate).toISOString().split("T")[0]
        : "";

    const area = areas.find((a) => a.id === task.areaOfLifeId);
    const borderColor = area ? colorClasses400[area.color] || "" : "";
    const project = projects?.find((p) => p.id === task.projectId);

    if (isCelebrating) {
        return (
            <tr ref={mergedRef} className="border-b border-black/10 relative" style={{ height: '65px' }}>
                <td colSpan={5} className="p-0 relative" style={{ height: '65px' }}>
                    <Confetti
                        width={rowDimensions.width}
                        height={rowDimensions.height}
                        numberOfPieces={250}
                        recycle={false}
                        // קצת יותר תזוזה לצדדים
                        initialVelocityX={{ min: -20, max: 20 }}
                        // יורה למעלה (ערכים שליליים = למעלה)
                        initialVelocityY={{ min: -6, max: -12 }}
                        gravity={0.6}
                        confettiSource={{
                            x: rowDimensions.width / 2 - 150, // אמצע השורה
                            y: rowDimensions.height,          // מלמטה של השורה
                            w: 400,                           // רוחב אזור "הפיצוץ"
                            h: 10,
                        }}
                    />
                </td>
            </tr>
        );
    }

    return (
        <tr
            ref={mergedRef}
            style={dragStyle}
            className="border-b border-black/10 hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing"
            {...dragAttributes}
            {...dragListeners}
        >
            {/* TASK */}
            <td className="p-3 pl-6 align-top relative">
                <div className="flex gap-2 items-start">
                    {borderColor && (
                        <div
                            className={`w-1 h-6 rounded-full ${borderColor} flex-shrink-0 mt-1`}
                        />
                    )}

                    <div className="flex flex-col gap-1 flex-1">
                        {isEditingTask ? (
                            <textarea
                                className="w-full px-2 py-1 font-medium text-black/90 rounded
                                               focus:outline-none focus:ring focus:ring-black/10
                                               resize-none"
                                value={taskDraft}
                                autoFocus
                                rows={1}
                                onChange={e => {
                                    setTaskDraft(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onBlur={commitTaskEdit}
                                onKeyDown={handleTaskKeyDown}
                            />
                        ) : (
                            <h4
                                className="font-medium text-black/90 whitespace-pre-wrap break-words break-all"
                                onDoubleClick={startTaskEdit}
                            >
                                {task.text}
                            </h4>
                        )}

                        <span className="text-xs text-black/40">
                            Created {createdAgo}
                        </span>

                        {task.attachments && task.attachments.length > 0 && (
                            <AttachmentList
                                attachments={task.attachments}
                                className="mt-1"
                            />
                        )}
                    </div>
                </div>
            </td>

            {/* WAITING FOR */}
            <td className="p-3 align-top">
                {isEditingWaitingFor ? (
                    <input
                        className="w-full px-2 py-1 text-black/90 rounded
                                   focus:outline-none focus:ring focus:ring-black/10"
                        value={waitingForDraft}
                        onChange={(e) => setWaitingForDraft(e.target.value)}
                        onBlur={handleWaitingForBlur}
                        onKeyDown={handleWaitingForKeyDown}
                        autoFocus
                    />
                ) : (
                    <button
                        type="button"
                        className="text-left w-full text-sm text-black/80 whitespace-pre-wrap break-words"
                        onDoubleClick={() => setIsEditingWaitingFor(true)}
                    >
                        {task.waitingFor || (
                            <span className="text-black/30">Click to add</span>
                        )}
                    </button>
                )}
            </td>

            {/* PROJECT */}
            <td className="p-3 align-top">
                <span className="text-sm text-black/70">
                    {project ? project.name : <span className="text-black/30">—</span>}
                </span>
            </td>

            {/* EXPECTED */}
            <td className="p-3 align-top">
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={expectedDateFormatted}
                        onChange={handleExpectedDateChange}
                        className="text-sm border border-black/10 rounded px-2 py-1 bg-white text-black/80 hover:border-black/20 transition-colors flex-1"
                    />
                    {expectedDateFormatted && (
                        <button
                            type="button"
                            onClick={() => onUpdate(task.id, { expectedDate: null })}
                            className="cursor-pointer p-1.5 text-black hover:bg-red-50 rounded-lg transition-colors"
                            title="Clear date"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </td>

            {/* ACTIONS */}
            <td className="p-3 align-top">
                <div className="flex items-center gap-2 group">
                    <button
                        onClick={() =>
                            alert(
                                "The Nudge feature is coming soon! We're currently working on it."
                            )
                        }
                        className="btn btn-secondary"
                    >
                        Nudge
                    </button>
                    <button
                        onClick={() => onReceived(task.id)}
                        className="btn btn-primary"
                    >
                        Done
                    </button>
                    <DropdownMenu
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task.id)}
                        editLabel="Edit task"
                        deleteLabel="Delete task"
                        position="right"
                    />
                </div>
            </td>
        </tr>
    );
}
