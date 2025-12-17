import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ArchiveRow from "./ArchiveRow";

export default function SortableArchiveRow({
    task,
    areas,
    projects,
    contexts,
    onRestore,
    onDelete,
    isCelebrating,
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
        <ArchiveRow
            ref={setNodeRef}
            style={style}
            task={task}
            areas={areas}
            projects={projects}
            contexts={contexts}
            onRestore={onRestore}
            onDelete={onDelete}
            isCelebrating={isCelebrating}
            dragHandleProps={{ ...attributes, ...listeners }}
        />
    );
}
