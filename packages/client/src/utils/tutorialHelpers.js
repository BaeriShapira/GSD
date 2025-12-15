import { apiCompleteTutorial } from "../api/authApi";

/**
 * Mark tutorial as completed both on server and localStorage
 * @param {string} tutorialName - Name of the tutorial (settings, bucket, process, etc.)
 * @param {Function} onComplete - Optional callback to run after completion
 */
export async function completeTutorial(tutorialName, onComplete) {
    try {
        // Save to server
        await apiCompleteTutorial(tutorialName);

        // Also save to localStorage for immediate UI update
        const storageKey = getTutorialStorageKey(tutorialName);
        localStorage.setItem(storageKey, 'true');

        // Dispatch custom event to notify sidebar to update badges
        window.dispatchEvent(new CustomEvent('tutorialCompleted', {
            detail: { tutorial: tutorialName }
        }));

        // Run callback if provided
        if (onComplete) {
            onComplete();
        }
    } catch (error) {
        console.error('Failed to save tutorial completion:', error);

        // Still save locally even if server fails
        const storageKey = getTutorialStorageKey(tutorialName);
        localStorage.setItem(storageKey, 'true');

        window.dispatchEvent(new CustomEvent('tutorialCompleted', {
            detail: { tutorial: tutorialName }
        }));

        if (onComplete) {
            onComplete();
        }
    }
}

/**
 * Check if user has seen a tutorial (checks both localStorage and user object)
 * @param {string} tutorialName - Name of the tutorial
 * @param {Object} user - User object from AuthContext
 * @returns {boolean} - True if user has seen the tutorial
 */
export function hasSeenTutorial(tutorialName, user) {
    const storageKey = getTutorialStorageKey(tutorialName);
    const hasSeenLocally = localStorage.getItem(storageKey) === 'true';
    const userField = getTutorialUserField(tutorialName);
    const hasSeenServer = user?.[userField] === true;

    return hasSeenLocally || hasSeenServer;
}

/**
 * Get localStorage key for a tutorial
 */
function getTutorialStorageKey(tutorialName) {
    const keyMap = {
        'settings': 'hasCompletedSettingsTutorial',
        'bucket': 'hasSeenBucketTutorial',
        'process': 'hasSeenProcessTutorial',
        'reference': 'hasSeenReferenceTutorial',
        'someday': 'hasSeenSomedayTutorial',
        'projects': 'hasSeenProjectsTutorial',
        'waitingFor': 'hasSeenWaitingForTutorial',
        'nextActions': 'hasSeenNextActionsTutorial',
        'dashboard': 'hasSeenDashboardTutorial',
    };

    return keyMap[tutorialName] || `hasSeen${tutorialName}Tutorial`;
}

/**
 * Get user object field name for a tutorial
 */
function getTutorialUserField(tutorialName) {
    const fieldMap = {
        'settings': 'hasSeenSettingsTutorial',
        'bucket': 'hasSeenBucketTutorial',
        'process': 'hasSeenProcessTutorial',
        'reference': 'hasSeenReferenceTutorial',
        'someday': 'hasSeenSomedayTutorial',
        'projects': 'hasSeenProjectsTutorial',
        'waitingFor': 'hasSeenWaitingForTutorial',
        'nextActions': 'hasSeenNextActionsTutorial',
        'dashboard': 'hasSeenDashboardTutorial',
    };

    return fieldMap[tutorialName] || `hasSeen${tutorialName}Tutorial`;
}
