import { useRef } from "react";
import { MoreVertical, RotateCcw, Trash2 } from "lucide-react";
import { useDropdownMenu } from "../../hooks/useDropdownMenu";

export default function ArchiveRowMenu({ taskId, onRestore, onDelete }) {
    const menuRef = useRef(null);
    const { showMenu, handleMenuClick, handlers } = useDropdownMenu({
        actions: {
            onRestore: () => {
                onRestore(taskId);
                handlers.closeMenu();
            },
            onDelete: () => {
                onDelete(taskId);
                handlers.closeMenu();
            },
        }
    });

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={handleMenuClick}
                className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
                <MoreVertical size={16} className="text-black/40" />
            </button>

            {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]">
                    <button
                        onClick={handlers.onRestore}
                        className="w-full px-4 py-2 text-left text-sm text-black/80 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={14} />
                        Restore to Next Actions
                    </button>
                    <button
                        onClick={handlers.onDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={14} />
                        Delete permanently
                    </button>
                </div>
            )}
        </div>
    );
}
