import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import NextActionsRow from "./NextActionsRow";

export default function SortableNextActionsRow({
    task,
    areas,
    projects,
    contexts,
    onUpdate,
    onComplete,
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

    // Pass ref and drag props to NextActionsRow
    return (
        <NextActionsRow
            dragRef={setNodeRef}
            style={style}
            dragAttributes={attributes}
            dragListeners={listeners}
            task={task}
            areas={areas}
            projects={projects}
            contexts={contexts}
            onUpdate={onUpdate}
            onComplete={onComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            isCelebrating={isCelebrating}
        />
    );
}
