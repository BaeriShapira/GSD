import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getSyncStatus,
    enableCalendarSync as apiEnableCalendarSync,
    disableCalendarSync as apiDisableCalendarSync,
    triggerManualSync as apiTriggerManualSync,
    disconnectCalendar as apiDisconnectCalendar,
} from "../api/calendarApi";

export function useCalendar() {
    const queryClient = useQueryClient();

    // Fetch sync status
    const syncStatusQuery = useQuery({
        queryKey: ["calendar", "syncStatus"],
        queryFn: getSyncStatus,
        staleTime: 30000, // 30 seconds
        retry: 1,
    });

    // Enable sync mutation
    const enableMutation = useMutation({
        mutationFn: () => apiEnableCalendarSync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar", "syncStatus"] });
        },
    });

    // Disable sync mutation
    const disableMutation = useMutation({
        mutationFn: () => apiDisableCalendarSync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar", "syncStatus"] });
        },
    });

    // Trigger manual sync
    const syncMutation = useMutation({
        mutationFn: () => apiTriggerManualSync(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar", "syncStatus"] });
        },
    });

    // Disconnect calendar
    const disconnectMutation = useMutation({
        mutationFn: () => apiDisconnectCalendar(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar", "syncStatus"] });
        },
    });

    return {
        // Query data
        syncStatus: syncStatusQuery.data || null,
        isLoading: syncStatusQuery.isLoading,
        isError: syncStatusQuery.isError,

        // Mutations
        enableCalendarSync: () => enableMutation.mutate(),
        disableCalendarSync: () => disableMutation.mutate(),
        triggerSync: () => syncMutation.mutate(),
        disconnectCalendar: () => disconnectMutation.mutate(),

        // Async versions for await
        enableCalendarSyncAsync: () => enableMutation.mutateAsync(),
        triggerSyncAsync: () => syncMutation.mutateAsync(),

        // Loading states
        isEnabling: enableMutation.isPending,
        isDisabling: disableMutation.isPending,
        isSyncing: syncMutation.isPending,
        isDisconnecting: disconnectMutation.isPending,
    };
}
