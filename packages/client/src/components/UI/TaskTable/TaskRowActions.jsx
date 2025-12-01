import { CheckCircle2, Send, Edit, Trash2 } from "lucide-react";

/**
 * Row actions component
 * Displays action buttons based on provided actions configuration
 *
 * Supported actions:
 * - onComplete: Mark as complete (Next Actions)
 * - onNudge: Send nudge (Waiting For)
 * - onReceived: Mark as received (Waiting For)
 * - onEdit: Edit task
 * - onDelete: Delete task
 */
export default function TaskRowActions({ task, actions }) {
    const {
        onComplete,
        onNudge,
        onReceived,
        onEdit,
        onDelete,
    } = actions;

    return (
        <div className="flex items-center gap-2 justify-end">
            {/* Complete Button (Next Actions) */}
            {onComplete && (
                <button
                    onClick={() => onComplete(task.id)}
                    className="p-2 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group"
                    title="Mark as complete"
                >
                    <CheckCircle2 size={18} className="text-gray-400 group-hover:text-green-600" />
                </button>
            )}

            {/* Nudge Button (Waiting For) */}
            {onNudge && (
                <button
                    onClick={() => onNudge(task.id)}
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                    title="Send nudge"
                >
                    Nudge
                </button>
            )}

            {/* Received Button (Waiting For) */}
            {onReceived && (
                <button
                    onClick={() => onReceived(task.id)}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                    title="Mark as received"
                >
                    Received
                </button>
            )}

            {/* Edit Button */}
            {onEdit && (
                <button
                    onClick={() => onEdit(task)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                    title="Edit"
                >
                    <Edit size={18} className="text-gray-400 group-hover:text-blue-600" />
                </button>
            )}

            {/* Delete Button */}
            {onDelete && (
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer group"
                    title="Delete"
                >
                    <Trash2 size={18} className="text-gray-400 group-hover:text-red-600" />
                </button>
            )}
        </div>
    );
}
