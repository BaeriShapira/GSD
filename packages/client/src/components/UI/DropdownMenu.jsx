import { MoreVertical } from "lucide-react";
import { RiEdit2Fill } from "react-icons/ri";
import { HiTrash } from "react-icons/hi2";
import { MdRemoveCircleOutline } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useDropdownMenu } from "../../hooks/useDropdownMenu";

/**
 * Reusable dropdown menu component with Edit, Remove, Delete, and Complete options
 * @param {Object} props
 * @param {Function} props.onComplete - Complete action handler
 * @param {Function} props.onEdit - Edit action handler
 * @param {Function} props.onRemove - Remove action handler
 * @param {Function} props.onDelete - Delete action handler
 * @param {string} props.completeLabel - Label for complete button (default: "Done")
 * @param {string} props.editLabel - Label for edit button (default: "Edit")
 * @param {string} props.removeLabel - Label for remove button (default: "Remove")
 * @param {string} props.deleteLabel - Label for delete button (default: "Delete")
 * @param {string} props.buttonClassName - Additional classes for the trigger button
 * @param {string} props.menuClassName - Additional classes for the menu container
 * @param {string} props.position - Menu position: 'left' or 'right' (default: 'left')
 */
export default function DropdownMenu({
    onComplete,
    onEdit,
    onRemove,
    onDelete,
    completeLabel = "Done",
    editLabel = "Edit",
    removeLabel = "Remove",
    deleteLabel = "Delete",
    buttonClassName = "",
    menuClassName = "",
    position = "left"
}) {
    const { showMenu, menuRef, handleMenuClick, handlers } = useDropdownMenu({
        actions: { onComplete, onEdit, onRemove, onDelete }
    });

    const positionClasses = position === "right"
        ? "right-0"
        : "left-0";

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={handleMenuClick}
                className={`p-1.5 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer  group-hover:opacity-100 ${buttonClassName}`}
            >
                <MoreVertical size={20} className="text-gray-600" />
            </button>

            {showMenu && (
                <div className={`absolute ${positionClasses} top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 ${menuClassName}`}>
                    {onComplete && (
                        <button
                            onClick={handlers.onComplete}
                            className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-1">
                                <IoCheckmarkCircle />
                                {completeLabel}
                            </span>
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={handlers.onEdit}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-1">
                                <RiEdit2Fill />
                                {editLabel}
                            </span>
                        </button>
                    )}
                    {onRemove && (
                        <button
                            onClick={handlers.onRemove}
                            className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-1">
                                <MdRemoveCircleOutline />
                                {removeLabel}
                            </span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handlers.onDelete}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-1">
                                <HiTrash />
                                {deleteLabel}
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
