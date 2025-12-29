import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FaCirclePause } from "react-icons/fa6";
import { colorClasses400 } from "../../config/areaColors";
import DropdownMenu from "../UI/DropdownMenu";

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

// ------- Child Row (recursive) -------

export default function ChildTaskRow({
    task,
    areas,
    projects,
    contexts,
    onEdit,
    onDelete,
    level = 1,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const paddingLeft = `${1 + level * 2.5}rem`;

    const {
        borderColor,
        project,
        context,
        urgencyStars,
        dueDateFormatted,
        hasBlockingTasks,
    } = getTaskMeta(task, { areas, projects, contexts });

    return (
        <>
            <tr className="border-b border-black/10 bg-gray-100">
                {/* TASK */}
                <td className="p-3 align-top relative" style={{ paddingLeft }}>
                    <div className="flex gap-2 items-start">
                        {borderColor && (
                            <div
                                className={`w-1 h-6 rounded-full ${borderColor} flex-shrink-0 mt-1`}
                            />
                        )}

                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-black/40 text-xs">↳</span>

                                {hasBlockingTasks && (
                                    <button
                                        type="button"
                                        onClick={() => setIsExpanded((prev) => !prev)}
                                        className="flex-shrink-0 text-black/60 hover:text-black/80 transition-colors"
                                        title={
                                            isExpanded
                                                ? "Collapse dependent tasks"
                                                : "Expand dependent tasks"
                                        }
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="w-3 h-3 cursor-pointer" />
                                        ) : (
                                            <ChevronRight className="w-3 h-3 cursor-pointer" />
                                        )}
                                    </button>
                                )}

                                <h4 className="font-medium text-black/70 text-sm whitespace-pre-wrap break-words break-all">
                                    {task.text}
                                </h4>
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/5 rounded text-xs w-fit">
                                <span>
                                    <FaCirclePause />
                                </span>
                                <span>Waiting for parent task</span>
                            </div>
                        </div>
                    </div>
                </td>

                {/* PROJECT */}
                <td className="p-3 align-top">
                    <span className="text-sm text-black/60">
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
                    <span className="text-sm text-black/60">
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
                        <span className="text-sm text-black/60">
                            {task.estimatedTime} min
                        </span>
                    ) : (
                        <span className="text-black/30 text-sm">—</span>
                    )}
                </td>

                {/* DUE DATE (display only) */}
                <td className="p-3 align-top">
                    {dueDateFormatted ? (
                        <span className="text-sm text-black/60">
                            {dueDateFormatted}
                        </span>
                    ) : (
                        <span className="text-black/30 text-sm">—</span>
                    )}
                </td>

                {/* ACTIONS */}
                <td className="p-3 align-top">
                    <div className="flex items-center gap-2 group">
                        <span className="text-xs text-black/40 italic">Blocked</span>
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

            {/* RECURSIVE CHILD TASKS (grandchildren) */}
            {isExpanded &&
                hasBlockingTasks &&
                task.blocking.map((grandchildTask) => (
                    <ChildTaskRow
                        key={grandchildTask.id}
                        task={grandchildTask}
                        areas={areas}
                        projects={projects}
                        contexts={contexts}
                        level={level + 1}
                    />
                ))}
        </>
    );
}
