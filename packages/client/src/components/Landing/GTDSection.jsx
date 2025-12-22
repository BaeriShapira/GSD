import CatThinking from "../../assets/CAT_THINKING_TOMUCH.svg";

export default function GTDSection() {
    return (
        <div className="relative z-10 -mt-1.5 py-18 px-4 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 dark:from-purple-950 dark:via-purple-900 dark:to-indigo-950">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left side - Text content */}
                    <div className="space-y-3">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                            Overwhelmed by tasks, projects, and information you need to remember throughout the day?
                        </h2>

                        <p className="text-4xl md:text-5xl font-extrabold leading-tight">
                            <span className="text-yellow-400">It's time to get shit done!</span>
                        </p>

                        <p className="text-lg text-gray-200 leading-relaxed">
                            Based on the famous productivity method by David Allen - GTD
                        </p>
                    </div>

                    {/* Right side - Cat illustration */}
                    <div className="relative flex justify-center items-center">
                        <div className="w-150 h-120">
                            <img src={CatThinking} alt="Cat thinking" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
