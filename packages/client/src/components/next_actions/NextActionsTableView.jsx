import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableNextActionsRow from "./SortableNextActionsRow";
import { ArrowUpDown } from "lucide-react";
import ColumnFilterPopover from "../UI/ColumnFilterPopover";
import UrgencyFilterPopover from "../UI/UrgencyFilterPopup";

export default function NextActionsTableView({
    sortedTasks,
    areas,
    projects,
    contexts,
    searchQuery,
    sortBy,
    projectFilterId,
    urgencyFilter,
    contextFilter,
    celebratingTaskId,
    onSort,
    onProjectFilterChange,
    onUrgencyFilterChange,
    onContextFilterChange,
    onUpdate,
    onComplete,
    onEdit,
    onDelete,
    onDragEnd,
}) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
        >
            <div className="my-6 border border-black/10 rounded-xl bg-white shadow-sm max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/10 bg-gray-50">
                            <th className="w-1/4 p-3 pl-6 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                                <button
                                    type="button"
                                    onClick={() => onSort('task')}
                                    className="inline-flex items-center gap-1 hover:text-black/80"
                                >
                                    <span>Task</span>
                                </button>
                            </th>

                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                <div className="flex items-center gap-1">
                                    <span>Project</span>

                                    <ColumnFilterPopover
                                        options={projects}
                                        selectedId={projectFilterId}
                                        onChange={onProjectFilterChange}
                                        labelKey="name"
                                        valueKey="id"
                                        placeholder="All projects"
                                        title="Filter by project"
                                    />
                                </div>
                            </th>

                            <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onSort('urgency')}
                                        className="inline-flex items-center gap-1 hover:text-black/80"
                                    >
                                        <span>Urgency</span>
                                    </button>

                                    <UrgencyFilterPopover
                                        selected={urgencyFilter}
                                        onChange={onUrgencyFilterChange}
                                    />
                                </div>
                            </th>

                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onSort('context')}
                                        className="inline-flex items-center gap-1 hover:text-black/80"
                                    >
                                        <span>Context</span>
                                    </button>

                                    <ColumnFilterPopover
                                        options={contexts}
                                        selectedId={contextFilter}
                                        onChange={onContextFilterChange}
                                        labelKey="name"
                                        valueKey="id"
                                        placeholder="All contexts"
                                        title="Filter by context"
                                    />
                                </div>
                            </th>

                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                <button
                                    type="button"
                                    onClick={() => onSort('estimatedTime')}
                                    className="inline-flex items-center gap-1 hover:text-black/80"
                                >
                                    <span>Est. Time</span>
                                    <ArrowUpDown
                                        className={
                                            "cursor-pointer w-3 h-3 " +
                                            (sortBy === 'estimatedTime'
                                                ? "text-black/80"
                                                : "text-black/40")
                                        }
                                    />
                                </button>
                            </th>

                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                                <button
                                    type="button"
                                    onClick={() => onSort('due')}
                                    className="inline-flex items-center gap-1 hover:text-black/80"
                                >
                                    <span>Due</span>
                                    <ArrowUpDown
                                        className={
                                            "cursor-pointer w-3 h-3 " +
                                            (sortBy === 'due'
                                                ? "text-black/80"
                                                : "text-black/40")
                                        }
                                    />
                                </button>
                            </th>

                            <th className="w-[8%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <SortableContext
                            items={sortedTasks.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {sortedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-6 text-center">
                                        <h2>No next actions</h2>
                                        <p className="text-black/50 text-sm">
                                            {searchQuery
                                                ? "No actions match your search."
                                                : "Your actionable next steps will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                sortedTasks.map(task => (
                                    <SortableNextActionsRow
                                        key={task.id}
                                        task={task}
                                        areas={areas}
                                        projects={projects}
                                        contexts={contexts}
                                        onUpdate={onUpdate}
                                        onComplete={onComplete}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        isCelebrating={celebratingTaskId === task.id}
                                    />
                                ))
                            )}
                        </SortableContext>
                    </tbody>
                </table>
            </div>
        </DndContext>
    );
}
