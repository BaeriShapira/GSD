import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotebook, saveNotebook } from "../api/notebooksApi";
import { format } from "date-fns";

/**
 * Hook to manage notebook for a specific date
 */
export function useNotebook(date) {
    const queryClient = useQueryClient();
    const dateString = format(date, "yyyy-MM-dd");

    // Fetch notebook for the date
    const { data: notebook, isLoading, error } = useQuery({
        queryKey: ["notebook", dateString],
        queryFn: () => getNotebook(dateString),
    });

    // Mutation to save notebook
    const saveMutation = useMutation({
        mutationFn: (data) => saveNotebook(dateString, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notebook", dateString] });
        },
    });

    return {
        notebook,
        isLoading,
        error,
        saveNotebook: saveMutation.mutateAsync,
        isSaving: saveMutation.isPending,
    };
}
