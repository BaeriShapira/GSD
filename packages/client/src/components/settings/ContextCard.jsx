import { getContextIcon } from "../../config/contextIcons";

export default function ContextCard({ context, onEdit, onDelete }) {
    const typeLabels = {
        tool: "Tool",
        location: "Location",
    };

    const IconComponent = getContextIcon(context.icon);

    return (
        <div className="group relative flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => onEdit(context)}>
            <div className="flex-shrink-0">
                <IconComponent size={20} className="text-black/60" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black/90">{context.name}</h3>
            </div>
            <span className="text-xs text-black/40 flex-shrink-0">
                {typeLabels[context.type] || "Tool"}
            </span>
        </div>
    );
}
