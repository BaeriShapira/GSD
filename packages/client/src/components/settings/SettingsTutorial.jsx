import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SettingsTutorial({ isOpen, onClose, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            target: ".areas-section",
            title: "Welcome to Settings!",
            content: "Let's set up your GTD system. First, we'll create your Areas of Life - the key domains that shape your life.",
            placement: "center",
        },
        {
            target: ".add-area-button",
            title: "Add Your First Area",
            content: "Click here to add your first Area of Life. For example: Personal Growth, Career, Health, or Relationships.",
            placement: "bottom",
            highlight: true,
        },
        {
            target: ".contexts-section",
            title: "Now Let's Add Contexts",
            content: "Contexts help you organize actions by location or tools needed. Examples: Phone, Office, Home, Computer.",
            placement: "center",
        },
        {
            target: ".add-context-button",
            title: "Add Your First Context",
            content: "Click here to add your first Context. Think about where or with what tools you usually work.",
            placement: "center",
            highlight: true,
        },
        {
            target: null,
            title: "You're All Set!",
            content: "You can always come back to Settings to add, edit, or delete Areas and Contexts. Now let's start Getting Things Done!",
            placement: "center",
        },
    ];

    const currentStepData = steps[currentStep];

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        onComplete();
        onClose();
    };

    if (!isOpen) return null;

    // Get position for the tooltip
    const getTooltipPosition = () => {
        if (!currentStepData.target) {
            return {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10001,
            };
        }

        const targetElement = document.querySelector(currentStepData.target);
        if (!targetElement) {
            return {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10001,
            };
        }

        const rect = targetElement.getBoundingClientRect();
        const style = {
            position: "fixed",
            zIndex: 10001,
        };

        // Special case for "Add Your First Context" step (step 3)
        if (currentStep === 3 && currentStepData.placement === "center") {
            return {
                position: "fixed",
                top: "50%",
                left: "70%", // Slightly right of center
                transform: "translate(-50%, -50%)",
                zIndex: 10001,
            };
        }

        switch (currentStepData.placement) {
            case "bottom":
                style.top = `${rect.bottom + 16}px`;
                style.left = `${rect.left + rect.width / 2}px`;
                style.transform = "translateX(-50%)";
                break;
            case "top":
                style.bottom = `${window.innerHeight - rect.top + 16}px`;
                style.left = `${rect.left + rect.width / 2}px`;
                style.transform = "translateX(-50%)";
                break;
            case "left":
                style.top = `${rect.top + rect.height / 2}px`;
                style.right = `${window.innerWidth - rect.left + 16}px`;
                style.transform = "translateY(-50%)";
                break;
            case "right":
                style.top = `${rect.top + rect.height / 2}px`;
                style.left = `${rect.right + 16}px`;
                style.transform = "translateY(-50%)";
                break;
            default: // center
                style.top = "50%";
                style.left = "50%";
                style.transform = "translate(-50%, -50%)";
        }

        return style;
    };

    // Get highlight position
    const getHighlightStyle = () => {
        if (!currentStepData.highlight || !currentStepData.target) return null;

        const targetElement = document.querySelector(currentStepData.target);
        if (!targetElement) return null;

        const rect = targetElement.getBoundingClientRect();
        return {
            position: "fixed",
            top: `${rect.top - 8}px`,
            left: `${rect.left - 8}px`,
            width: `${rect.width + 16}px`,
            height: `${rect.height + 16}px`,
            border: "3px solid #a855f7",
            borderRadius: "12px",
            pointerEvents: "none",
            zIndex: 10000,
            animation: "pulse 2s infinite",
        };
    };

    const tooltipStyle = getTooltipPosition();
    const highlightStyle = getHighlightStyle();

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-[9999]"
                onClick={handleSkip}
            />

            {/* Highlight */}
            {highlightStyle && (
                <div style={highlightStyle} />
            )}

            {/* Tooltip */}
            <div
                style={tooltipStyle}
                className="bg-white rounded-lg shadow-2xl p-6 max-w-md border border-gray-200"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                            {currentStepData.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Step {currentStep + 1} of {steps.length}
                        </p>
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-gray-700 mb-6">
                    {currentStepData.content}
                </p>

                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSkip}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        Skip Tutorial
                    </button>

                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="btn btn-primary px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Previous
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="btn btn-primary px-4 py-2 text-sm font-medium text-white bg-purple-950  hover:bg-purple-900 transition-colors cursor-pointer"
                        >
                            {currentStep === steps.length - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>

                {/* Progress dots */}
                <div className="flex gap-2 justify-center mt-4">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all ${index === currentStep
                                ? "w-8 bg-purple-950"
                                : "w-2 bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.02);
                    }
                }
            `}</style>
        </>
    );
}
