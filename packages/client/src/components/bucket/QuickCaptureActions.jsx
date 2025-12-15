// components/quick-capture/QuickCaptureActions.jsx
import { Trash2, Rocket } from "lucide-react";

export default function QuickCaptureActions({
    onDeleteSelected,
    onProcessAll,
    hasSelection,
}) {
    return (
        <div className="flex justify-end gap-3 ">
            <button
                type="button"
                onClick={onDeleteSelected}
                disabled={!hasSelection}
                className={`btn
                    ${hasSelection
                        ? "btn-secondary"
                        : "btn-secondary btn-disabled"
                    }`}
            >
                <Trash2 className="w-4 h-4" />
                Delete
            </button>

            <button
                type="button"
                onClick={onProcessAll} // כרגע לא עושה כלום
                className="btn btn-primary process-bucket-button"
            >
                <Rocket className="w-4 h-4" />
                Process all
            </button>
        </div>
    );
}
