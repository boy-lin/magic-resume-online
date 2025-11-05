import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/moving-border";
import ScrollBackground from "./client/ScrollBackground";
import AnimatedFeature from "./client/AnimatedFeature";
import GoDashboard from "./GoDashboard";
import { SparklesText } from "../ui/sparkles-text";

export default function CTASection() {
  const t = useTranslations("home");

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
      <ScrollBackground />
      <div className="mx-auto max-w-[1200px] px-4 relative">
        <AnimatedFeature>
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              <SparklesText text={t("cta.title")} />
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <GoDashboard>
              <Button
                type="submit"
                className="bg-background text-foreground font-medium border-foreground"
              >
                {t("cta.button")}
                {/* <ArrowRight className="w-5 h-5" /> */}
              </Button>
            </GoDashboard>
          </div>
        </AnimatedFeature>
      </div>
    </section>
  );
}
