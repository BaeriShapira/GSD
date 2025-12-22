import CatThinking from "../../assets/CAT_THINKING_TOMUCH.svg";

export default function GTDSection() {
    return (
        <div className="relative z-10 -mt-1.5 py-12 md:py-18 px-2 md:px-4 bg-gradient-to-br from-purple-950 via-purple-950 to-indigo-900 dark:from-purple-950 dark:via-purple-950 dark:to-indigo-950">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left side - Text content */}
                    <div className="py-2 space-y-3 text-center md:text-left order-2 md:order-1 md:pl-0">                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                        Overwhelmed by tasks, projects, and information you need to remember throughout the day?
                    </h2>

                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                            <span className="text-yellow-400">It's time to get shit done!</span>
                        </p>

                        <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                            Based on the famous productivity method by David Allen - GTD
                        </p>
                    </div>

                    {/* Right side - Cat illustration */}
                    <div className="relative flex justify-center items-center order-1 md:order-2">
                        <div className="w-64 h-48 sm:w-80 sm:h-60 md:w-100 md:h-80 lg:w-150 lg:h-110">
                            <img src={CatThinking} alt="Cat thinking" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
