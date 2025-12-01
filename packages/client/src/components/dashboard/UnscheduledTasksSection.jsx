import TaskWithChildren from "./TaskWithChildren";

export default function UnscheduledTasksSection({
    unscheduledTasks,
    onComplete,
    onEdit,
    onDelete,
    onRemove,
    onAddTask
}) {
    return (
        <div className="bg-white rounded-xl border border-black/10 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-brand-primary">
                    Unscheduled tasks for today
                </h3>
                <button
                    onClick={onAddTask}
                    className="btn btn-primary"
                >
                    + Add
                </button>
            </div>

            <div className="space-y-3">
                {unscheduledTasks.length === 0 ? (
                    <p className="text-black/40 text-center py-8">
                        No unscheduled tasks
                    </p>
                ) : (
                    unscheduledTasks.map(({ task, children }) => (
                        <TaskWithChildren
                            key={task.id}
                            parentTask={task}
                            childTasks={children}
                            onComplete={onComplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onRemove={onRemove}
                            showTime={false}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
