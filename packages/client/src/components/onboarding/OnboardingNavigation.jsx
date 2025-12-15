export default function OnboardingNavigation({
    currentStep,
    totalSteps,
    onPrevious,
    onNext,
    onSkip,
    onFinish,
    isLastStep
}) {
    return (
        <div className="mt-8 flex items-center justify-between">
            {/* Previous Button */}
            <button
                onClick={onPrevious}
                disabled={currentStep === 0}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-0 disabled:cursor-default"
            >
                ← Previous
            </button>

            {/* Skip Tutorial Button */}
            <button
                onClick={onSkip}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
                Skip Tutorial
            </button>

            {/* Next/Finish Button */}
            {isLastStep ? (
                <button
                    onClick={onFinish}
                    className="btn btn-primary px-8"
                >
                    Get Started →
                </button>
            ) : (
                <button
                    onClick={onNext}
                    className="btn btn-primary px-8"
                >
                    Next →
                </button>
            )}
        </div>
    );
}
