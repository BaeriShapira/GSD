import { useState, useEffect } from "react";
import QuickCaptureBoard from "../components/bucket/QuickCaptureBoard";
import BucketTutorial from "../components/bucket/BucketTutorial";
import { useAuth } from "../auth/AuthContext";


export default function Bucket() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user completed settings but hasn't seen bucket tutorial
    useEffect(() => {
        const hasCompletedSettingsTutorial = localStorage.getItem('hasCompletedSettingsTutorial');
        const hasSeenBucketTutorial = localStorage.getItem('hasSeenBucketTutorial');

        if (hasCompletedSettingsTutorial && !hasSeenBucketTutorial) {
            // Mark that user has seen the bucket (removes the badge)
            localStorage.setItem('hasSeenBucketTutorial', 'true');
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        setShowTutorial(false);
        // Dispatch custom event to notify sidebar to show Process badge
        window.dispatchEvent(new CustomEvent('tutorialCompleted', { detail: { tutorial: 'bucket' } }));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1> Bucket </h1>
                <p> All unprocessed stuff that landed on your desk. </p>
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
