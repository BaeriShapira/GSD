export default function WelcomeStep() {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <h1 className="  mb-6">Welcome to GSD!</h1>

            <p className="text-lg text-gray-700 mb-6">
                GSD (Get Shit Done) is your personal productivity system based on the GTD (Getting Things Done) methodology.
            </p>

            <p className="text-lg text-gray-700 mb-8">
                This quick tutorial will help you understand how to use GSD effectively to manage your tasks, projects, and goals.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                <p className="text-gray-800 italic">
                    "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and starting on the first one."
                </p>
                <p className="text-gray-600 mt-2">— Mark Twain</p>
            </div>

            <p className="text-gray-600">
                Let's get started with understanding the GTD methodology!
            </p>
        </div>
    );
}
