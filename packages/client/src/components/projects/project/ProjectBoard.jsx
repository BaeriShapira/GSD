import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjects } from "../../../hooks/useProjects";
import { useTasks } from "../../../hooks/useTasks";
import { ArrowLeft } from "lucide-react";
import { BsFolderFill } from "react-icons/bs";
import { PiTargetBold } from "react-icons/pi";
import { MdHourglassBottom } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";

import ProjectNextActions from "./ProjectNextActions";
import ProjectReference from "./ProjectReference";
import ProjectNotes from "./ProjectNotes";
import ProjectWaitingFor from "./ProjectWaitingFor";
import NewProjectModal from "../NewProjectModal";

import LoadingState from "../../UI/LoadingState";
import ErrorState from "../../UI/ErrorState";
import DropdownMenu from "../../UI/DropdownMenu";

export default function ProjectBoard() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { projects, isLoading, isError, error, updateProject, deleteProject } = useProjects();
    const { tasks: nextActions } = useTasks("NEXT_ACTION");
    const [showEditModal, setShowEditModal] = useState(false);

    const currentProjectId = Number(projectId);
    const project = projects.find(p => p.id === currentProjectId);

    // Count open actions for this project
    const openActionsCount = nextActions.filter(task => task.projectId === currentProjectId).length;

    function handleEdit() {
        setShowEditModal(true);
    }

    function handleUpdateProject(data) {
        updateProject(currentProjectId, {
            name: data.name,
            outcome: data.outcome,
            areaOfLifeId: data.areaOfLifeId
        });
        setShowEditModal(false);
    }

    function handleDelete() {
        const message = `Are you sure you want to delete the project "${project.name}"?\n\nThis will also delete all associated tasks, waiting for items, and references.`;

        if (confirm(message)) {
            deleteProject(currentProjectId);
            navigate("/app/projects");
        }
    }

    if (isLoading) {
        return <LoadingState message="Loading project..." />;
    }

    if (isError) {
        return <ErrorState message="Error loading project" error={error} />;
    }

    if (!project) {
        return (
            <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <div className="text-sm text-red-500">Project not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="my-10 border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <button
                        onClick={() => navigate("/app/projects")}
                        className="p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} className="text-black/60" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h2>{project.name}</h2>

                                {project.outcome && (
                                    <div className="mt-2 bg-amber-300 w-fit">
                                        <span className="font-semibold text-black/80 pl-2">Ideal Outcome: </span>
                                        <span className="text-black/80 pr-2">{project.outcome}</span>
                                    </div>
                                )}
                            </div>
                            <DropdownMenu
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                editLabel="Edit project"
                                deleteLabel="Delete project"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Project Modal */}
            <NewProjectModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleUpdateProject}
                initialProject={project}
            />

            {/* Next Actions Card - Full Width */}
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <PiTargetBold className="text-xl" />
                    <h3>Next Actions</h3>
                </div>

                <ProjectNextActions projectId={currentProjectId} />
            </div>


            {/* Waiting For Card - Full Width */}
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <MdHourglassBottom className="text-xl" />
                    <h3>Waiting For</h3>
                </div>

                <ProjectWaitingFor projectId={currentProjectId} />
            </div>

            {/* Notes and Reference - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notes Card */}
                <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <FaNoteSticky className="text-xl" />
                        <h3>Notes</h3>
                    </div>
                    <ProjectNotes project={project} />
                </div>

                {/* Reference Card */}
                <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <BsFolderFill className="text-xl" />
                        <h3>Reference</h3>
                    </div>
                    <ProjectReference projectId={currentProjectId} />
                </div>
            </div>
        </div >
    );
}
