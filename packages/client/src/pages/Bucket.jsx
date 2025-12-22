import { useState, useEffect } from "react";
import QuickCaptureBoard from "../components/bucket/QuickCaptureBoard";
import BucketTutorial from "../components/bucket/BucketTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";


export default function Bucket() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user completed settings but hasn't seen bucket tutorial
    useEffect(() => {
        const hasCompletedSettings = hasSeenTutorial('settings', user);
        const hasSeenBucket = hasSeenTutorial('bucket', user);

        if (hasCompletedSettings && !hasSeenBucket) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        completeTutorial('bucket', () => setShowTutorial(false));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1> Bucket </h1>
                <p className="dark:text-dark-text-secondary"> All unprocessed stuff that landed on your desk. </p>
            </div>
            <QuickCaptureBoard />

            <BucketTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
