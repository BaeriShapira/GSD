// hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchTasks,
    createTask as createTaskApi,
    updateTask as updateTaskApi,
    deleteTask as deleteTaskApi,
} from "../api/tasksApi";

export function useTasks(status = "INBOX") {
    const queryClient = useQueryClient();

    // טעינת משימות
    const tasksQuery = useQuery({
        queryKey: ["tasks", status],
        queryFn: () => fetchTasks(status),
    });

    // יצירת משימה (עם טקסט + קבצים)
    const createMutation = useMutation({
        mutationFn: (data) => createTaskApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", status] });
        },
    });

    // עדכון משימה (תומך בכל השדות)
    const updateMutation = useMutation({
        mutationFn: ({ id, updates }) => updateTaskApi(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", status] });
        },
    });

    // מחיקת משימה
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteTaskApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", status] });
        },
    });

    return {
        tasks: tasksQuery.data || [],
        isLoading: tasksQuery.isLoading,
        isError: tasksQuery.isError,
        error: tasksQuery.error,

        // 👇 עכשיו מקבל אובייקט עם כל השדות (text, files, status, folderId, labels, projectId, dueDate, waitingFor, contextId וכו')
        createTask: (data) => createMutation.mutate(data),
        updateTask: (id, updates) => updateMutation.mutate({ id, updates }),
        deleteTask: (id) => deleteMutation.mutate(id),

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
