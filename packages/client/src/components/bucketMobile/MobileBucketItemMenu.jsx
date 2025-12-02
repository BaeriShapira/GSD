import { MoreVertical, Upload } from "lucide-react";
import { RiEdit2Fill } from "react-icons/ri";
import { HiTrash } from "react-icons/hi2";
import { useDropdownMenu } from "../../hooks/useDropdownMenu";
import { useRef } from "react";

/**
 * Custom dropdown menu for mobile bucket items
 * Includes Edit, Upload Files, and Delete options
 */
export default function MobileBucketItemMenu({ onEdit, onUpload, onDelete }) {
    const fileInputRef = useRef(null);
    const { showMenu, menuRef, handleMenuClick, handlers } = useDropdownMenu({
        actions: { onEdit, onDelete }
    });

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onUpload(files);
        }
        // Reset input so same file can be uploaded again
        e.target.value = '';
        // Close menu after upload
        handlers.closeMenu();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={handleMenuClick}
                className="p-1.5 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
                <MoreVertical size={20} className="text-gray-600" />
            </button>

            {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    {onEdit && (
                        <button
                            onClick={handlers.onEdit}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-1">
                                <RiEdit2Fill />
                                Edit
                            </span>
                        </button>
                    )}
                    {onUpload && (
                        <>
                            <button
                                onClick={handleUploadClick}
                                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                                <span className="flex items-center gap-1">
                                    <Upload size={14} />
                                    Upload Files
                                </span>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                    {onDelete && (
                        <button
                            onClick={handlers.onDelete}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-1">
                                <HiTrash />
                                Delete
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
