import { createPortal } from "react-dom";
import { X, Calendar, Package } from "lucide-react";
import { systemUpdates } from "./systemUpdates";

export default function UpdatesModal({ isOpen, onClose }) {
    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            {/* Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black/5 rounded-lg">
                            <Package size={24} className="text-black/80" />
                        </div>
                        <h2 className="text-xl font-semibold text-black/90">
                            System Updates
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-black/60 cursor-pointer" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
                    {systemUpdates.length === 0 ? (
                        <div className="text-center py-12 text-black/60">
                            <Package size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No updates available at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {systemUpdates.map((update, index) => (
                                <div
                                    key={update.id}
                                    className={`
                                        pb-6
                                        ${index < systemUpdates.length - 1 ? "border-b border-gray-200" : ""}
                                    `}
                                >
                                    {/* Update Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-black/90 mb-1">
                                                {update.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-black/60">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(update.date)}</span>
                                                </div>
                                                {update.version && (
                                                    <div className="flex items-center gap-1">
                                                        <Package size={14} />
                                                        <span>Version {update.version}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Update Items */}
                                    <ul className="space-y-2">
                                        {update.items.map((item, itemIndex) => (
                                            <li
                                                key={itemIndex}
                                                className="flex items-start gap-3 text-black/80"
                                            >
                                                <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-black/90" />
                                                <span className="flex-1 whitespace-pre-wrap">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return isOpen ? createPortal(modalContent, document.body) : null;
}
