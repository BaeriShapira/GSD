import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Confetti from "react-confetti";

// Import step components
import ReviewSomeday from "../components/weeklyReview/ReviewSomeday";
import ReviewProjects from "../components/weeklyReview/ReviewProjects";
import ClearBucket from "../components/weeklyReview/ClearBucket";
import ProcessBucketStep from "../components/weeklyReview/ProcessBucketStep";
import WeeklyPlanning from "../components/weeklyReview/WeeklyPlanning";

const STEPS = [
    {
        id: 1,
        title: "Review Someday/Maybe",
        description: "Check your Someday list and move items to Bucket if ready",
        component: ReviewSomeday,
    },
    {
        id: 2,
        title: "Review Projects",
        description: "Review your projects and add new next actions to Bucket",
        component: ReviewProjects,
    },
    {
        id: 3,
        title: "Brain Dump to Bucket",
        description: "Clear your mind - add everything to Bucket",
        component: ClearBucket,
    },
    {
        id: 4,
        title: "Process Bucket",
        description: "Process all items in your Bucket",
        component: ProcessBucketStep,
    },
    {
        id: 5,
        title: "Weekly Planning",
        description: "Plan your week - set goals and schedule time blocks",
        component: WeeklyPlanning,
    },
];

export default function WeeklyReview() {
    const [currentStep, setCurrentStep] = useState(0);

    const isStarted = currentStep > 0;
    const isFinished = currentStep > STEPS.length;
    const CurrentStepComponent = isStarted && !isFinished ? STEPS[currentStep - 1].component : null;

    function handleStart() {
        setCurrentStep(1);
    }

    function handleNext() {
        if (currentStep <= STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    }

    function handleBack() {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    function handleSkip() {
        if (currentStep <= STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    }

    function handleRestart() {
        setCurrentStep(0);
    }

    // Finished screen
    if (isFinished) {
        return (
            <section className="p-2">
                <div className="px-4">
                    <h1>Weekly Review</h1>
                    <p>Congratulations! You've completed your Weekly Review</p>
                </div>

                <div className="my-10 max-w-4xl">
                    <div className="relative flex flex-col items-center justify-center py-20">
                        <Confetti
                            numberOfPieces={250}
                            recycle={false}
                            initialVelocityX={{ min: -10, max: 10 }}
                            initialVelocityY={{ min: -18, max: -30 }}
                            gravity={0.2}
                            confettiSource={{
                                x: window.innerWidth / 2 - 100,
                                y: window.innerHeight - 10,
                                w: 300,
                                h: 20,
                            }}
                            style={{
                                position: "fixed",
                                width: "100vw",
                                height: "100vh",
                                top: 0,
                                left: 0,
                                pointerEvents: "none",
                            }}
                        />

                        <h2 className="text-2xl font-bold text-black/80 mb-3">
                            Great job!
                        </h2>

                        <p className="text-black/50 text-sm mb-6 text-center max-w-md">
                            You've completed your Weekly Review. Your mind is clear, your system is organized, and you're ready to take on the week ahead!
                        </p>

                        <button
                            onClick={handleRestart}
                            className="btn btn-primary"
                        >
                            Start Another Review
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Start screen
    if (!isStarted) {
        return (
            <section className="p-2">
                <div className="px-4">
                    <h1>Weekly Review</h1>
                    <p>Take control of your week with Weekly Review</p>
                </div>

                <div className="my-10 max-w-4xl">
                    <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                        <h2>What is the Weekly Review?</h2>
                        <p className="text-black/60 mb-6">
                            The Weekly Review is your opportunity to step back, clear your mind,
                            and get organized for the week ahead. This guided process will walk
                            you through the essential steps to maintain clarity and control.
                        </p>

                        <div className="space-y-3 mb-6">
                            {STEPS.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="flex items-start gap-3 p-3 border border-black/10 rounded-lg"
                                >
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-purple-950 text-white flex items-center justify-center text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium">{step.title}</h3>
                                        <p className="text-xs text-black/60">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleStart}
                            className="btn btn-primary w-full flex items-center justify-center"
                        >
                            Start Weekly Review
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const currentStepData = STEPS[currentStep - 1];
    const progress = (currentStep / STEPS.length) * 100;

    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Weekly Review</h1>
                <p>Step {currentStep} of {STEPS.length} - {currentStepData.title}</p>
            </div>

            <div className="my-10 max-w-4xl">
                {/* Progress bar */}
                <div className="mb-6">
                    <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-purple-950 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step content */}
                <div className="mb-6">
                    {CurrentStepComponent && (
                        <CurrentStepComponent
                            onNext={handleNext}
                            onBack={handleBack}
                            onSkip={handleSkip}
                        />
                    )}
                </div>

                {/* Navigation footer */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="px-4 py-2 text-sm text-black/60 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        ← Back
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 text-sm text-black/60 hover:text-black transition-colors cursor-pointer"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleNext}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {currentStep === STEPS.length ? (
                                <>
                                    <CheckCircle2 size={16} />
                                    Finish
                                </>
                            ) : (
                                "Next →"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
