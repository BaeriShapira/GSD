import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ReferenceTutorial({ isOpen, onClose, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            target: null,
            title: "Welcome to Reference!",
            content: "This is your personal filing system for information you might need later. Store documents, notes, links, and any reference material you want to keep organized.",
            placement: "center",
        },
        {
            target: ".reference-search",
            title: "Search Your Files",
            content: "Quickly find any reference item by searching for text, labels, or file names. Your entire reference library is searchable.",
            placement: "bottom",
            highlight: true,
        },
        {
            target: ".reference-add-folder",
            title: "Create Folders",
            content: "Organize your reference materials into folders. Create folders for different topics, projects, or categories that make sense for you.",
            placement: "left",
            highlight: true,
        },
        {
            target: ".reference-folders-grid",
            title: "Your Folder System",
            content: "Click on any folder to view its contents. You can edit folder names or delete folders from here.",
            placement: "top",
            highlight: true,
        },
        {
            target: null,
            title: "When to Use Reference",
            content: "Use Reference for information you don't need to act on but want to keep: receipts, manuals, articles, meeting notes, design mockups, or anything you might need to reference later.",
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
                            className="btn btn-primary px-4 py-2 text-sm font-medium text-white bg-purple-950 hover:bg-purple-900 transition-colors cursor-pointer"
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
