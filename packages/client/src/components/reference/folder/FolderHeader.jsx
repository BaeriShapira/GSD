import { ArrowLeft } from "lucide-react";

export default function FolderHeader({ name, onBack }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
                <ArrowLeft size={20} className="text-black/60" />
            </button>
            <h2>{name}</h2>
        </div>
    );
}
