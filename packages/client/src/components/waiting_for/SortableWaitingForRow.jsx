import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import WaitingForRow from "./WaitingForRow";

export default function SortableWaitingForRow({
    task,
    areas,
    projects,
    onUpdate,
    onNudge,
    onReceived,
    onEdit,
    onDelete,
    isCelebrating
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
        <WaitingForRow
            dragRef={setNodeRef}
            style={style}
            dragAttributes={attributes}
            dragListeners={listeners}
            task={task}
            areas={areas}
            projects={projects}
            onUpdate={onUpdate}
            onNudge={onNudge}
            onReceived={onReceived}
            onEdit={onEdit}
            onDelete={onDelete}
            isCelebrating={isCelebrating}
        />
    );
}
