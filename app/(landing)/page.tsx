import Navbar from "../components/Navbar";
import HeroSection from "../components/sections/HeroSection";
import CollectionSection from "../components/sections/CollectionSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import FAQSection from "../components/sections/FAQSection";
import FooterSection from "../components/sections/FooterSection";

export default function MainHubPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#faf7f2", overflowX: "clip" }}>
            {/* Ambient Blobs — Frosted Champagne */}
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.06)", filter: "blur(120px)" }} />
                <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(205,171,143,0.04)", filter: "blur(120px)" }} />
            </div>

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