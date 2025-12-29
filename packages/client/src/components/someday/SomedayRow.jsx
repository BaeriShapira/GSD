import { Undo2, Trash2, MoreVertical } from "lucide-react";
import { useDropdownMenu } from "../../hooks/useDropdownMenu";
import { useInlineEdit } from "../../hooks/useInlineEdit";
import { formatDistanceToNow } from "date-fns";
import { colorClasses400 } from "../../config/areaColors";
import AttachmentList from "../UI/AttachmentList";
import DropdownMenu from "../UI/DropdownMenu";


export default function SomedayRow({
    dragRef,
    style,
    dragAttributes,
    dragListeners,
    task,
    onMoveToBucket,
    onEdit,
    onDelete,
    areas,
    onUpdate,
}) {
    const { isOpen, toggleMenu, menuRef } = useDropdownMenu();

    const {
        isEditing: isEditingTask,
        draft: taskDraft,
        setDraft: setTaskDraft,
        startEdit: startTaskEdit,
        commitEdit: commitTaskEdit,
        handleKeyDown: handleTaskKeyDown,
    } = useInlineEdit(task.text, (newText) =>
        onUpdate?.(task.id, { text: newText })
    );

    const createdAgo = task.createdAt
        ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
        : "";

    const area = areas.find((a) => a.id === task.areaOfLifeId);
    const borderColor = area ? colorClasses400[area.color] || "" : "";

    return (
        <tr
            ref={dragRef}
            style={style}
            className="group border-b border-black/10 hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing"
            {...dragAttributes}
            {...dragListeners}
        >

            {/* Task Text */}
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

            {/* Actions */}
            <td className="p-3 pr-6">
                <div className="flex items-center gap-2 group">
                    {/* Move to Bucket */}
                    <button
                        onClick={() => onMoveToBucket(task.id)}
                        className="btn btn-primary"
                        title="Move back to bucket"
                        type="button"
                    >
                        <Undo2 size={14} />
                        <span>Move to Bucket</span>
                    </button>


                    {/* More Options (Edit) */}
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
