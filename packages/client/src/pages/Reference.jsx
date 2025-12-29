import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReferenceBoard from "../components/reference/ReferenceBoard";
import FolderBoard from "../components/reference/folder/FolderBoard";
import ReferenceTutorial from "../components/reference/ReferenceTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";

export default function Reference() {
    const { folderId } = useParams();
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet (only on main reference page, not in folders)
    useEffect(() => {
        if (!folderId && !hasSeenTutorial('reference', user)) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user, folderId]);

    function handleTutorialComplete() {
        completeTutorial('reference', () => setShowTutorial(false));
    }

    // אם יש folderId בURL, נציג את FolderBoard
    if (folderId) {
        return (
            <section className="p-2">
                <div className="px-4">
                    <h1>Reference</h1>
                    <p> Keep important info organized and accessible.</p>
                </div>
                <FolderBoard />
            </section>
        );
    }

    // אחרת, נציג את ReferenceBoard
    return (
        <section className="p-2">
            <div className="px-4">
                <h1> Reference </h1>
                <p> Keep important info organized and accessible. </p>
            </div>

            <ReferenceBoard />

            <ReferenceTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
