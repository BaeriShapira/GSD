import DropdownMenu from "../UI/DropdownMenu";
import { colorClasses500, colorClasses600 } from "../../config/areaColors";

/**
 * Time Block card component
 * Displays with the color of the associated Area of Life
 */
export default function TimeBlockCard({ timeBlock, onEdit, onDelete, onComplete }) {
    const handleComplete = () => {
        if (!onComplete) {
            console.error("onComplete is not defined");
            return;
        }
        onComplete(timeBlock.id);
    };

    // Get the area from either direct assignment or through project
    const area = timeBlock.areaOfLife || timeBlock.project?.areaOfLife;
    const areaColor = area?.color || "yellow";

    // Use color classes from config
    const bgClass = colorClasses500[areaColor] || "bg-yellow-500";
    const hoverClass = colorClasses600[areaColor] || "bg-yellow-600";

    return (
        <div className={`${bgClass} hover:${hoverClass} rounded-lg flex items-center gap-3 p-4 transition-colors group min-h-[100px]`}>
            {/* Time Block Content */}
            <div className="flex-1 pl-2">


                {/* Title */}
                <h3>
                    {timeBlock.title}
                </h3>

                {/* Area/Project Info */}

                <div className="flex items-center gap-2 mt-1">
                    {timeBlock.project ? (
                        <a
                            href={`/app/projects/${timeBlock.project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-800 hover:text-gray-500"
                        >
                            {timeBlock.project.name}
                        </a>
                    ) : (
                        area && (
                            <span className="text-sm text-gray-800 hover:text-gray-500">
                                {area.name}
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* Time Range */}
            <p className="text-sm text-gray-800 font-medium">
                {timeBlock.startTime}-{timeBlock.endTime}
            </p>
            {/* Actions */}
            <div className="flex items-center gap-2">


                {/* Dropdown Menu */}
                <DropdownMenu
                    onComplete={handleComplete}
                    onEdit={() => onEdit && onEdit(timeBlock)}
                    onDelete={() => onDelete && onDelete(timeBlock.id)}
                    position="right"
                />
            </div>
        </div >
    );
}
