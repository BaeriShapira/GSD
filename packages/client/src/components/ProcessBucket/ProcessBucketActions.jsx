import { Trash2, Rocket } from "lucide-react";

export default function ProcessBucketActions({
    onSkip,
    onSave,
    canSave,
    validationMessage,
}) {
    return (
        <div className="process-bucket-actions mt-8">
            {!canSave && validationMessage && (
                <p className="text-sm text-red-500 mb-2 text-right">
                    {validationMessage}
                </p>
            )}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onSkip}
                    className="btn btn-outline"
                >
                    Skip this one
                </button>

                <button
                    type="button"
                    onClick={onSave}
                    disabled={!canSave}
                    className={`btn btn-primary ${!canSave ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Save &amp; next
                </button>
            </div>
        </div>
    );
}
