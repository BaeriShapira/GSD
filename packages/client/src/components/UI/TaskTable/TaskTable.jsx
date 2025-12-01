import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskTableHeader from "./TaskTableHeader";
import SortableTaskRow from "./SortableTaskRow";
import EmptyState from "../EmptyState";

/**
 * Generic reusable table component for tasks
 * Supports:
 * - Dynamic columns configuration
 * - Sorting
 * - Filtering
 * - Drag & drop reordering
 * - Custom row actions
 *
 * @param {Array} tasks - Array of task objects
 * @param {Array} columns - Column configuration array
 * @param {Object} sortConfig - { sortBy, sortOrder }
 * @param {Function} onSort - Callback for sorting
 * @param {Object} filters - Filter values by column key
 * @param {Function} onFilterChange - Callback for filter changes
 * @param {Object} rowActions - Actions for each row (onEdit, onDelete, etc.)
 * @param {Function} onDragEnd - Callback for drag end
 * @param {boolean} enableDragDrop - Enable drag and drop (default: true)
 * @param {string} celebratingTaskId - ID of task being celebrated
 * @param {string} emptyMessage - Message to show when no tasks
 */
export default function TaskTable({
    tasks = [],
    columns = [],
    sortConfig = {},
    onSort,
    filters = {},
    onFilterChange,
    rowActions = {},
    onDragEnd,
    enableDragDrop = true,
    celebratingTaskId = null,
    emptyMessage = "No tasks found"
}) {
    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const taskIds = tasks.map(task => task.id);

    const TableContent = (
        <div className="my-10 border border-black/10 rounded-xl bg-white shadow-sm max-w-full overflow-x-auto">
            <table className="w-full table-fixed min-w-[800px]">
                <TaskTableHeader
                    columns={columns}
                    sortConfig={sortConfig}
                    onSort={onSort}
                    filters={filters}
                    onFilterChange={onFilterChange}
                />

                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="p-8">
                                <EmptyState message={emptyMessage} />
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <SortableTaskRow
                                key={task.id}
                                task={task}
                                columns={columns}
                                rowActions={rowActions}
                                isCelebrating={celebratingTaskId === task.id}
                                isDraggable={enableDragDrop}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    if (enableDragDrop && tasks.length > 0) {
        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {TableContent}
                </SortableContext>
            </DndContext>
        );
    }

    return TableContent;
}
