"use client";
import { AnimatePresence, motion } from "framer-motion";
import { GlobalSettings, ResumeSection } from "@/types/resume";
import SectionTitle from "./SectionTitle";
import { useResumeStore } from "@/store/resume/useResumeStore";

import { useLocale } from "next-intl";

interface EducationSectionProps {
  section?: ResumeSection;
  globalSettings?: GlobalSettings;
  showTitle?: boolean;
}

const EducationSection = ({
  section,
  globalSettings,
  showTitle = true,
}: EducationSectionProps) => {
  const { setActiveSection } = useResumeStore();
  const locale = useLocale();

  return (
    <motion.div
      className="
      hover:cursor-pointer
      hover:outline hover:outline-2 hover:outline-primary
      rounded-md
      transition-all
      duration-300
      ease-in-out
      hover:shadow-md"
      style={{
        marginTop: `${globalSettings?.sectionSpacing || 24}px`,
      }}
      onClick={() => {
        setActiveSection("education");
      }}
    >
      <SectionTitle
        type="education"
        globalSettings={globalSettings}
        showTitle={showTitle}
      ></SectionTitle>
      <AnimatePresence mode="popLayout">
        {section?.content?.map((item) => {
          const school = {
            value: item.value,
            id: "school",
            type: "text",
          };
          const [major, degree, startDate, endDate, description] =
            item.fields || [];
          return (
            <motion.div
              layout="position"
              key={item.id}
              style={{
                marginTop: `${globalSettings?.paragraphSpacing}px`,
              }}
            >
              <motion.div
                layout="position"
                className={`grid grid-cols-${
                  globalSettings?.centerSubtitle ? "3" : "2"
                } gap-2 items-center justify-items-start [&>*:last-child]:justify-self-end`}
              >
                <div
                  className="font-bold"
                  style={{
                    fontSize: `${globalSettings?.subheaderSize || 16}px`,
                  }}
                >
                  <span>{school.value}</span>
                </div>

                {globalSettings?.centerSubtitle && (
                  <motion.div layout="position" className="text-subtitleFont">
                    {[major.value, degree.value].filter(Boolean).join(" · ")}
                  </motion.div>
                )}

                <span
                  className="text-subtitleFont shrink-0"
                  suppressHydrationWarning
                >
                  {`${new Date(startDate.value).toLocaleDateString(
                    locale
                  )} - ${new Date(endDate.value).toLocaleDateString(locale)}`}
                </span>
              </motion.div>

              {!globalSettings?.centerSubtitle && (
                <motion.div
                  layout="position"
                  className="text-subtitleFont mt-1"
                >
                  {[major.value, degree.value].filter(Boolean).join(" · ")}
                </motion.div>
              )}

              {description.value && (
                <motion.div
                  layout="position"
                  className="mt-2"
                  style={{
                    fontSize: `${globalSettings?.baseFontSize || 14}px`,
                    lineHeight: globalSettings?.lineHeight || 1.6,
                  }}
                  dangerouslySetInnerHTML={{ __html: description.value }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default EducationSection;
