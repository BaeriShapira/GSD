import { colorClasses500 } from "../../config/areaColors";
import SortableArchiveRow from "./SortableArchiveRow";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function ArchiveGroupedView({
    groupedTasks,
    groupBy,
    areas,
    projects,
    contexts,
    filteredTasks,
    onRestore,
    onDelete,
    celebratingTaskId
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
        <div className="columns-1 md:columns-1 gap-6 space-y-6 md:space-y-0">
            {groupedTasks.map(group => {
                // Skip empty groups
                if (group.tasks.length === 0) {
                    return null;
                }

                let groupId, groupName, colors;

                if (groupBy === "area") {
                    groupId = group.area?.id || 'none';
                    groupName = group.area?.name || 'General';
                    colors = group.area?.color || "white";
                }

                return (
                    <div
                        key={groupId}
                        className="border border-black/10 bg-white rounded-xl shadow-sm break-inside-avoid mb-6"
                    >
                        {/* Group Header */}
                        <div className="flex p-4">
                            <div className={`w-1 h-6 rounded-full m-1 shrink-0 ${colorClasses500[colors] || "bg-gray-400"}`} />
                            <h3 className="text-black/40 pl-2">{groupName}</h3>
                        </div>

                        {/* Tasks in this Group */}
                        <div className="px-4 pb-6">
                            {group.tasks.length > 0 ? (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={() => {}} // No reordering for archive
                                >
                                    <div className="space-y-2">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-black/10 bg-gray-50">
                                                    <th className="p-3 pl-6 text-left text-xs font-semibold text-black/60 tracking-wider">
                                                        Task
                                                    </th>
                                                    <th className="p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                                        Project
                                                    </th>
                                                    <th className="p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <SortableContext
                                                items={group.tasks.map((t) => t.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <tbody>
                                                    {group.tasks.map(task => (
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
                                                    ))}
                                                </tbody>
                                            </SortableContext>
                                        </table>
                                    </div>
                                </DndContext>
                            ) : (
                                <div className="text-center py-8 text-sm text-gray-400">
                                    No items
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Empty State - only show if NO areas exist */}
            {areas.length === 0 && filteredTasks.length === 0 && (
                <div className="text-center py-16">
                    <h2>No archived tasks</h2>
                    <p className="text-black/50 text-sm">
                        Completed tasks will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}
