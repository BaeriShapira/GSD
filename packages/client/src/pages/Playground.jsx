import MasterTaskCard from "../components/UI/MasterTaskCard";

/**
 * Playground Page - For development experiments only
 * This page is only accessible in development mode
 */
export default function Playground() {
    // Sample task data for demonstration
    const sampleTask = {
        id: 1,
        text: "Sample Task - Test the MasterTaskCard component",
        urgency: 3,
        project: {
            id: 1,
            name: "Test Project",
            areaOfLife: {
                color: "blue"
            }
        },
        dueDate: new Date().toISOString(),
        blockedByTaskId: null
    };

    const handleComplete = (id) => {
        console.log("Complete task:", id);
    };

    const handleEdit = (task) => {
        console.log("Edit task:", task);
    };

    const handleDelete = (id) => {
        console.log("Delete task:", id);
    };

    const handleRemove = (id) => {
        console.log("Remove task:", id);
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">MasterTaskCard Playground</h1>

            <MasterTaskCard
                task={sampleTask}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRemove={handleRemove}
                showTime={true}
            />
        </div>
    );
}
