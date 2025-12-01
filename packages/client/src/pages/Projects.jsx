import { useParams } from "react-router-dom";
import ProjectsBoard from "../components/projects/ProjectsBoard";
import ProjectBoard from "../components/projects/project/ProjectBoard";

export default function Projects() {
    const { projectId } = useParams();

    // If projectId exists in URL, show ProjectBoard
    if (projectId) {
        return (
            <section className="p-2">
                <div className="px-4">
                    <h1>Projects</h1>
                    <p>Manage your multi-step outcomes and track progress.</p>
                </div>
                <ProjectBoard />
            </section>
        );
    }

    // Otherwise, show ProjectsBoard
    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Projects</h1>
                <p>Manage your multi-step outcomes and track progress.</p>
            </div>

            <ProjectsBoard />
        </section>
    );
}
