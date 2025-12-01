import { Folder, MoreVertical } from "lucide-react";
import { RiEdit2Fill } from "react-icons/ri";
import { HiTrash } from "react-icons/hi2";
import { useDropdownMenu } from "../../hooks/useDropdownMenu";


export default function FolderCard({
    name,
    itemCount = 0,
    onClick,
    onEdit,
    onDelete
}) {
    const { showMenu, menuRef, handleMenuClick, handlers } = useDropdownMenu({
        actions: { onEdit, onDelete }
    });

    return (
        <div
            onClick={onClick}
            className="relative group bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-colors cursor-pointer border border-transparent hover:border-gray-300"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Folder size={24} className="text-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{name}</h3>
                        {itemCount !== undefined && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={handleMenuClick}
                        className="p-1.5 rounded-lg hover:bg-gray-300 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                        <MoreVertical size={20} className="text-gray-600" />
                    </button>

                    {showMenu && (
                        <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {onEdit && (
                                <button
                                    onClick={handlers.onEdit}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-1"><RiEdit2Fill />  Edit name</span>
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={handlers.onDelete}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-1"><HiTrash />
                                        Delete folder</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
