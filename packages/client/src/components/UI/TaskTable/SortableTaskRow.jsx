import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import TaskTableCell from "./TaskTableCell";
import TaskRowActions from "./TaskRowActions";

/**
 * Sortable table row component with drag handle
 * Renders cells dynamically based on column configuration
 */
export default function SortableTaskRow({
    task,
    columns,
    rowActions,
    isCelebrating = false,
    isDraggable = true
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        disabled: !isDraggable
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Celebration animation class
    const celebrationClass = isCelebrating
        ? "animate-bounce bg-green-100"
        : "hover:bg-gray-50";

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`border-b border-black/10 ${celebrationClass} transition-colors`}
        >
            {/* Drag Handle - Only show if draggable */}
            {isDraggable && (
                <td className="w-8 p-3 pl-4">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                </td>
            )}

            {/* Dynamic Cells */}
            {columns.map((column) => (
                <TaskTableCell
                    key={column.key}
                    task={task}
                    column={column}
                />
            ))}

            {/* Actions Cell */}
            <td className="p-3 pr-6">
                <TaskRowActions
                    task={task}
                    actions={rowActions}
                />
            </td>
        </tr>
    );
}
