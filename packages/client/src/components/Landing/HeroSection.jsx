export default function HeroSection() {
    return (
        <div className="text-center space-y-8 py-12">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-black leading-tight px-4">
                A simple system for people who just want to get shit done
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-black/70 max-w-4xl mx-auto px-4">
                Currently open to beta users who want to help me improve the system.
            </p>
        </div>
    );
}
