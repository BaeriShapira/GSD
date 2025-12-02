import { useTasks } from "../hooks/useTasks";
import { useDeleteTask } from "../hooks/useDeleteTask";
import MobileBucketInput from "../components/bucketMobile/MobileBucketInput";
import MobileBucketList from "../components/bucketMobile/MobileBucketList";
import logoUrl from "../assets/GSD_LOGO_PURPLE.svg";

/**
 * Mobile-optimized Bucket page
 * Simple layout for mobile users to quickly capture and view bucket items
 */
export default function BucketMobile() {
    const { tasks, isLoading, isError, error, createTask, updateTask } = useTasks("BUCKET");
    const deleteTaskMutation = useDeleteTask();

    const handleAdd = (text) => {
        createTask({
            text,
            status: "BUCKET",
        });
    };

    const handleEdit = (taskId, newText) => {
        updateTask(taskId, { text: newText });
    };

    const handleUpload = (taskId, files) => {
        // Upload files by creating a new task update with files
        // Note: Current API might not support adding files to existing tasks
        // We'll need to check if the backend supports this
        console.log("Upload files for task", taskId, files);
        // TODO: Implement file upload to existing task when backend supports it
        alert("File upload to existing tasks coming soon!");
    };

    const handleDelete = (taskId) => {
        deleteTaskMutation.mutate(taskId);
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col">
            {/* Header */}
            <div className=" pt-4 pb-2 px-4">
                <img
                    src={logoUrl}
                    alt="GSD cat"
                    className="w-60 object-contain select-none mx-auto"
                    draggable="false"
                />
            </div>

            {/* Tasks List - scrollable area */}
            <div className="flex-1 overflow-y-auto px-4 pb-24">
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-black/50">Loading...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">Error: {error?.message}</p>
                    </div>
                ) : (
                    <MobileBucketList
                        tasks={tasks}
                        onEdit={handleEdit}
                        onUpload={handleUpload}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Input - sticky at bottom */}
            <div className="sticky bottom-0 left-0 right-0 bg-brand-bg border-t border-black/10 p-4 shadow-lg">
                <MobileBucketInput onAdd={handleAdd} />
            </div>
        </div>
    );
}
