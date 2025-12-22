import { useState } from "react";

export default function ProcessDemo() {
    const [step1, setStep1] = useState(null);
    const [step2, setStep2] = useState(null);
    const [currentItem] = useState("Chase my yom");

    const step2NotActionable = [
        { id: "reference", title: "Reference", desc: "Store it, just in case we need it." },
        { id: "someday", title: "Someday", desc: "Nice idea, but not for now." },
        { id: "trash", title: "Trash", desc: "Not useful, get it out of the way." },
    ];

    const step2Actionable = [
        { id: "next", title: "Next action", desc: "Single concrete step you can do." },
        { id: "project", title: "Project", desc: "Requires more than one action." },
        { id: "waiting", title: "Waiting for", desc: "You're waiting on someone else." },
    ];

    function handleStep1(choice) {
        setStep1(choice);
        setStep2(null);
    }

    function handleReset() {
        setStep1(null);
        setStep2(null);
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Process Your Items
                </h3>
                <p className="text-gray-600">
                    Walk through each captured item and decide what to do with it. The GTD method helps you make quick decisions.
                </p>
            </div>

            {/* Demo Board */}
            <div className="border border-black/10 rounded-xl bg-white p-6 shadow-sm">
                {/* Current Item */}
                <div className="mb-6 pb-4 border-b border-black/10">
                    <p className="text-sm text-black/50 mb-2">Processing (1 of 6):</p>
                    <h4 className="text-xl font-bold text-black">{currentItem}</h4>
                </div>

                {/* Step 1 */}
                <div className="mb-6">
                    <p className="mb-3 text-black">Step 1 – Is it actionable?</p>
                    <div className="grid gap-4 sm:grid-cols-2 max-w-xl mb-6">
                        <button
                            onClick={() => handleStep1("not-actionable")}
                            className={`rounded-xl border px-4 py-4 transition cursor-pointer text-left ${
                                step1 === "not-actionable"
                                    ? "border-black/70 bg-black/90"
                                    : "border-black/10 bg-white hover:bg-black/5 hover:border-black/40"
                            }`}
                        >
                            <div className={`text-sm font-semibold mb-1 ${step1 === "not-actionable" ? "text-white" : "text-black/80"}`}>
                                Not actionable
                            </div>
                            <div className={`text-xs ${step1 === "not-actionable" ? "text-white/80" : "text-black/60"}`}>
                                Reference, someday, trash.
                            </div>
                        </button>
                        <button
                            onClick={() => handleStep1("actionable")}
                            className={`rounded-xl border px-4 py-4 transition cursor-pointer text-left ${
                                step1 === "actionable"
                                    ? "border-black/70 bg-black/90"
                                    : "border-black/10 bg-white hover:bg-black/5 hover:border-black/40"
                            }`}
                        >
                            <div className={`text-sm font-semibold mb-1 ${step1 === "actionable" ? "text-white" : "text-black/80"}`}>
                                Actionable
                            </div>
                            <div className={`text-xs ${step1 === "actionable" ? "text-white/80" : "text-black/60"}`}>
                                Turn it into a task with a clear next action.
                            </div>
                        </button>
                    </div>
                </div>

                {/* Step 2 - Not Actionable */}
                {step1 === "not-actionable" && (
                    <div className="mb-6">
                        <p className="mb-3 text-black">Step 2 – What should we do with it?</p>
                        <div className="grid gap-4 sm:grid-cols-3 max-w-lg mb-6">
                            {step2NotActionable.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setStep2(option.id)}
                                    className={`rounded-xl border px-4 py-4 transition cursor-pointer text-left ${
                                        step2 === option.id
                                            ? "border-black/70 bg-black/90"
                                            : "border-black/10 bg-white hover:bg-black/5 hover:border-black/40"
                                    }`}
                                >
                                    <div className={`text-sm font-semibold mb-1 ${step2 === option.id ? "text-white" : "text-black/80"}`}>
                                        {option.title}
                                    </div>
                                    <div className={`text-xs ${step2 === option.id ? "text-white/80" : "text-black/60"}`}>
                                        {option.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2 - Actionable */}
                {step1 === "actionable" && (
                    <div className="mb-6">
                        <p className="mb-3 text-black">Step 2 – What kind of action item is it?</p>
                        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
                            {step2Actionable.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setStep2(option.id)}
                                    className={`rounded-xl border px-4 py-4 transition cursor-pointer text-left ${
                                        step2 === option.id
                                            ? "border-black/70 bg-black/90"
                                            : "border-black/10 bg-white hover:bg-black/5 hover:border-black/40"
                                    }`}
                                >
                                    <div className={`text-sm font-semibold mb-1 ${step2 === option.id ? "text-white" : "text-black/80"}`}>
                                        {option.title}
                                    </div>
                                    <div className={`text-xs ${step2 === option.id ? "text-white/80" : "text-black/60"}`}>
                                        {option.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-black/10">
                    <button
                        onClick={handleReset}
                        className="btn-secondary"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}
