import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchContexts,
    createContext as apiCreateContext,
    updateContext as apiUpdateContext,
    deleteContext as apiDeleteContext,
} from "../api/contextsApi";

export function useContexts() {
    const queryClient = useQueryClient();

    // Query for fetching contexts
    const contextsQuery = useQuery({
        queryKey: ["contexts"],
        queryFn: fetchContexts,
    });

    // Mutation for creating
    const createMutation = useMutation({
        mutationFn: (data) => apiCreateContext(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contexts"] });
        },
    });

    // Mutation for updating
    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) => apiUpdateContext(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contexts"] });
        },
    });

    // Mutation for deleting
    const deleteMutation = useMutation({
        mutationFn: (id) => apiDeleteContext(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contexts"] });
        },
    });

    return {
        contexts: contextsQuery.data || [],
        isLoading: contextsQuery.isLoading,
        isError: contextsQuery.isError,
        error: contextsQuery.error,

        createContext: (data) => createMutation.mutate(data),
        createContextAsync: (data) => createMutation.mutateAsync(data),
        updateContext: (id, data) => updateMutation.mutate({ id, ...data }),
        updateContextAsync: (id, data) => updateMutation.mutateAsync({ id, ...data }),
        deleteContext: (id) => deleteMutation.mutate(id),
        deleteContextAsync: (id) => deleteMutation.mutateAsync(id),

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
