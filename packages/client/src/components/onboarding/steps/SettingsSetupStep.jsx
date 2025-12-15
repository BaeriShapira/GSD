export default function SettingsSetupStep() {
    const defaultAreas = [
        { name: "Personal Growth", color: "purple", icon: "🌱" },
        { name: "Career", color: "blue", icon: "💼" },
        { name: "Finances", color: "green", icon: "💰" },
        { name: "Relationships", color: "pink", icon: "❤️" }
    ];

    const defaultContexts = [
        { name: "Phone", icon: "📱", type: "tool" },
        { name: "Office", icon: "🏢", type: "location" },
        { name: "Errands", icon: "🚗", type: "location" },
        { name: "Shopping", icon: "🛒", type: "location" }
    ];

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Your Settings Are Ready!</h1>

            <p className="text-lg text-gray-700 mb-8 text-center">
                We've created some default Areas of Life and Contexts to get you started. You can customize these later in Settings.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Areas of Life */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Areas of Life</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Group your projects by different life areas
                    </p>
                    <div className="space-y-2">
                        {defaultAreas.map((area) => (
                            <div
                                key={area.name}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                            >
                                <span className="text-2xl">{area.icon}</span>
                                <span className="font-medium">{area.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contexts */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Contexts</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Tag actions by location or tool needed
                    </p>
                    <div className="space-y-2">
                        {defaultContexts.map((context) => (
                            <div
                                key={context.name}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                            >
                                <span className="text-2xl">{context.icon}</span>
                                <div>
                                    <span className="font-medium">{context.name}</span>
                                    <span className="text-gray-500 text-xs ml-2">({context.type})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-gray-700">
                    💡 You can add, edit, or delete these anytime in <strong>Settings</strong>
                </p>
            </div>
        </div>
    );
}
