import { useState, useEffect } from "react";
import NextActionsBoard from "../components/next_actions/NextActionsBoard";
import NextActionsTutorial from "../components/next_actions/NextActionsTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";

export default function NextActions() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        if (!hasSeenTutorial('nextActions', user)) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        completeTutorial('nextActions', () => setShowTutorial(false));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Next Actions</h1>
                <p>Your actionable next steps across all projects.</p>
            </div>
            <NextActionsBoard />

            <NextActionsTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
