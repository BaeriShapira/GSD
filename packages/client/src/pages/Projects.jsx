import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectsBoard from "../components/projects/ProjectsBoard";
import ProjectBoard from "../components/projects/project/ProjectBoard";
import ProjectsTutorial from "../components/projects/ProjectsTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";

export default function Projects() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet (only on main projects page, not in specific project)
    useEffect(() => {
        if (!projectId && !hasSeenTutorial('projects', user)) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user, projectId]);

    function handleTutorialComplete() {
        completeTutorial('projects', () => setShowTutorial(false));
    }

    // If projectId exists in URL, show ProjectBoard
    if (projectId) {
        return (
            <section className="p-2">
                <div className="px-4">
                    <h1>Projects</h1>
                    <p className="dark:text-dark-text-secondary">Manage your multi-step outcomes and track progress.</p>
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
                <p className="dark:text-dark-text-secondary">Manage your multi-step outcomes and track progress.</p>
            </div>

            <ProjectsBoard />

            <ProjectsTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
