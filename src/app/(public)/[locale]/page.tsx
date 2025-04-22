import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import NewsAlert from "@/components/home/NewsAlert";
import FAQSection from "@/components/home/FAQSection";

export default function Page() {
  return (
    <>
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
        <NewsAlert />
      </div>
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
