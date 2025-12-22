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

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {attachments.map(att => (
                <a
                    key={att.id || att.url}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-full border border-black/10 dark:border-dark-border px-2.5 py-1 text-[11px] text-black/70 dark:text-dark-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                    {getFileIcon(att.originalName, 12)}
                    <span className="max-w-[140px] truncate">
                        {att.originalName || "Attachment"}
                    </span>
                </a>
            ))}
        </div>
    );
}
