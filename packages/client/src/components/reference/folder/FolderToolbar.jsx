import { Plus } from "lucide-react";
import SearchInput from "../../UI/SearchInput";

export default function FolderToolbar({ onAddClick, searchQuery, onSearchChange }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search by text, label, or file..."
            />
            <button
                onClick={onAddClick}
                className="btn btn-primary"
            >
                <Plus size={20} />
                <span>Add file</span>
            </button>
        </div>
    );
}
