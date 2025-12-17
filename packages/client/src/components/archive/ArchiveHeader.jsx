import { Search } from "lucide-react";

export default function ArchiveHeader({ searchQuery, onSearchChange, tasksCount }) {
    return (
        <div className="px-4 my-4">
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input
                        type="text"
                        placeholder="Search archived tasks..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="input pl-11 w-full"
                    />
                </div>

                {/* Count */}
                <div className="text-sm text-black/50">
                    {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
                </div>
            </div>
        </div>
    );
}
