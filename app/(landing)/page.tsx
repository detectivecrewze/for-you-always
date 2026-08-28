import Navbar from "../components/Navbar";
import HeroSection from "../components/sections/HeroSection";
import CollectionSection from "../components/sections/CollectionSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import FAQSection from "../components/sections/FAQSection";
import FooterSection from "../components/sections/FooterSection";

export default function MainHubPage() {
    return (
        <div style={{ minHeight: "100vh", position: "relative", background: "#faf7f2", overflowX: "clip" }}>
            {/* Ambient Blobs — Frosted Champagne */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 0,
                    background: "radial-gradient(circle at 0% 0%, rgba(205,171,143,0.1) 0%, transparent 34%), radial-gradient(circle at 100% 100%, rgba(205,171,143,0.07) 0%, transparent 32%)",
                }}
            />

            <Navbar />
            <HeroSection />
            <CollectionSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <FAQSection />
            <FooterSection />
        </div>
    );
}
