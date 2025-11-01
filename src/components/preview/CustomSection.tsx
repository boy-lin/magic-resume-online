"use client";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { GlobalSettings, ResumeSection } from "@/types/resume";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";

interface CustomSectionProps {
  section: ResumeSection;
  globalSettings?: GlobalSettings;
}

const CustomSection = ({ section, globalSettings }: CustomSectionProps) => {
  const { setActiveSection } = useResumeEditorStore();
  const visibleItems = section?.content;
  const centerSubtitle = globalSettings?.centerSubtitle;
  const gridColumns = centerSubtitle ? 3 : 2;
  return (
    <motion.div
      className="hover:cursor-pointer hover:bg-gray-100 rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
      style={{
        marginTop: `${globalSettings?.sectionSpacing || 24}px`,
      }}
      onClick={() => {
        setActiveSection(section.id);
      }}
    >
      <SectionTitle
        title={section.title}
        type="custom"
        globalSettings={globalSettings}
      />
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item) => {
          console.log("item::", item);
          const [description, title, subtitle, dateRange] = item.fields || [];
          return (
            <motion.div
              key={item.id}
              layout="position"
              style={{
                marginTop: `${globalSettings?.paragraphSpacing}px`,
              }}
            >
              <motion.div
                layout="position"
                className={`grid grid-cols-${gridColumns} gap-2 items-center justify-items-start [&>*:last-child]:justify-self-end`}
              >
                <div className="flex items-center gap-2">
                  <h4
                    className="font-bold"
                    style={{
                      fontSize: `${globalSettings?.subheaderSize || 16}px`,
                    }}
                  >
                    {title.value}
                  </h4>
                </div>

                {centerSubtitle && (
                  <motion.div layout="position" className="text-subtitleFont">
                    {subtitle.value}
                  </motion.div>
                )}

                <span className="text-subtitleFont shrink-0">
                  {dateRange.value}
                </span>
              </motion.div>

              {!centerSubtitle && subtitle.value && (
                <motion.div
                  layout="position"
                  className="text-subtitleFont mt-1"
                >
                  {subtitle.value}
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

export default CustomSection;
