export default function OnboardingProgress({ currentStep, totalSteps }) {
    const percentage = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                    Step {currentStep + 1} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-purple-600">
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-purple-950 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
