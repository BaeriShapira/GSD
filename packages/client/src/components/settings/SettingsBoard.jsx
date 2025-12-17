import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AreaOfResponsibilityCard from "./AreaOfResponsibilityCard";
import ContextCard from "./ContextCard";
import AreaOfLifeModal from "./AreaOfLifeModal";
import ContextModal from "./ContextModal";
import GoogleCalendarCard from "./GoogleCalendarCard";
import SettingsTutorial from "./SettingsTutorial";
import { useAreas } from "../../hooks/useAreas";
import { useContexts } from "../../hooks/useContexts";
import { useAuth } from "../../auth/AuthContext";
import { completeTutorial, hasSeenTutorial } from "../../utils/tutorialHelpers";

export default function SettingsBoard() {
    const { areas, isLoading, isError, error, createArea, updateArea, deleteArea } = useAreas();
    const { contexts, isLoading: contextsLoading, createContext, updateContext, deleteContext } = useContexts();
    const { user } = useAuth();

    const [showAreaModal, setShowAreaModal] = useState(false);
    const [editingArea, setEditingArea] = useState(null);

    const [showContextModal, setShowContextModal] = useState(false);
    const [editingContext, setEditingContext] = useState(null);

    const [showTutorial, setShowTutorial] = useState(false);

    // Auto-start tutorial for new users who just completed onboarding
    useEffect(() => {
        const hasCompletedOnboarding = user?.hasCompletedOnboarding === true;
        const hasSeenSettings = hasSeenTutorial('settings', user);

        console.log('🔍 SettingsBoard Tutorial Check:', {
            hasCompletedOnboarding,
            hasSeenSettings,
            userHasSeenSettingsTutorial: user?.hasSeenSettingsTutorial,
            shouldShowTutorial: hasCompletedOnboarding && !hasSeenSettings
        });

        if (hasCompletedOnboarding && !hasSeenSettings) {
            // Small delay to let the page render first
            console.log('✅ Auto-starting Settings tutorial...');
            setTimeout(() => setShowTutorial(true), 500);
        }
    }, [user]);

    function handleEditArea(area) {
        setEditingArea(area);
        setShowAreaModal(true);
    }

    function handleEditContext(context) {
        setEditingContext(context);
        setShowContextModal(true);
    }

    function handleAddArea() {
        setEditingArea(null);
        setShowAreaModal(true);
    }

    function handleAddContext() {
        setEditingContext(null);
        setShowContextModal(true);
    }

    function handleAreaSubmit(data) {
        if (editingArea) {
            updateArea(editingArea.id, data);
        } else {
            createArea(data);
        }
        setShowAreaModal(false);
        setEditingArea(null);
    }

    function handleContextSubmit(data) {
        if (editingContext) {
            updateContext(editingContext.id, data);
        } else {
            createContext(data);
        }
        setShowContextModal(false);
        setEditingContext(null);
    }

    function handleTutorialComplete() {
        completeTutorial('settings', () => setShowTutorial(false));
    }

    if (isLoading) {
        return (
            <div className="my-10 max-w-7xl">
                <div className="text-sm text-black/50">Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="my-10 max-w-7xl">
                <div className="text-sm text-red-500">Error: {error?.message}</div>
            </div>
        );
    }

    return (
        <>
            <div className="my-10 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
                {/* Areas of Life */}
                <div className="areas-section border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2>Areas of Life</h2>
                            <p>Define the key domains that shape your life</p>
                        </div>

                        <button
                            onClick={handleAddArea}
                            className="add-area-button flex items-center gap-1 text-sm text-black/60 hover:text-black transition-colors cursor-pointer"
                        >
                            <Plus size={16} />
                            Add
                        </button>
                    </div>
                    <div className="space-y-1">
                        {areas.length === 0 ? (
                            <div className="text-center py-8 text-black/40">
                                No areas yet. Click "Add" to create your first area of life.
                            </div>
                        ) : (
                            areas.map(area => (
                                <AreaOfResponsibilityCard
                                    key={area.id}
                                    area={area}
                                    onEdit={handleEditArea}
                                    onDelete={deleteArea}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Contexts */}
                <div className="contexts-section border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 >Contexts</h2>
                            <p>Define the contexts that guide your actions</p>
                        </div>

                        <button
                            onClick={handleAddContext}
                            className="add-context-button flex items-center gap-1 text-sm text-black/60 hover:text-black transition-colors cursor-pointer"
                        >
                            <Plus size={16} />
                            Add
                        </button>
                    </div>
                    <div className="space-y-1">
                        {contextsLoading ? (
                            <div className="text-center py-8 text-black/40">
                                Loading contexts...
                            </div>
                        ) : contexts.length === 0 ? (
                            <div className="text-center py-8 text-black/40">
                                No contexts yet. Click "Add" to create your first context.
                            </div>
                        ) : (
                            contexts.map(context => (
                                <ContextCard
                                    key={context.id}
                                    context={context}
                                    onEdit={handleEditContext}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Google Calendar Integration */}
                <GoogleCalendarCard />

                {/* Onboarding Tutorial */}
                <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2>Onboarding Tutorial</h2>
                            <p>Restart the tutorial to learn about GSD again</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const isMobile = window.matchMedia("(max-width: 425px)").matches;
                            const path = isMobile ? '/onboarding-mobile' : '/onboarding';
                            window.location.href = path;
                        }}
                        className="px-4 py-2 btn btn-primary"
                    >
                        Restart Tutorial
                    </button>
                </div>
            </div>

            <AreaOfLifeModal
                isOpen={showAreaModal}
                onClose={() => {
                    setShowAreaModal(false);
                    setEditingArea(null);
                }}
                onSubmit={handleAreaSubmit}
                onDelete={deleteArea}
                initialData={editingArea}
            />

            <ContextModal
                isOpen={showContextModal}
                onClose={() => {
                    setShowContextModal(false);
                    setEditingContext(null);
                }}
                onSubmit={handleContextSubmit}
                onDelete={deleteContext}
                initialData={editingContext}
            />

            <SettingsTutorial
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={handleTutorialComplete}
            />
        </>
    );
}
