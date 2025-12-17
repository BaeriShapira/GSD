import { useState, useEffect } from "react";
import ArchiveBoard from "../components/archive/ArchiveBoard";
import ArchiveTutorial from "../components/archive/ArchiveTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";

export default function Archive() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        if (!hasSeenTutorial('archive', user)) {
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        completeTutorial('archive', () => setShowTutorial(false));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Archive</h1>
                <p>Your completed tasks and accomplishments.</p>
            </div>
            <ArchiveBoard />
            <ArchiveTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
