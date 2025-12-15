import { useState, useEffect } from "react";
import ProcessBucketBoard from "../components/ProcessBucket/ProcessBucketBoard";
import ProcessBucketTutorial from "../components/ProcessBucket/ProcessBucketTutorial";
import { useAuth } from "../auth/AuthContext";


export default function ProcessBucket() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        const hasSeenProcessTutorial = localStorage.getItem('hasSeenProcessTutorial');

        if (!hasSeenProcessTutorial) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        // Mark that user has completed the process tutorial
        localStorage.setItem('hasSeenProcessTutorial', 'true');
        setShowTutorial(false);
        // Dispatch custom event to notify sidebar to show Reference badge
        window.dispatchEvent(new CustomEvent('tutorialCompleted', { detail: { tutorial: 'process' } }));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1> Process bucket  </h1>
                <p> Decide, for each item, whether it's actionable. If yes – define the next action. </p>
            </div>
            <ProcessBucketBoard />

            <ProcessBucketTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
