import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchAreas,
    createArea as apiCreateArea,
    updateArea as apiUpdateArea,
    deleteArea as apiDeleteArea,
} from "../api/areasApi";

export function useAreas() {
    const queryClient = useQueryClient();

    // Query for fetching areas
    const areasQuery = useQuery({
        queryKey: ["areas"],
        queryFn: fetchAreas,
    });

    // Mutation for creating
    const createMutation = useMutation({
        mutationFn: (data) => apiCreateArea(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });

    // Mutation for updating
    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) => apiUpdateArea(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });

    // Mutation for deleting
    const deleteMutation = useMutation({
        mutationFn: (id) => apiDeleteArea(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
    });

    return {
        areas: areasQuery.data || [],
        isLoading: areasQuery.isLoading,
        isError: areasQuery.isError,
        error: areasQuery.error,

        createArea: (data) => createMutation.mutate(data),
        createAreaAsync: (data) => createMutation.mutateAsync(data),
        updateArea: (id, data) => updateMutation.mutate({ id, ...data }),
        updateAreaAsync: (id, data) => updateMutation.mutateAsync({ id, ...data }),
        deleteArea: (id) => deleteMutation.mutate(id),
        deleteAreaAsync: (id) => deleteMutation.mutateAsync(id),

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
