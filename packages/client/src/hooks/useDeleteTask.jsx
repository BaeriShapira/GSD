// packages/client/src/hooks/useDeleteTask.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api/tasksApi";

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId) => deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", "BUCKET"] });
        },
    });
}
