import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchFolders,
    createFolder as apiCreateFolder,
    updateFolder as apiUpdateFolder,
    deleteFolder as apiDeleteFolder,
} from "../api/foldersApi";

export function useFolders() {
    const queryClient = useQueryClient();

    const foldersQuery = useQuery({
        queryKey: ["folders"],
        queryFn: fetchFolders,
    });

    const createMutation = useMutation({
        mutationFn: (name) => apiCreateFolder(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, name }) => apiUpdateFolder(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            queryClient.invalidateQueries({ queryKey: ["tasks", "REFERENCE"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apiDeleteFolder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
        },
    });

    return {
        folders: foldersQuery.data || [],
        isLoading: foldersQuery.isLoading,
        isError: foldersQuery.isError,
        error: foldersQuery.error,

        // sync-style שימוש ישן
        createFolder: (name) => createMutation.mutate(name),

        // 👇 חדש – מחזיר Promise עם התיקייה החדשה
        createFolderAsync: (name) => createMutation.mutateAsync(name),

        updateFolder: (id, name) => updateMutation.mutate({ id, name }),
        deleteFolder: (id) => deleteMutation.mutate(id),
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
