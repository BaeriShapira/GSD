import { useState, useEffect } from "react";
import NextActionsBoard from "../components/next_actions/NextActionsBoard";
import NextActionsTutorial from "../components/next_actions/NextActionsTutorial";
import { useAuth } from "../auth/AuthContext";

export default function NextActions() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        const hasSeenNextActionsTutorial = localStorage.getItem('hasSeenNextActionsTutorial');

        if (!hasSeenNextActionsTutorial) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        // Mark that user has completed the next actions tutorial
        localStorage.setItem('hasSeenNextActionsTutorial', 'true');
        setShowTutorial(false);
        // Dispatch custom event to notify sidebar if needed
        window.dispatchEvent(new CustomEvent('tutorialCompleted', { detail: { tutorial: 'nextActions' } }));
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
