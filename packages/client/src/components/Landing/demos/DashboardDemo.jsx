import { Star } from "lucide-react";

export default function DashboardDemo() {
    const unscheduledTasks = [
        {
            id: 1,
            text: "Chase my yom",
            project: "Outdoor Skills",
            urgency: 3,
            areaColor: "bg-blue-400"
        },
        {
            id: 2,
            text: "Practice silent stalking",
            project: null,
            urgency: 2,
            areaColor: "bg-green-400"
        }
    ];

    const scheduledItems = [
        {
            id: 1,
            type: "timeblock",
            title: "Morning nap session",
            startTime: "09:00",
            endTime: "11:00",
            areaName: "Rest & Recovery",
            bgColor: "bg-purple-500"
        },
        {
            id: 2,
            type: "task",
            text: "Knock over the milk",
            time: "12:00",
            project: "Kitchen dominance",
            urgency: 1,
            areaColor: "bg-green-400"
        },
        {
            id: 3,
            type: "timeblock",
            title: "Bird watching time",
            startTime: "14:00",
            endTime: "16:00",
            areaName: "Entertainment",
            bgColor: "bg-yellow-500"
        }
    ];

    const getUrgencyStars = (urgency = 0) => {
        if (!urgency) return null;
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < urgency ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Daily Dashboard
                </h3>
                <p className="text-gray-600">
                    Plan your day with tasks and time blocks. See everything you need to do in one place.
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Unscheduled Tasks */}
                <div>
                    <h4 className="text-sm font-semibold text-black/60 mb-3 uppercase tracking-wider">
                        Unscheduled
                    </h4>
                    <div className="space-y-2">
                        {unscheduledTasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-gray-100 rounded-lg flex items-center gap-3 p-3 hover:bg-gray-200 transition-colors"
                            >
                                {/* Color Bar */}
                                <div className={`w-1 h-12 rounded-full ${task.areaColor}`} />

                                {/* Task Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-black/90">
                                        {task.text}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {task.project && (
                                            <span className="text-sm text-gray-500">
                                                {task.project}
                                            </span>
                                        )}
                                        {getUrgencyStars(task.urgency)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheduled Items */}
                <div>
                    <h4 className="text-sm font-semibold text-black/60 mb-3 uppercase tracking-wider">
                        Schedule
                    </h4>
                    <div className="space-y-2">
                        {scheduledItems.map((item) => (
                            item.type === "timeblock" ? (
                                <div
                                    key={item.id}
                                    className={`${item.bgColor} rounded-lg flex items-center gap-3 p-4 transition-colors min-h-[100px]`}
                                >
                                    <div className="flex-1 pl-2">
                                        <h3 className="font-medium text-gray-900">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-800">
                                                {item.areaName}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-800 font-medium">
                                        {item.startTime}-{item.endTime}
                                    </p>
                                </div>
                            ) : (
                                <div
                                    key={item.id}
                                    className="bg-gray-100 rounded-lg flex items-center gap-3 p-3 hover:bg-gray-200 transition-colors"
                                >
                                    {/* Color Bar */}
                                    <div className={`w-1 h-12 rounded-full ${item.areaColor}`} />

                                    {/* Task Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-black/90">
                                            {item.text}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {item.project && (
                                                <span className="text-sm text-gray-500">
                                                    {item.project}
                                                </span>
                                            )}
                                            {getUrgencyStars(item.urgency)}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <span className="text-sm text-gray-600 font-medium">
                                        {item.time}
                                    </span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
