import { useState } from "react";
import { colorClasses400 } from "../../config/areaColors";
import DropdownMenu from "./DropdownMenu";
import { ChevronDown, ChevronUp } from "lucide-react";


export default function ProjectCard({
    name,
    areaOfLife = null,
    nextActions = [],
    onClick,
    onEdit,
    onDelete
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMore = nextActions.length > 2;
    const displayedActions = isExpanded ? nextActions : nextActions.slice(0, 2);

    return (
        <div
            onClick={onClick}
            className="
            relative group bg-gray-100 p-4 
            transition-colors 
            border border-transparent rounded-xl
            hover:bg-gray-200  hover:border-gray-300
            "
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                        {/* צבע Area of Life */}
                        <div className="flex items-start gap-2 flex-1">
                            {areaOfLife && (
                                <div
                                    className={`w-1 h-6 rounded-full mt-0.5 flex-shrink-0 ${colorClasses400[areaOfLife.color] || "bg-gray-400"
                                        }`}
                                    title={areaOfLife.name}
                                />
                            )}
                            <h4 className="flex-1">{name}</h4>
                        </div>
                        {areaOfLife && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] text-black/70 mt-2">
                                <div className={`w-2 h-2 rounded-full ${colorClasses400[areaOfLife.color] || 'bg-gray-400'}`} />
                                {areaOfLife.name}
                            </span>
                        )}

                        {/* Next Actions */}
                        {nextActions.length >= 0 && (
                            <div className="mt-3 pt-3 ">
                                <div className="flex items-center  mb-2">
                                    <span className="text-xs font-semibold text-black/60">
                                        Next Actions ({nextActions.length})
                                    </span>
                                    {hasMore && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsExpanded(!isExpanded);
                                            }}
                                            className="text-black/60 hover:text-black/80 transition-colors p-1 rounded hover:bg-black/5 cursor-pointer"
                                            aria-label={isExpanded ? "Show less" : "Show more"}
                                        >
                                            {isExpanded ? (
                                                <ChevronUp size={14} />
                                            ) : (
                                                <ChevronDown size={14} />
                                            )}
                                        </button>
                                    )}
                                </div>
                                <ul className="space-y-1">
                                    {displayedActions.map((action) => (
                                        <li
                                            key={action.id}
                                            className="text-xs text-black/70 truncate"
                                            title={action.text}
                                        >
                                            <p1>• {action.text}</p1>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <DropdownMenu
                    onEdit={onEdit}
                    onDelete={onDelete}
                    editLabel="Edit project"
                    deleteLabel="Delete project"
                />
            </div>
        </div>
    );
}
