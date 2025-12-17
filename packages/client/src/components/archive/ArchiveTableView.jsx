import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableArchiveRow from "./SortableArchiveRow";
import ColumnFilterPopover from "../UI/ColumnFilterPopover";

export default function ArchiveTableView({
    tasks,
    areas,
    projects,
    contexts,
    searchQuery,
    celebratingTaskId,
    projectFilterId,
    areaFilterId,
    onProjectFilterChange,
    onAreaFilterChange,
    onRestore,
    onDelete,
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
            onDragEnd={() => { }} // No reordering needed for archive
        >
            <div className="my-6 border border-black/10 rounded-xl bg-white shadow-sm max-w-full overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/10 bg-gray-50">
                            <th className="w-1/2 p-3 pl-6 text-left text-xs font-semibold text-black/60 tracking-wider">
                                <span>Task</span>
                            </th>
                            <th className="w-[20%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
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
                            <th className="w-[20%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                <div className="flex items-center gap-1">
                                    <span>Area of Life</span>
                                    <ColumnFilterPopover
                                        options={areas}
                                        selectedId={areaFilterId}
                                        onChange={onAreaFilterChange}
                                        labelKey="name"
                                        valueKey="id"
                                        placeholder="All areas"
                                        title="Filter by area of life"
                                    />
                                </div>
                            </th>
                            <th className="w-[10%] p-3 text-left text-xs font-semibold text-black/60  tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <SortableContext
                            items={tasks.map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center">
                                        <h2>No archived tasks</h2>
                                        <p className="text-black/50 text-sm">
                                            {searchQuery
                                                ? "No tasks match your filters."
                                                : "Completed tasks will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                tasks.map(task => (
                                    <SortableArchiveRow
                                        key={task.id}
                                        task={task}
                                        areas={areas}
                                        projects={projects}
                                        contexts={contexts}
                                        onRestore={onRestore}
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
