import { useState, useMemo } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useAreas } from "../../hooks/useAreas";
import { useProjects } from "../../hooks/useProjects";
import { useContexts } from "../../hooks/useContexts";
import PageHeader from "../UI/PageHeader";
import DateFilter from "./DateFilter";
import ArchiveTableView from "./ArchiveTableView";
import ArchiveGroupedView from "./ArchiveGroupedView";
import ArchiveStatsView from "./ArchiveStatsView";
import LoadingState from "../UI/LoadingState";
import ErrorState from "../UI/ErrorState";

export default function ArchiveBoard() {
    // Data fetching
    const { tasks, isLoading, isError, error, updateTask, deleteTask } = useTasks("COMPLETED");
    const { areas } = useAreas();
    const { projects } = useProjects();
    const { contexts } = useContexts();

    // Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [projectFilterId, setProjectFilterId] = useState(null);
    const [areaFilterId, setAreaFilterId] = useState(null);
    const [contextFilterId, setContextFilterId] = useState(null);
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    // View state
    const [viewMode, setViewMode] = useState("table");
    const [groupBy, setGroupBy] = useState("area");

    // UI state
    const [celebratingTaskId, setCelebratingTaskId] = useState(null);

    // Apply filters
    const filteredTasks = useMemo(() => {
        let result = tasks;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.text.toLowerCase().includes(query)
            );
        }

        // Project filter
        if (projectFilterId) {
            result = result.filter(t =>
                String(t.projectId) === String(projectFilterId)
            );
        }

        // Area filter
        if (areaFilterId) {
            result = result.filter(t =>
                String(t.areaOfLifeId) === String(areaFilterId)
            );
        }

        // Context filter
        if (contextFilterId) {
            result = result.filter(t =>
                String(t.contextId) === String(contextFilterId)
            );
        }

        // Date range filter
        if (dateRange.start || dateRange.end) {
            result = result.filter(t => {
                if (!t.createdAt) return false;
                const taskDate = new Date(t.createdAt);

                if (dateRange.start && taskDate < new Date(dateRange.start)) {
                    return false;
                }
                if (dateRange.end && taskDate > new Date(dateRange.end)) {
                    return false;
                }
                return true;
            });
        }

        // Year and Month filter
        if (selectedYear || selectedMonth !== null) {
            result = result.filter(t => {
                if (!t.createdAt) return false;
                const taskDate = new Date(t.createdAt);
                const taskYear = taskDate.getFullYear();
                const taskMonth = taskDate.getMonth();

                if (selectedYear && taskYear !== selectedYear) {
                    return false;
                }
                if (selectedMonth !== null && taskMonth !== selectedMonth) {
                    return false;
                }
                return true;
            });
        }

        return result;
    }, [tasks, searchQuery, projectFilterId, areaFilterId, contextFilterId, dateRange, selectedYear, selectedMonth]);

    // Group tasks by area
    const groupedTasks = useMemo(() => {
        if (groupBy !== "area") return [];

        const grouped = areas.map(area => ({
            area,
            tasks: filteredTasks.filter(task => task.areaOfLifeId === area.id)
        }));

        // Add tasks with no area
        const noAreaTasks = filteredTasks.filter(task => !task.areaOfLifeId);
        if (noAreaTasks.length > 0) {
            grouped.push({
                area: null,
                tasks: noAreaTasks
            });
        }

        return grouped;
    }, [filteredTasks, areas, groupBy]);

    // Handler functions
    const handleRestore = (taskId) => {
        updateTask(taskId, { status: "NEXT_ACTION" });
        setCelebratingTaskId(taskId);
        setTimeout(() => setCelebratingTaskId(null), 2000);
    };

    const handleDelete = (taskId) => {
        if (confirm("Permanently delete this task? This cannot be undone.")) {
            deleteTask(taskId);
        }
    };

    // Conditional rendering after all hooks
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState error={error} />;

    return (
        <>
            <PageHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search archived tasks..."
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                groupByOptions={[
                    { value: "area", label: "Area of Life", icon: "users" },
                ]}
                defaultViewLabel="Table view"
                showStatsButton={true}
                tasksCount={filteredTasks.length}
                middleContent={
                    <DateFilter
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        onYearChange={setSelectedYear}
                        onMonthChange={setSelectedMonth}
                    />
                }
            />

            {viewMode === "stats" ? (
                <ArchiveStatsView
                    tasks={filteredTasks}
                    areas={areas}
                />
            ) : viewMode === "grouped" ? (
                <ArchiveGroupedView
                    groupedTasks={groupedTasks}
                    groupBy={groupBy}
                    areas={areas}
                    projects={projects}
                    contexts={contexts}
                    filteredTasks={filteredTasks}
                    onRestore={handleRestore}
                    onDelete={handleDelete}
                    celebratingTaskId={celebratingTaskId}
                />
            ) : (
                <ArchiveTableView
                    tasks={filteredTasks}
                    areas={areas}
                    projects={projects}
                    contexts={contexts}
                    searchQuery={searchQuery}
                    celebratingTaskId={celebratingTaskId}
                    projectFilterId={projectFilterId}
                    areaFilterId={areaFilterId}
                    onProjectFilterChange={setProjectFilterId}
                    onAreaFilterChange={setAreaFilterId}
                    onRestore={handleRestore}
                    onDelete={handleDelete}
                />
            )}
        </>
    );
}
