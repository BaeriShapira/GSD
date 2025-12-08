import FeatureItem from "./FeatureItem";
import { BsBucketFill, BsFolderFill } from "react-icons/bs";
import { PiTargetBold } from "react-icons/pi";
import { GrTasks } from "react-icons/gr";
import { MdHourglassBottom, MdDashboard } from "react-icons/md";
import { Trash2, Rocket } from "lucide-react";

export default function FeatureList() {
    const features = [
        { icon: <BsBucketFill />, text: "Capture everything." },
        { icon: <Rocket />, text: "Easily process." },
        { icon: <PiTargetBold />, text: "Next actions." },
        { icon: <GrTasks />, text: "Manage projects." },
        { icon: <MdDashboard />, text: "Daily dashboard." }
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 px-4 pb-4">
            {features.map((feature, index) => (
                <FeatureItem
                    key={index}
                    icon={feature.icon}
                    text={feature.text}
                />
            ))}
        </div>
    );
}
