import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableProjectCard from "./SortableProjectCard";

export default function ProjectsGridView({
    searchQuery,
    filteredProjects,
    projectIds,
    projects,
    nextActions,
    handleProjectClick,
    startEditing,
    handleDeleteProject
}) {
    const isSearching = searchQuery.length > 0;

    return (
        <>
            {/* Search Results */}
            {isSearching ? (
                <>
                    <div className="mb-4 text-sm text-black/60">
                        Found {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                    </div>

                    {filteredProjects.length > 0 ? (
                        <SortableContext items={projectIds} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProjects.map(project => (
                                    <SortableProjectCard
                                        key={project.id}
                                        project={project}
                                        nextActions={nextActions}
                                        onClick={() => handleProjectClick(project)}
                                        onEdit={() => startEditing(project)}
                                        onDelete={() => handleDeleteProject(project)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-lg text-gray-600">No results found</h3>
                            <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Projects Grid */}
                    <SortableContext items={projectIds} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProjects.map((project) => (
                                <SortableProjectCard
                                    key={project.id}
                                    project={project}
                                    nextActions={nextActions}
                                    onClick={() => handleProjectClick(project)}
                                    onEdit={() => startEditing(project)}
                                    onDelete={() => handleDeleteProject(project)}
                                />
                            ))}
                        </div>
                    </SortableContext>

                    {/* Empty State */}
                    {projects.length === 0 && (
                        <div className="text-center py-16">
                            <h2>No active projects</h2>
                            <p className="text-black/50 text-sm">
                                A project is any goal that requires more than two actions to complete.
                            </p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
