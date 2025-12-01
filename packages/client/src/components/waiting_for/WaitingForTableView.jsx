import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableWaitingForRow from "./SortableWaitingForRow";
import { ArrowUpDown } from "lucide-react";
import ColumnFilterPopover from "../UI/ColumnFilterPopover";

export default function WaitingForTableView({
    sortedTasks,
    areas,
    projects,
    searchQuery,
    sortBy,
    projectFilterId,
    waitingForFilter,
    waitingForOptions,
    celebratingTaskId,
    onSort,
    onProjectFilterChange,
    onWaitingForFilterChange,
    onUpdate,
    onNudge,
    onReceived,
    onEdit,
    onDelete,
    onDragEnd,
}) {
    // Drag and drop sensors
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
            <div className="my-10 border border-black/10 rounded-xl bg-white shadow-sm max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/10 bg-gray-50">
                            {/* TASK */}
                            <th className="w-1/3 p-3 pl-6 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Task
                            </th>

                            {/* WAITING FOR + sort + filter */}
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onSort("waitingFor")}
                                        className="inline-flex items-center gap-1 hover:text-black/80"
                                    >
                                        <span>Waiting For</span>
                                    </button>

                                    <ColumnFilterPopover
                                        options={waitingForOptions}
                                        selectedId={waitingForFilter}
                                        onChange={onWaitingForFilterChange}
                                        labelKey="name"
                                        valueKey="id"
                                        placeholder="All people"
                                        title="Filter by waiting for"
                                    />
                                </div>
                            </th>

                            {/* PROJECT + sort + filter */}
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onSort("project")}
                                        className="inline-flex items-center gap-1 hover:text-black/80"
                                    >
                                        <span>Project</span>
                                    </button>

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

                            {/* EXPECTED + sort */}
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                <button
                                    type="button"
                                    onClick={() => onSort("expected")}
                                    className="inline-flex items-center gap-1 hover:text-black/80"
                                >
                                    <span>Expected</span>
                                    <ArrowUpDown
                                        className={
                                            "cursor-pointer w-3 h-3 " +
                                            (sortBy === "expected"
                                                ? "text-black/80"
                                                : "text-black/40")
                                        }
                                    />
                                </button>
                            </th>

                            {/* ACTIONS */}
                            <th className="w-1/6 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <SortableContext
                        items={sortedTasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <tbody>
                            {sortedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center">
                                        <h2>No items in waiting for list</h2>
                                        <p className="text-black/50 text-sm">
                                            {searchQuery
                                                ? "No items match your search."
                                                : "Items you're waiting on from others will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                sortedTasks.map((task) => (
                                    <SortableWaitingForRow
                                        key={task.id}
                                        task={task}
                                        areas={areas}
                                        projects={projects}
                                        onUpdate={onUpdate}
                                        onNudge={onNudge}
                                        onReceived={onReceived}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        isCelebrating={celebratingTaskId === task.id}
                                    />
                                ))
                            )}
                        </tbody>
                    </SortableContext>
                </table>
            </div>
        </DndContext>
    );
}
