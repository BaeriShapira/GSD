import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        function handleEscape(e) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-3 border-black/10 dark:border-dark-border">
                    <h2 className="text-xl font-bold text-brand-primary dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-black/60 dark:text-white/70 cursor-pointer" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 pt-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
