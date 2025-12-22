import TaskWithChildren from "./TaskWithChildren";
import TimeBlockCard from "./TimeBlockCard";

export default function ScheduledItemsSection({
    orderedScheduleItems,
    onNewTimeBlock,
    onEditTimeBlock,
    onDeleteTimeBlock,
    onCompleteTask,
    onEditTask,
    onDeleteTask,
    onRemoveTask
}) {
    return (
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-black/10 dark:border-dark-border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-brand-primary dark:text-white">
                    Scheduled tasks for today
                </h3>
                <button
                    onClick={onNewTimeBlock}
                    className="btn btn-primary"
                >
                    + Time-block
                </button>
            </div>

            <div className="space-y-3">
                {orderedScheduleItems.length > 0 ? (
                    orderedScheduleItems.map((item) => {
                        if (item.type === "timeBlock") {
                            return (
                                <TimeBlockCard
                                    key={`tb-${item.timeBlock.id}`}
                                    timeBlock={item.timeBlock}
                                    onEdit={() => onEditTimeBlock(item.timeBlock)}
                                    onDelete={() => onDeleteTimeBlock(item.timeBlock.id)}
                                    onComplete={() => onDeleteTimeBlock(item.timeBlock.id)}
                                />
                            );
                        }

                        return (
                            <TaskWithChildren
                                key={`task-${item.task.id}`}
                                parentTask={item.task}
                                childTasks={item.children}
                                onComplete={onCompleteTask}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                onRemove={onRemoveTask}
                                showTime={true}
                            />
                        );
                    })
                ) : (
                    <p className="text-black/40 dark:text-white/40 text-center py-8">
                        No scheduled tasks or time blocks
                    </p>
                )}
            </div>
        </div>
    );
}
