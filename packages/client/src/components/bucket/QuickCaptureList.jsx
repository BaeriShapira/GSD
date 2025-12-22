import QuickCaptureItem from "./QuickCaptureItem";

export default function QuickCaptureList({
    items,
    selectedIds,
    onToggleSelect,
    onChangeText,
}) {
    if (!items.length) {
        return (
            <p className="text-sm text-black/40 dark:text-dark-text-secondary mt-2">
                No captured items yet. Start typing above ✍️
            </p>
        );
    }

    return (
        <div className="space-y-2 mt-2">
            {items.map(item => (
                <QuickCaptureItem
                    key={item.id}
                    item={item}
                    selected={selectedIds.includes(item.id)}
                    onToggleSelect={() => onToggleSelect(item.id)}
                    onChangeText={newText => onChangeText(item.id, newText)}
                />
            ))}
        </div>
    );
}
