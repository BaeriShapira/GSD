import { useDroppable } from "@dnd-kit/core";
import { colorClasses500 } from "../../config/areaColors";

export default function SortableAreaCard({ id, colors, isNone, children, name }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`border border-black/10 bg-white rounded-xl shadow-sm relative group transition-all break-inside-avoid mb-6 ${isOver ? "ring-2 ring-blue-400 bg-blue-50/50" : ""
                }`}
        >
            <div className="flex p-4">
                <div className={`w-1 h-6 rounded-full m-1 flex-shrink-0 ${colorClasses500[colors] || "bg-gray-400"}`} />
                <h3 className="text-black/40 pl-2">{name}</h3>
            </div>

            <div className="px-4 pb-6">
                {children}
            </div>
        </div>
    );
}