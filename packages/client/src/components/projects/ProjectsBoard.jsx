import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useProjects } from "../../hooks/useProjects";
import { useAreas } from "../../hooks/useAreas";
import { useTasks } from "../../hooks/useTasks";
import { useSearch } from "../../hooks/useSearch";
import { bulkUpdateProjectsOrder } from "../../api/projectsApi";
import ProjectCard from "../UI/ProjectCard";
import ProjectsHeader from "./ProjectsHeader";
import ProjectsGridView from "./ProjectsGridView";
import ProjectsGroupedView from "./ProjectsGroupedView";
import NewProjectModal from "./NewProjectModal";
import LoadingState from "../UI/LoadingState";
import ErrorState from "../UI/ErrorState";

export default function ProjectsBoard() {
    const navigate = useNavigate();
    const { projects, isLoading, isError, error, createProject, updateProject, deleteProject } = useProjects();
    const { areas, isLoading: areasLoading } = useAreas();
    const { tasks: nextActions, isLoading: tasksLoading } = useTasks("NEXT_ACTION");
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeId, setActiveId] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "grouped"
    const [groupBy, setGroupBy] = useState("area"); // "area" (future: "project", "context")

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const filteredProjects = useSearch(projects, searchQuery, ['name', 'areaOfLife.name']);

    // Group projects by area
    const groupedProjects = useMemo(() => {
        const groups = [];

        // Create a group for each area
        areas.forEach(area => {
            groups.push({
                area,
                projects: filteredProjects.filter(project => project.areaOfLifeId === area.id)
            });
        });

        // Add General group (no area)
        groups.push({
            area: null,
            projects: filteredProjects.filter(project => project.areaOfLifeId === null)
        });

        return groups;
    }, [filteredProjects, areas]);

    function handleCreateProject(data) {
        createProject(data.name, data.outcome, data.areaOfLifeId);
    }

    function startEditing(project) {
        setEditingProject(project);
        setShowEditProjectModal(true);
    }

    function handleUpdateProject(data) {
        if (editingProject) {
            updateProject(editingProject.id, {
                name: data.name,
                outcome: data.outcome,
                areaOfLifeId: data.areaOfLifeId
            });
            setEditingProject(null);
        }
    }

    function handleDeleteProject(project) {
        const message = `Are you sure you want to delete the project "${project.name}"?`;

        if (confirm(message)) {
            deleteProject(project.id);
        }
    }

    function handleProjectClick(project) {
        navigate(`/app/projects/${project.id}`);
    }

    function handleDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const activeProject = projects.find(p => p.id === active.id);
        if (!activeProject) return;

        const overProject = projects.find(p => p.id === over.id);

        // In grouped view, allow changing area
        if (viewMode === "grouped" && overProject) {
            const activeAreaId = activeProject.areaOfLifeId;
            const overAreaId = overProject.areaOfLifeId;

            // If dragging to a different area
            if (activeAreaId !== overAreaId) {
                // Update the project's area
                updateProject(active.id, {
                    areaOfLifeId: overAreaId,
                    sortOrder: overProject.sortOrder
                });
                return;
            }
        }

        // Standard reordering within same area/grid
        const oldIndex = projects.findIndex(p => p.id === active.id);
        const newIndex = projects.findIndex(p => p.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reorderedProjects = arrayMove(projects, oldIndex, newIndex);
        const updates = reorderedProjects.map((project, index) => ({
            id: project.id,
            sortOrder: index,
        }));

        bulkUpdateProjectsOrder(updates).catch(console.error);

        // Optimistic update via React Query invalidation
        updates.forEach(update => {
            updateProject(update.id, { sortOrder: update.sortOrder });
        });
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    if (isLoading || areasLoading || tasksLoading) {
        return <LoadingState message="Loading projects..." />;
    }

    if (isError) {
        return <ErrorState message="Error loading projects" error={error} />;
    }

    const activeProject = activeId ? projects.find(p => p.id === activeId) : null;
    const projectIds = filteredProjects.map(p => p.id);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            {viewMode === "grouped" ? (
                <div className="my-10 ">
                    <ProjectsHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        groupBy={groupBy}
                        onGroupByChange={setGroupBy}
                        onAddProject={() => setShowNewProjectModal(true)}
                        isGroupedView={true}
                    />

                    {/* New Project Modal */}
                    <NewProjectModal
                        isOpen={showNewProjectModal}
                        onClose={() => setShowNewProjectModal(false)}
                        onSubmit={handleCreateProject}
                    />

                    {/* Edit Project Modal */}
                    <NewProjectModal
                        isOpen={showEditProjectModal}
                        onClose={() => {
                            setShowEditProjectModal(false);
                            setEditingProject(null);
                        }}
                        onSubmit={handleUpdateProject}
                        initialProject={editingProject}
                    />

                    <ProjectsGroupedView
                        groupedProjects={groupedProjects}
                        areas={areas}
                        filteredProjects={filteredProjects}
                        nextActions={nextActions}
                        handleProjectClick={handleProjectClick}
                        startEditing={startEditing}
                        handleDeleteProject={handleDeleteProject}
                    />
                </div>
            ) : (
                <div className="my-10 border border-black/10 dark:border-dark-border rounded-xl bg-white dark:bg-dark-surface p-6 shadow-sm ">
                    <ProjectsHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        groupBy={groupBy}
                        onGroupByChange={setGroupBy}
                        onAddProject={() => setShowNewProjectModal(true)}
                        isGroupedView={false}
                    />

                    {/* New Project Modal */}
                    <NewProjectModal
                        isOpen={showNewProjectModal}
                        onClose={() => setShowNewProjectModal(false)}
                        onSubmit={handleCreateProject}
                    />

                    {/* Edit Project Modal */}
                    <NewProjectModal
                        isOpen={showEditProjectModal}
                        onClose={() => {
                            setShowEditProjectModal(false);
                            setEditingProject(null);
                        }}
                        onSubmit={handleUpdateProject}
                        initialProject={editingProject}
                    />

                    <ProjectsGridView
                        searchQuery={searchQuery}
                        filteredProjects={filteredProjects}
                        projectIds={projectIds}
                        projects={projects}
                        nextActions={nextActions}
                        handleProjectClick={handleProjectClick}
                        startEditing={startEditing}
                        handleDeleteProject={handleDeleteProject}
                    />
                </div>
            )}

            <DragOverlay>
                {activeProject ? (
                    <div className="opacity-50">
                        <ProjectCard
                            name={activeProject.name}
                            areaOfLife={activeProject.areaOfLife}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
