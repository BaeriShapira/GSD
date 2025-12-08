import FeatureItem from "./FeatureItem";

export default function FeatureList() {
    const features = [
        { icon: "📋", text: "Capture everything." },
        { icon: "🚀", text: "Easily process." },
        { icon: "🎯", text: "Next actions." },
        { icon: "📊", text: "Manage projects." },
        { icon: "📅", text: "Daily dashboard." }
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 px-4 py-8">
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
