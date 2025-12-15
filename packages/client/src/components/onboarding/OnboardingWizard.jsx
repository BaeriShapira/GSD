import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCompleteOnboarding, apiGetMe } from "../../api/authApi";
import { useAuth } from "../../auth/AuthContext";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingNavigation from "./OnboardingNavigation";
import WelcomeStep from "./steps/WelcomeStep";
import GTDOverviewStep from "./steps/GTDOverviewStep";
import WorkflowStepsStep from "./steps/WorkflowStepsStep";
import WeeklyReviewStep from "./steps/WeeklyReviewStep";

const STEPS = [
    { component: WelcomeStep },
    { component: GTDOverviewStep },
    { component: WorkflowStepsStep },
    { component: WeeklyReviewStep },
];

export default function OnboardingWizard() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    const CurrentStepComponent = STEPS[currentStepIndex].component;

    const handleNext = () => {
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleFinish = async () => {
        try {
            await apiCompleteOnboarding();
            // Refresh user data from server to get updated hasCompletedOnboarding
            const freshUser = await apiGetMe();
            updateUser(freshUser);
            navigate("/app/settings");
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
        }
    };

    const handleSkip = async () => {
        try {
            await apiCompleteOnboarding();
            // Refresh user data from server to get updated hasCompletedOnboarding
            const freshUser = await apiGetMe();
            updateUser(freshUser);
            navigate("/app/settings");
        } catch (error) {
            console.error("Failed to skip onboarding:", error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <OnboardingProgress
                    currentStep={currentStepIndex}
                    totalSteps={STEPS.length}
                />

                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <CurrentStepComponent />
                </div>

                <OnboardingNavigation
                    currentStep={currentStepIndex}
                    totalSteps={STEPS.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSkip={handleSkip}
                    onFinish={handleFinish}
                    isLastStep={currentStepIndex === STEPS.length - 1}
                />
            </div>
        </div>
    );
}
