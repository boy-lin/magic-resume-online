"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import AnimatedFeature from "./client/AnimatedFeature";
import GoDashboard from "./GoDashboard";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { RainbowButton } from "@/components/ui/rainbow-button";
import ElectricBorder from "@/components/ElectricBorder";

export default function HeroSection() {
  const t = useTranslations("home");

  return (
    <AuroraBackground className="relative min-h-[70vh] flex items-center justify-center pt-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        <div className="m-auto max-w-[1200px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <AnimatedFeature>
              <div className="max-w-xl relative text-center lg:text-left mx-auto lg:mx-0">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-2xl hidden lg:block" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t("hero.badge")}
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4 text-foreground">
                    {t("hero.title")}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {t("hero.subtitle")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <GoDashboard type="templates">
                      <RainbowButton
                        type="submit"
                        className="gap-2 text-base px-6 py-5 rounded-full text-background"
                      >
                        {t("hero.cta")}
                        {/* <ArrowRight className="w-5 h-5" /> */}
                      </RainbowButton>
                    </GoDashboard>

                    <GoDashboard type="templates">
                      <Button
                        type="submit"
                        size="lg"
                        variant="outline"
                        className="py-[21px] gap-2 text-base px-6 rounded-full text-foreground"
                      >
                        {t("hero.secondary")}
                      </Button>
                    </GoDashboard>
                  </div>
                </div>
              </div>
            </AnimatedFeature>

            <AnimatedFeature delay={0.2}>
              <div className="relative h-[300px] lg:h-[400px] flex items-center justify-center">
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                  <ElectricBorder
                    color="#2383e2"
                    speed={1}
                    chaos={0.5}
                    thickness={2}
                    className="rounded-xl p-1"
                  >
                    <img
                      src="/features/screenshot.gif"
                      alt="Resume Editor"
                      className="object-contain object-center -translate-x-[2px]"
                      sizes="(max-width: 768px)"
                      style={{ borderRadius: "1rem" }}
                    />
                  </ElectricBorder>
                </div>
              </div>
            </AnimatedFeature>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
