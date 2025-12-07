import MobileNextActionItem from "./MobileNextActionItem";

export default function MobileNextActionList({
    tasks,
    projects,
    contexts,
    onComplete,
    onEdit,
    onDelete
}) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-8 sm:py-12">
                <p className="text-black/50 text-sm sm:text-base">No next actions</p>
                <p className="text-black/40 text-xs sm:text-sm mt-1">
                    Add your first action to get started
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2 sm:space-y-3">
            {tasks.map(task => (
                <MobileNextActionItem
                    key={task.id}
                    task={task}
                    projects={projects}
                    contexts={contexts}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
