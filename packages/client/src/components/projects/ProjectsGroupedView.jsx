import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableProjectCard from "./SortableProjectCard";
import { colorClasses500 } from "../../config/areaColors";

export default function ProjectsGroupedView({
    groupedProjects,
    areas,
    filteredProjects,
    nextActions,
    handleProjectClick,
    startEditing,
    handleDeleteProject
}) {
    return (
        <div className="columns-1 md:columns-2 gap-6 space-y-6 md:space-y-0">
            {groupedProjects.map(group => {
                const areaId = group.area?.id || 'none';
                const areaName = group.area?.name || 'General';
                const colors = group.area?.color || "white";
                const projectIds = group.projects.map(p => p.id);

                return (
                    <div
                        key={areaId}
                        className="border border-black/10 bg-white rounded-xl shadow-sm break-inside-avoid mb-6"
                    >
                        {/* Area Header */}
                        <div className="flex p-4">
                            <div className={`w-1 h-6 rounded-full m-1 shrink-0 ${colorClasses500[colors] || "bg-gray-400"}`} />
                            <h3 className="text-black/40 pl-2">{areaName}</h3>
                        </div>

                        {/* Projects in this Area */}
                        <div className="px-4 pb-6">
                            {group.projects.length > 0 ? (
                                <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-2">
                                        {group.projects.map(project => (
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
                                <div className="text-center py-8 text-sm text-gray-400">
                                    No items
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Empty State - only show if NO areas exist */}
            {areas.length === 0 && filteredProjects.length === 0 && (
                <div className="text-center py-16">
                    <h2>No active projects</h2>
                    <p className="text-black/50 text-sm">
                        A project is any goal that requires more than two actions to complete.
                    </p>
                </div>
            )}
        </div>
    );
}
