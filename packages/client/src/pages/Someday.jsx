import { useState, useEffect } from "react";
import SomedayBoard from "../components/someday/SomedayBoard";
import SomedayTutorial from "../components/someday/SomedayTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";


export default function Someday() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        if (!hasSeenTutorial('someday', user)) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        completeTutorial('someday', () => setShowTutorial(false));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Someday / Maybe</h1>
                <p className="dark:text-dark-text-secondary">Ideas and things you might want to do in the future.</p>
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
