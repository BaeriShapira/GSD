import { colorClasses400 } from "../../config/areaColors";

export default function AreaOfResponsibilityCard({ area, onEdit, onDelete }) {

    return (
        <div className="group relative center flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer "
            onClick={() => onEdit(area)}>
            <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ${colorClasses400[area.color] || "bg-gray-400"}`} />
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black/90">{area.name}</h3>
                <p className="text-sm text-black/60 truncate">{area.description}</p>
            </div>
        </div>
    );
}
