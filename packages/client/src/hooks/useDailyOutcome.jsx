import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchDailyOutcome,
    saveDailyOutcome as apiSaveDailyOutcome,
} from "../api/dailyOutcomesApi";
import { format } from "date-fns";

/**
 * Hook to manage daily outcome for a specific date
 * @param {Date} date - The date to fetch outcome for
 */
export function useDailyOutcome(date) {
    const queryClient = useQueryClient();
    const dateString = format(date, "yyyy-MM-dd");

    // Query for fetching daily outcome
    const outcomeQuery = useQuery({
        queryKey: ["dailyOutcome", dateString],
        queryFn: () => fetchDailyOutcome(dateString),
    });

    // Mutation for saving outcome
    const saveMutation = useMutation({
        mutationFn: (outcome) => apiSaveDailyOutcome(dateString, outcome),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyOutcome", dateString] });
        },
    });

    return {
        outcome: outcomeQuery.data?.outcome || null,
        isLoading: outcomeQuery.isLoading,
        isError: outcomeQuery.isError,
        error: outcomeQuery.error,

        saveOutcome: (outcome) => saveMutation.mutate(outcome),
        saveOutcomeAsync: (outcome) => saveMutation.mutateAsync(outcome),

        isSaving: saveMutation.isPending,
    };
}
