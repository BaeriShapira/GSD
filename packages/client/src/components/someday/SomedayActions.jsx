import { Trash2, MoveLeft } from "lucide-react";
import { BsBucketFill, BsFolderFill } from "react-icons/bs";


export default function SomedayActions({
    onDeleteSelected,
    onMoveToBucket,
    hasSelection,
}) {
    return (
        <div className="flex justify-end gap-3">
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
                onClick={onMoveToBucket}
                disabled={!hasSelection}
                className={`btn
                    ${hasSelection
                        ? "btn-primary"
                        : "btn-primary btn-disabled"
                    }`}
            >
                <BsBucketFill className="w-4 h-4" />
                Move back to Bucket
            </button>
        </div>
    );
}
