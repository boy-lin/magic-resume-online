import { Layout } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DEFAULT_TEMPLATES } from "@/config";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { useResumeSettingsStore } from "@/store/resume/useResumeSettingsStore";

import { templateImages } from "@/app/constant/images";

const SwitchTemplate = () => {
  const t = useTranslations("templates");
  const { activeResume } = useResumeListStore();
  const { setTemplate } = useResumeSettingsStore();
  const currentTemplate =
    DEFAULT_TEMPLATES.find((t) => t.id === activeResume?.templateId) ||
    DEFAULT_TEMPLATES[0];

  return (
    <div className="w-full space-y-4 p-2">
      <div className=" space-y-2">
        <h3 className="tracking-tight flex items-center gap-2 text-base font-medium">
          {t("switchTemplate")}
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {DEFAULT_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id, true)}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02]",
                t.id === currentTemplate.id
                  ? "border-primary dark:border-primary shadow-lg dark:shadow-primary/30"
                  : "dark:border-neutral-800 dark:hover:border-neutral-700 border-gray-100 hover:border-gray-200"
              )}
            >
              <img
                src={templateImages[t.id].src}
                alt={t.name}
                className="w-full h-auto"
              />
              {t.id === currentTemplate.id && (
                <motion.div
                  layoutId="template-selected"
                  className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-white/30"
                >
                  <Layout className="w-6 h-6 text-white dark:text-primary" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwitchTemplate;
