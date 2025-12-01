import PageHeader from "../UI/PageHeader";
import { FolderPlus } from "lucide-react";

export default function ReferenceHeader({
    searchQuery,
    onSearchChange,
    onAddFolder
}) {
    return (
        <PageHeader
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search by text, label, or file..."
            actionLabel="Add folder"
            onAction={onAddFolder}
            actionIcon={FolderPlus}
        />
    );
}
