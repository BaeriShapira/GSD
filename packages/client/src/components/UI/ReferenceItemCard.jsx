import { MoreVertical } from "lucide-react";
import { RiEdit2Fill } from "react-icons/ri";
import { HiTrash } from "react-icons/hi2";
import { RiFolderTransferFill } from "react-icons/ri";
import { colorClasses400 } from "../../config/areaColors";
import { useDropdownMenu } from "../../hooks/useDropdownMenu";
import AttachmentList from "./AttachmentList";


export default function ReferenceItemCard({
    text,
    labels,
    folderName,
    attachments = [],
    areaOfLife,
    onEdit,
    onDelete,
    onMove,
}) {
    const { showMenu, menuRef, handleMenuClick, handlers } = useDropdownMenu({
        actions: { onEdit, onDelete, onMove }
    });

    return (
        <div className="relative group bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-300 flex flex-col h-full">
            {/* Header with title and menu */}
            <div className="flex items-start justify-between gap-1 mb-auto">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                    {/* צבע Area of Life */}
                    {areaOfLife && (
                        <div
                            className={` w-1 h-6 rounded-full mt-0.5 flex-shrink-0 ${colorClasses400[areaOfLife.color] || "bg-gray-400"
                                }`}
                            title={areaOfLife.name}
                        />
                    )}
                    <h4 className="flex-1 break-all">{text}</h4>
                </div>
                <div className="relative hrink-0" ref={menuRef}>
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
                                    <span className="flex items-center gap-1">
                                        <RiEdit2Fill /> Edit
                                    </span>
                                </button>
                            )}

                            {onMove && (
                                <button
                                    onClick={handlers.onMove}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-1">
                                        <RiFolderTransferFill /> Move
                                    </span>
                                </button>
                            )}

                            {onDelete && (
                                <button
                                    onClick={handlers.onDelete}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-1">
                                        <HiTrash /> Delete
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Attachments */}
            <AttachmentList attachments={attachments} className="mt-3" />

            {/* Footer - Area, Folder and Labels */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-black/50">
                {areaOfLife && (
                    <span className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] text-black/70">
                        <div
                            className={`w-2 h-2 rounded-full ${colorClasses400[areaOfLife.color] || "bg-gray-400"
                                }`}
                        />
                        {areaOfLife.name}
                    </span>
                )}
                {folderName && (
                    <span className="flex items-center gap-1">
                        📁 {folderName}
                    </span>
                )}
                {labels && (
                    <span className="flex items-center gap-1">
                        🏷️ {labels}
                    </span>
                )}
            </div>
        </div>
    );
}
