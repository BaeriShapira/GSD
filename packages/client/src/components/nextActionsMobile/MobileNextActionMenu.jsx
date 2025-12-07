import { useState, useRef, useEffect } from "react";
import { MoreVertical, CheckCircle, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function MobileNextActionMenu({
    onComplete,
    onEdit,
    onDelete,
    onToggleDetails,
    showDetails
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleComplete = () => {
        setIsOpen(false);
        onComplete();
    };

    const handleEdit = () => {
        setIsOpen(false);
        onEdit();
    };

    const handleDelete = () => {
        setIsOpen(false);
        if (confirm("Delete this action?")) {
            onDelete();
        }
    };

    const handleToggleDetails = () => {
        setIsOpen(false);
        onToggleDetails();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Actions"
            >
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-black/60" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-black/10 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
                    <button
                        onClick={handleToggleDetails}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-black/5 flex items-center gap-2"
                    >
                        {showDetails ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Hide Details
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Show Details
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleComplete}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-black/5 flex items-center gap-2 text-green-600"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                    </button>

                    <button
                        onClick={handleEdit}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-black/5 flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-black/5 flex items-center gap-2 text-red-600"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
