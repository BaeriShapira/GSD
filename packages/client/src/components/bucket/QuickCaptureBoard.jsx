// packages/client/src/components/QuickCaptureBoard.jsx
import { useState } from "react";
import QuickCaptureInput from "./QuickCaptureInput";
import QuickCaptureList from "./QuickCaptureList";
import QuickCaptureActions from "./QuickCaptureActions";
import { useTasks } from "../../hooks/useTasks";
import { useNavigate } from "react-router-dom";


export default function QuickCaptureBoard() {
    const {
        tasks,
        isLoading,
        isError,
        error,
        createTask,
        updateTask,
        deleteTask,
    } = useTasks("BUCKET");

    const [selectedIds, setSelectedIds] = useState([]);

    function handleAddItem(text, files) {
        createTask({ text, files });
    }

    function handleToggleSelect(id) {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    function handleChangeText(id, newText) {
        updateTask(id, newText);
    }

    function handleDeleteSelected() {
        selectedIds.forEach(id => {
            deleteTask(id);
        });
        setSelectedIds([]);
    }

    const navigate = useNavigate();
    function handleProcessAll() {
        navigate("/app/process_bucket");
    }

    // QuickCaptureBoard.jsx
    return (
        <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm">
            {/* שורה עליונה – אינפוט + כפתורים */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:gap-6">
                {/* כאן מגבילים רוחב רק ב-lg */}
                <div className="w-full  lg:max-w-100 lg:flex-1 min-w-0">
                    <QuickCaptureInput onAdd={handleAddItem} />
                </div>

                <div className="flex w-full lg:w-auto lg:ml-auto">
                    <QuickCaptureActions
                        onDeleteSelected={handleDeleteSelected}
                        onProcessAll={handleProcessAll}
                        hasSelection={selectedIds.length > 0}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-sm text-black/50">Loading tasks...</div>
            ) : isError ? (
                <div className="text-sm text-red-500">
                    Error loading tasks... {error?.message}
                </div>
            ) : (
                <QuickCaptureList
                    items={tasks}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onChangeText={handleChangeText}
                />
            )}
        </div>
    );
}

