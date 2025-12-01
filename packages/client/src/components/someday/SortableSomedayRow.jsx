import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SomedayRow from "./SomedayRow";

export default function SortableSomedayRow({
    task,
    onMoveToBucket,
    onEdit,
    onDelete,
    areas,
    onUpdate,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <SomedayRow
            dragRef={setNodeRef}
            style={style}
            dragAttributes={attributes}
            dragListeners={listeners}
            task={task}
            areas={areas}
            onMoveToBucket={onMoveToBucket}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdate={onUpdate}
        />
    );
}
