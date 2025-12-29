import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableSomedayRow from "./SortableSomedayRow";

export default function SomedayTableView({
    sortedTasks,
    searchQuery,
    onMoveToBucket,
    onEdit,
    onDelete,
    onDragEnd,
    areas,
    onUpdate,
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
            <div className="my-10 border border-black/10 rounded-xl bg-white shadow-sm max-w-full reltive">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-black/10 bg-gray-50">

                            <th className="w-1/2 p-3 pl-6 text-left text-xs font-semibold text-black/60 tracking-wider">
                                Item
                            </th>

                            <th className="w-1/10 p-3 text-left text-xs font-semibold text-black/60 tracking-wider">
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
                                    <td colSpan={2} className="p-6 text-center">
                                        <h2>No someday items</h2>
                                        <p className="text-black/50 text-sm">
                                            {searchQuery
                                                ? "No items match your search."
                                                : "Items marked as 'Someday' will appear here."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                sortedTasks.map((task) => (
                                    <SortableSomedayRow
                                        key={task.id}
                                        task={task}
                                        areas={areas}
                                        onMoveToBucket={onMoveToBucket}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onUpdate={onUpdate}
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
