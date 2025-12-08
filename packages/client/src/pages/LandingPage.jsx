import LandingHeader from "../components/Landing/LandingHeader";
import HeroSection from "../components/Landing/HeroSection";
import FeatureList from "../components/Landing/FeatureList";
import CTAButton from "../components/Landing/CTAButton";
import CatPaws from "../components/Landing/CatPaws";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Content Wrapper with padding for cat paws */}
            <div className="relative z-20 pb-96">
                <div className="container mx-auto px-4 py-8 space-y-12">
                    {/* Header */}
                    <LandingHeader />

                    {/* Hero Section */}
                    <HeroSection />

                    {/* Features */}
                    <FeatureList />

                    {/* CTA Button */}
                    <CTAButton />
                </div>
            </div>

            {/* Cat Paws at the bottom */}
            <CatPaws />
        </div>
    );
}
