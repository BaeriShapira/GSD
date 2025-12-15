import { useState, useEffect } from "react";
import WaitingForBoard from "../components/waiting_for/WaitingForBoard";
import WaitingForTutorial from "../components/waiting_for/WaitingForTutorial";
import { useAuth } from "../auth/AuthContext";

export default function WaitingFor() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        const hasSeenWaitingForTutorial = localStorage.getItem('hasSeenWaitingForTutorial');

        if (!hasSeenWaitingForTutorial) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        // Mark that user has completed the waiting for tutorial
        localStorage.setItem('hasSeenWaitingForTutorial', 'true');
        setShowTutorial(false);
        // Dispatch custom event to notify sidebar if needed
        window.dispatchEvent(new CustomEvent('tutorialCompleted', { detail: { tutorial: 'waitingFor' } }));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Waiting For</h1>
                <p>Things you're waiting on from others.</p>
            </div>
            <WaitingForBoard />

            <WaitingForTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
