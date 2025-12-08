export default function FeatureItem({ icon, text }) {
    return (
        <div className="flex items-center gap-3 text-black">
            <span className="text-3xl">{icon}</span>
            <span className="text-lg md:text-xl font-semibold whitespace-nowrap">
                {text}
            </span>
        </div>
    );
}
