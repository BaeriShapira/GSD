import { useState, useEffect } from "react";
import {
    fetchTimeBlocks,
    fetchTimeBlocksByDate,
    createTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
} from "../api/timeBlocksApi";

export function useTimeBlocks(date = null) {
    const [timeBlocks, setTimeBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    // Fetch time blocks on mount or when date changes
    useEffect(() => {
        async function loadTimeBlocks() {
            try {
                setIsLoading(true);
                setIsError(false);
                const data = date
                    ? await fetchTimeBlocksByDate(date)
                    : await fetchTimeBlocks();
                setTimeBlocks(data);
            } catch (err) {
                setIsError(true);
                setError(err);
                console.error("Failed to load time blocks:", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadTimeBlocks();
    }, [date]);

    const addTimeBlock = async (data) => {
        try {
            const newTimeBlock = await createTimeBlock(data);
            setTimeBlocks((prev) => [...prev, newTimeBlock]);
            return newTimeBlock;
        } catch (err) {
            console.error("Failed to create time block:", err);
            throw err;
        }
    };

    const editTimeBlock = async (id, data) => {
        try {
            const updated = await updateTimeBlock(id, data);
            setTimeBlocks((prev) =>
                prev.map((tb) => (tb.id === id ? updated : tb))
            );
            return updated;
        } catch (err) {
            console.error("Failed to update time block:", err);
            throw err;
        }
    };

    const removeTimeBlock = async (id) => {
        try {
            await deleteTimeBlock(id);
            setTimeBlocks((prev) => prev.filter((tb) => tb.id !== id));
        } catch (err) {
            console.error("Failed to delete time block:", err);
            throw err;
        }
    };

    return {
        timeBlocks,
        isLoading,
        isError,
        error,
        addTimeBlock,
        editTimeBlock,
        removeTimeBlock,
    };
}
