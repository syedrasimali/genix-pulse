import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => (
  <div className="relative min-h-screen">
    <AnimatedBackground />
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <FooterSection />
  </div>
);

export default Index;
