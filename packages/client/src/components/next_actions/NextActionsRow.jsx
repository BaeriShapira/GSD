import { useState, useRef, useEffect } from "react";
import { useInlineEdit } from "../../hooks/useInlineEdit";
import { formatDistanceToNow } from "date-fns";
import { colorClasses400 } from "../../config/areaColors";
import AttachmentList from "../UI/AttachmentList";
import Confetti from "react-confetti";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import ChildTaskRow from "./ChildTaskRow";
import DropdownMenu from "../UI/DropdownMenu";
import { convertToISOString } from "../../utils/dateUtils";

// ------- Helpers -------

const getUrgencyStars = (urgency = 0) =>
    urgency ? "★".repeat(urgency) + "☆".repeat(5 - urgency) : "";

const formatDateForInput = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

function getTaskMeta(task, { areas, projects, contexts }) {
    const area = areas.find((a) => a.id === task.areaOfLifeId);
    const borderColor = area ? colorClasses400[area.color] || "" : "";

    const project = projects?.find((p) => p.id === task.projectId);
    const context = contexts?.find((c) => c.id === task.contextId);

    const urgencyStars = getUrgencyStars(task.urgency);
    const dueDateFormatted = formatDateForInput(task.dueDate);

    const hasBlockingTasks = Array.isArray(task.blocking) && task.blocking.length > 0;

    return {
        area,
        borderColor,
        project,
        context,
        urgencyStars,
        dueDateFormatted,
        hasBlockingTasks,
    };
}

// ------- Main Row -------

export default function NextActionsRow({
    task,
    areas,
    projects,
    contexts,
    onUpdate,
    onComplete,
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
    const [isExpanded, setIsExpanded] = useState(false);

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

    function handleDueDateChange(e) {
        const dateValue = e.target.value;
        onUpdate(task.id, {
            dueDate: dateValue ? convertToISOString(dateValue, null) : null,
        });
    }

    const createdAgo = task.createdAt
        ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
        : "";

    const {
        borderColor,
        project,
        context,
        urgencyStars,
        dueDateFormatted,
        hasBlockingTasks,
    } = getTaskMeta(task, { areas, projects, contexts });

    if (isCelebrating) {
        return (
            <tr ref={mergedRef} className="border-b border-black/10 relative">
                <td colSpan={8} className="p-0 relative" style={{ height: "65px" }}>
                    <Confetti
                        width={rowDimensions.width}
                        height={rowDimensions.height}
                        numberOfPieces={250}
                        recycle={false}
                        initialVelocityX={{ min: -20, max: 20 }}
                        initialVelocityY={{ min: -6, max: -12 }}
                        gravity={0.6}
                        confettiSource={{
                            x: rowDimensions.width / 2 - 150,
                            y: rowDimensions.height,
                            w: 400,
                            h: 10,
                        }}
                    />
                </td>
            </tr>
        );
    }

    return (
        <>
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
                            <div className="flex items-start gap-2">
                                {hasBlockingTasks && (
                                    <button
                                        type="button"
                                        onClick={() => setIsExpanded((prev) => !prev)}
                                        className="flex-shrink-0 mt-1 text-black/60 hover:text-black/80 transition-colors"
                                        title={
                                            isExpanded
                                                ? "Collapse dependent tasks"
                                                : "Expand dependent tasks"
                                        }
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 cursor-pointer" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 cursor-pointer" />
                                        )}
                                    </button>
                                )}

                                {isEditingTask ? (
                                    <textarea
                                        className="w-full px-2 py-1 font-medium text-black/90 rounded
                                                   focus:outline-none focus:ring focus:ring-black/10
                                                   resize-none"
                                        value={taskDraft}
                                        autoFocus
                                        rows={1}
                                        onChange={(e) => {
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
                            </div>

                            {createdAgo && (
                                <span className="text-xs text-black/40">
                                    Created {createdAgo}
                                </span>
                            )}

                            {task.blockedBy && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                                    <span>⏸️</span>
                                    <span>
                                        Waiting for: <strong>{task.blockedBy.text}</strong>
                                    </span>
                                </div>
                            )}

                            {task.attachments && task.attachments.length > 0 && (
                                <AttachmentList
                                    attachments={task.attachments}
                                    className="mt-1"
                                />
                            )}
                        </div>
                    </div>
                </td>

                {/* PROJECT */}
                <td className="p-3 align-top">
                    <span className="text-sm text-black/70">
                        {project ? (
                            project.name
                        ) : (
                            <span className="text-black/30">—</span>
                        )}
                    </span>
                </td>

                {/* URGENCY */}
                <td className="p-3 align-top">
                    {urgencyStars ? (
                        <span
                            className="text-yellow-500 text-lg leading-none"
                            title={`Urgency: ${task.urgency}/5`}
                        >
                            {urgencyStars}
                        </span>
                    ) : (
                        <span className="text-black/30 text-sm">—</span>
                    )}
                </td>

                {/* CONTEXT */}
                <td className="p-3 align-top">
                    <span className="text-sm text-black/70">
                        {context ? (
                            context.name
                        ) : (
                            <span className="text-black/30">—</span>
                        )}
                    </span>
                </td>

                {/* ESTIMATED TIME */}
                <td className="p-3 align-top">
                    {task.estimatedTime ? (
                        <span className="text-sm text-black/70">
                            {task.estimatedTime} min
                        </span>
                    ) : (
                        <span className="text-black/30 text-sm">—</span>
                    )}
                </td>

                {/* DUE DATE */}
                <td className="p-3 align-top">
                    <div className="flex items-center gap-1">
                        <input
                            type="date"
                            value={dueDateFormatted}
                            onChange={handleDueDateChange}
                            className="text-sm border border-black/10 rounded px-2 py-1 bg-white text-black/80 hover:border-black/20 transition-colors flex-1"
                        />
                        {dueDateFormatted && (
                            <button
                                onClick={() => onUpdate(task.id, { dueDate: null })}
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
                            onClick={() => onComplete(task.id)}
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

            {/* CHILD TASKS (dependent tasks) */}
            {isExpanded &&
                hasBlockingTasks &&
                task.blocking.map((childTask) => (
                    <ChildTaskRow
                        key={childTask.id}
                        task={childTask}
                        areas={areas}
                        projects={projects}
                        contexts={contexts}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        level={1}
                    />
                ))}
        </>
    );
}

