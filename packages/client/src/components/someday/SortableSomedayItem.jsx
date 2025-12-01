import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import SomedayItem from "./SomedayItem";

export default function SortableSomedayItem({ task, selected, onToggleSelect, onChangeText }) {
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
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-start gap-2 group "
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity pt-2.5"
            >
                <GripVertical size={20} className="text-gray-400" />
            </div>
            <div className="flex-1">
                <SomedayItem
                    item={task}
                    selected={selected}
                    onToggleSelect={onToggleSelect}
                    onChangeText={onChangeText}
                />
            </div>
        </div>
    );
}
