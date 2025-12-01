import { Star, Clock, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

/**
 * Dynamic table cell component
 * Renders cell content based on column type and configuration
 *
 * Supported column types:
 * - "text": Simple text display
 * - "task": Task text with inline edit
 * - "project": Project name with color
 * - "urgency": Star rating
 * - "context": Context name with icon
 * - "estimatedTime": Time in minutes
 * - "date": Formatted date
 * - "waitingFor": Person/entity name
 * - "custom": Custom render function
 */
export default function TaskTableCell({ task, column }) {
    const renderCellContent = () => {
        // Custom render function
        if (column.render) {
            return column.render(task, column);
        }

        // Get value from task
        const value = column.accessor ? column.accessor(task) : task[column.key];

        // Render based on column type
        switch (column.type) {
            case "task":
                return (
                    <div className="flex items-start gap-2">
                        <span className="text-sm text-black/80 font-medium">
                            {value || task.text}
                        </span>
                    </div>
                );

            case "project":
                if (!value && !task.project) return <span className="text-xs text-black/40">No project</span>;
                const project = value || task.project;
                return (
                    <div className="flex items-center gap-2">
                        {project.areaOfLife?.color && (
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: project.areaOfLife.color }}
                            />
                        )}
                        <span className="text-sm text-black/70">{project.name}</span>
                    </div>
                );

            case "urgency":
                const urgency = value || task.urgency || 0;
                if (urgency === 0) return <span className="text-xs text-black/40">-</span>;
                return (
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={i < urgency ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                        ))}
                    </div>
                );

            case "context":
                if (!value && !task.context) return <span className="text-xs text-black/40">-</span>;
                const context = value || task.context;
                return (
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-black/70">{context.name}</span>
                    </div>
                );

            case "estimatedTime":
                const time = value || task.estimatedTime;
                if (!time) return <span className="text-xs text-black/40">-</span>;
                return (
                    <div className="flex items-center gap-1">
                        <Clock size={14} className="text-black/40" />
                        <span className="text-sm text-black/70">{time} min</span>
                    </div>
                );

            case "date":
                if (!value) return <span className="text-xs text-black/40">-</span>;
                const dateObj = typeof value === "string" ? parseISO(value) : value;
                return (
                    <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-black/40" />
                        <span className="text-sm text-black/70">
                            {format(dateObj, column.dateFormat || "MMM d, yyyy")}
                        </span>
                    </div>
                );

            case "waitingFor":
                if (!value) return <span className="text-xs text-black/40">-</span>;
                return (
                    <span className="text-sm text-black/70 font-medium">{value}</span>
                );

            case "area":
                if (!value && !task.areaOfLife) return <span className="text-xs text-black/40">General</span>;
                const area = value || task.areaOfLife;
                return (
                    <div className="flex items-center gap-2">
                        {area.color && (
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: area.color }}
                            />
                        )}
                        <span className="text-sm text-black/70">{area.name}</span>
                    </div>
                );

            case "text":
            default:
                return (
                    <span className="text-sm text-black/70">
                        {value || "-"}
                    </span>
                );
        }
    };

    return (
        <td className="p-3">
            {renderCellContent()}
        </td>
    );
}
