import LandingHeader from "../components/Landing/LandingHeader";
import HeroSection from "../components/Landing/HeroSection";
import FeatureList from "../components/Landing/FeatureList";
import CTAButton from "../components/Landing/CTAButton";
import CatPaws from "../components/Landing/CatPaws";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Content Wrapper with padding for cat paws */}
            <div className="relative z-20">
                <div className="container mx-auto px-4 py-4 space-y-1">
                    {/* Header */}
                    <LandingHeader />

                    {/* Hero Section */}
                    <HeroSection />

                    {/* Features */}
                    <FeatureList />

                    {/* CTA Button */}
                    <CTAButton />

                    {/* Footer */}
                    <footer className="text-center py-8 text-sm text-gray-600">
                        <a
                            href="/privacy"
                            className="hover:text-purple-600 transition-colors underline"
                        >
                            Privacy Policy
                        </a>
                    </footer>
                </div>
            </div>

            {/* Cat Paws at the bottom */}
            <CatPaws />
        </div>
    );
}
