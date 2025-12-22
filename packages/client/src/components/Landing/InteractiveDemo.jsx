import { useState } from "react";
import { BsBucketFill } from "react-icons/bs";
import { PiRocketLaunchFill } from "react-icons/pi";
import { PiTargetBold } from "react-icons/pi";
import { GrTasks } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { FaLightbulb, FaFolder, FaClock } from "react-icons/fa";
import CaptureDemo from "./demos/CaptureDemo";
import ProcessDemo from "./demos/ProcessDemo";
import NextActionsDemo from "./demos/NextActionsDemo";
import ProjectsDemo from "./demos/ProjectsDemo";
import SomedayDemo from "./demos/SomedayDemo";
import ReferenceDemo from "./demos/ReferenceDemo";
import WaitingForDemo from "./demos/WaitingForDemo";
import DashboardDemo from "./demos/DashboardDemo";

export default function InteractiveDemo() {
    const [activeTab, setActiveTab] = useState("capture");

    const tabs = [
        {
            id: "capture",
            label: "Capture everything.",
            icon: BsBucketFill,
        },
        {
            id: "process",
            label: "Easily process.",
            icon: PiRocketLaunchFill,
        },
        {
            id: "actions",
            label: "Next actions.",
            icon: PiTargetBold,
        },
        {
            id: "projects",
            label: "Manage projects.",
            icon: GrTasks,
        },
        {
            id: "waiting",
            label: "Waiting for.",
            icon: FaClock,
        },
        {
            id: "someday",
            label: "Someday/Maybe.",
            icon: FaLightbulb,
        },
        {
            id: "reference",
            label: "Reference files.",
            icon: FaFolder,
        },
        {
            id: "dashboard",
            label: "Daily dashboard.",
            icon: MdDashboard,
        },
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Interactive tabs */}
                    <div className="space-y-2.5">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-5 py-3 rounded-full text-left
                                        transition-all duration-200 cursor-pointer
                                        ${isActive
                                            ? "bg-purple-100 text-purple-900"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }
                                    `}
                                >
                                    <Icon className="text-xl flex-shrink-0" />
                                    <span className="text-base font-semibold">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right side - Demo content */}
                    <div className="bg-gray-50 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                        {activeTab === "capture" && <CaptureDemo />}
                        {activeTab === "process" && <ProcessDemo />}
                        {activeTab === "actions" && <NextActionsDemo />}
                        {activeTab === "projects" && <ProjectsDemo />}
                        {activeTab === "waiting" && <WaitingForDemo />}
                        {activeTab === "someday" && <SomedayDemo />}
                        {activeTab === "reference" && <ReferenceDemo />}
                        {activeTab === "dashboard" && <DashboardDemo />}
                    </div>
                </div>
            </div>
        </section>
    );
}
