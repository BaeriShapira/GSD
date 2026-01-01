import { getFileIcon } from "../../utils/fileIcons";

/**
 * Reusable component for displaying file attachments
 * @param {Array} attachments - Array of attachment objects with {id, url, originalName}
 * @param {string} className - Optional additional CSS classes for the container
 */
export default function AttachmentList({ attachments = [], className = "" }) {
    if (!attachments || attachments.length === 0) {
        return null;
    }

    const handleClick = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
        // Open in new tab using window.open to avoid React Router
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {attachments.map(att => (
                <button
                    key={att.id || att.url}
                    onClick={(e) => handleClick(e, att.url)}
                    className="flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 text-[11px] text-black/70 hover:bg-black/5 transition-colors cursor-pointer"
                >
                    {getFileIcon(att.originalName, 12)}
                    <span className="max-w-[140px] truncate">
                        {att.originalName || "Attachment"}
                    </span>
                </button>
            ))}
        </div>
    );
}
