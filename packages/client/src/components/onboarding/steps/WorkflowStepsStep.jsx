import { BsBucketFill, BsFolderFill } from "react-icons/bs";
import { GrTasks } from "react-icons/gr";
import { MdHourglassBottom, MdDashboard } from "react-icons/md";
import { PiTargetBold } from "react-icons/pi";
import { IoIosRocket } from "react-icons/io";

export default function WorkflowStepsStep() {
    const steps = [
        {
            number: 1,
            title: "Capture",
            description: "Collect everything that has your attention into the Bucket",
            icon: <BsBucketFill />,
        },
        {
            number: 2,
            title: "Clarify",
            description: "Process what it means - is it actionable? What's the next action?",
            icon: <IoIosRocket />,
        },
        {
            number: 3,
            title: "Organize",
            description: "Put items where they belong - Projects, Next Actions, Waiting For, Someday, or Reference",
            icon: <GrTasks />,
        },
        {
            number: 4,
            title: "Reflect",
            description: "Review regularly to stay on track with your Weekly Review",
            icon: <MdDashboard />,
        },
        {
            number: 5,
            title: "Engage",
            description: "Do the work with confidence, knowing you're working on the right things",
            icon: <PiTargetBold />,
        }
    ];

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className=" mb-6 text-center">The 5 GTD Workflow Steps</h1>

            <p className="text-lg text-gray-700 mb-8 text-center">
                These five steps form the core of the GTD methodology
            </p>

            <div className="space-y-4">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">{step.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h2>{step.title}</h2>
                                </div>
                                <p className="text-gray-700">{step.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
