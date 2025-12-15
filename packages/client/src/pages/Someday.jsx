import { useState, useEffect } from "react";
import SomedayBoard from "../components/someday/SomedayBoard";
import SomedayTutorial from "../components/someday/SomedayTutorial";
import { useAuth } from "../auth/AuthContext";


export default function Someday() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        const hasSeenSomedayTutorial = localStorage.getItem('hasSeenSomedayTutorial');

        if (!hasSeenSomedayTutorial) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        // Mark that user has completed the someday tutorial
        localStorage.setItem('hasSeenSomedayTutorial', 'true');
        setShowTutorial(false);
        // Dispatch custom event to notify sidebar if needed
        window.dispatchEvent(new CustomEvent('tutorialCompleted', { detail: { tutorial: 'someday' } }));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Someday / Maybe</h1>
                <p>Ideas and things you might want to do in the future.</p>
            </div>
            <SomedayBoard />

            <SomedayTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
