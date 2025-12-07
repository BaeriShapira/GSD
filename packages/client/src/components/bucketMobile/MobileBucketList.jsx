import MobileBucketItem from "./MobileBucketItem";

export default function MobileBucketList({ tasks, onEdit, onUpload, onDelete }) {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-black/50">Your bucket is empty</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 sm:space-y-3">
            {tasks.map((task) => (
                <MobileBucketItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onUpload={onUpload}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
