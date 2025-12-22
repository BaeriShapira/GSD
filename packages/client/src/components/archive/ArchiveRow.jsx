import { forwardRef } from "react";
import { GripVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { colorClasses400 } from "../../config/areaColors";
import DropdownMenu from "../UI/DropdownMenu";

const ArchiveRow = forwardRef(({
    style,
    task,
    areas,
    projects,
    contexts,
    onRestore,
    onDelete,
    isCelebrating,
    dragHandleProps,
}, ref) => {
    const project = projects.find(p => p.id === task.projectId);
    const area = areas.find(a => a.id === task.areaOfLifeId);
    const borderColor = area ? colorClasses400[area.color] || "" : "";

    const createdAgo = task.createdAt
        ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
        : "";

    return (
        <tr
            ref={ref}
            style={style}
            className={`
                border-b border-black/10 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-grab active:cursor-grabbing
                ${isCelebrating ? 'bg-green-50 dark:bg-green-900/30' : ''}
            `}
            {...dragHandleProps}
        >
            {/* Task */}
            <td className="p-3 pl-6 align-top">
                <div className="flex gap-2 items-start">
                    {borderColor && (
                        <div
                            className={`w-1 h-6 rounded-full ${borderColor} flex-shrink-0 mt-1`}
                        />
                    )}

                    <div className="flex flex-col gap-1 flex-1">
                        <h4 className="font-medium text-black/90 dark:text-white whitespace-pre-wrap break-words break-all">
                            {task.text}
                        </h4>

                        {createdAgo && (
                            <span className="text-xs text-black/40 dark:text-dark-text-secondary">
                                Created {createdAgo}
                            </span>
                        )}
                    </div>
                </div>
            </td>

            {/* Project */}
            <td className="p-3 align-top">
                <span className="text-sm text-black/70 dark:text-dark-text-secondary">
                    {project ? (
                        project.name
                    ) : (
                        <span className="text-black/30 dark:text-dark-text-secondary/50">—</span>
                    )}
                </span>
            </td>

            {/* Area of Life */}
            <td className="p-3 align-top">
                <span className="text-sm text-black/70 dark:text-dark-text-secondary">
                    {area ? (
                        area.name
                    ) : (
                        <span className="text-black/30 dark:text-dark-text-secondary/50">—</span>
                    )}
                </span>
            </td>

            {/* Actions Menu */}
            <td className="p-3 align-top flex justify-end">
                <DropdownMenu
                    onEdit={() => onRestore(task.id)}
                    onDelete={() => onDelete(task.id)}
                    editLabel="Restore"
                    deleteLabel="Delete"
                    position="right"
                />
            </td>
        </tr>
    );
});

ArchiveRow.displayName = "ArchiveRow";

export default ArchiveRow;
