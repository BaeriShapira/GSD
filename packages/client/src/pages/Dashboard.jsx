import { useState, useEffect } from "react";
import DashboardBoard from "../components/dashboard/DashboardBoard";
import DashboardTutorial from "../components/dashboard/DashboardTutorial";
import { useAuth } from "../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../utils/tutorialHelpers";

export default function Dashboard() {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial if user hasn't seen it yet
    useEffect(() => {
        if (!hasSeenTutorial('dashboard', user)) {
            // Small delay to let the page render first
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleTutorialComplete() {
        completeTutorial('dashboard', () => setShowTutorial(false));
    }

    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Dashboard</h1>
                <p>Your daily and weekly action items at a glance.</p>
            </div>
            <DashboardBoard />

            <DashboardTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </section>
    );
}
