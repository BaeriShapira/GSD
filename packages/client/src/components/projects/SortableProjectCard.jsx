import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import ProjectCard from "../UI/ProjectCard";

export default function SortableProjectCard({ project, nextActions, onClick, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Filter next actions for this project
    const projectNextActions = useMemo(() => {
        if (!nextActions) return [];
        return nextActions.filter(action => action.projectId === project.id);
    }, [nextActions, project.id]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            <ProjectCard
                name={project.name}
                areaOfLife={project.areaOfLife}
                nextActions={projectNextActions}
                onClick={onClick}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
}
