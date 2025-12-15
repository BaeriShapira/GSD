import { useState, useEffect } from "react";
import ProcessBucketBoard from "../components/ProcessBucket/ProcessBucketBoard";
import ProcessBucketTutorial from "../components/ProcessBucket/ProcessBucketTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";


export default function ProcessBucket() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        if (!hasSeenTutorial('process', user)) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        completeTutorial('process', () => setShowTutorial(false));
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
