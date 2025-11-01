"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import {
  GlobalSettings,
  ResumeSection,
  ResumeSectionContent,
} from "@/types/resume";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";

interface ProjectItemProps {
  project: ResumeSectionContent;
  globalSettings?: GlobalSettings;
}

const ProjectItem = React.forwardRef<HTMLDivElement, ProjectItemProps>(
  ({ project, globalSettings }, ref) => {
    const centerSubtitle = globalSettings?.centerSubtitle;
    const [name, role, date, link, description] = project.fields || [];

    return (
      <motion.div
        style={{
          marginTop: `${globalSettings?.paragraphSpacing}px`,
        }}
      >
        <motion.div
          className={`grid grid-cols-3 gap-2 items-center justify-items-start [&>*:last-child]:justify-self-end`}
        >
          <div className="flex items-center gap-2">
            <h3
              className="font-bold"
              style={{
                fontSize: `${globalSettings?.subheaderSize || 16}px`,
              }}
            >
              {name.value}
            </h3>
          </div>

          {link && !centerSubtitle && (
            <a
              href={
                link.value.startsWith("http")
                  ? link.value
                  : `https://${link.value}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              title={link.value}
            >
              {(() => {
                try {
                  const url = new URL(
                    link.value.startsWith("http")
                      ? link.value
                      : `https://${link.value}`
                  );
                  return url.hostname.replace(/^www\./, "");
                } catch (e) {
                  return link.value;
                }
              })()}
            </a>
          )}

          {!link.value && !centerSubtitle && <div></div>}

          {centerSubtitle && (
            <motion.div layout="position" className=" text-subtitleFont">
              {role.value}
            </motion.div>
          )}
          <div className="text-subtitleFont">{date.value}</div>
        </motion.div>
        {role.value && !centerSubtitle && (
          <motion.div layout="position" className=" text-subtitleFont">
            {role.value}
          </motion.div>
        )}
        {link.value && centerSubtitle && (
          <a
            href={
              link.value.startsWith("http")
                ? link.value
                : `https://${link.value}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            title={link.value}
          >
            {link.value}
          </a>
        )}
        {description.value ? (
          <motion.div
            layout="position"
            className="mt-2"
            style={{
              fontSize: `${globalSettings?.baseFontSize || 14}px`,
              lineHeight: globalSettings?.lineHeight || 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: description.value }}
          ></motion.div>
        ) : (
          <div></div>
        )}
      </motion.div>
    );
  }
);

ProjectItem.displayName = "ProjectItem";

interface ProjectSectionProps {
  section: ResumeSection;
  globalSettings?: GlobalSettings;
  showTitle?: boolean;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({
  section,
  globalSettings,
  showTitle = true,
}) => {
  const { setActiveSection } = useResumeEditorStore();

  const visibleProjects = section?.content;

  return (
    <motion.div
      className="hover:cursor-pointer hover:outline hover:outline-2 hover:outline-primary rounded-md transition-all duration-300 ease-in-out hover:shadow-md"
      style={{
        marginTop: `${globalSettings?.sectionSpacing || 24}px`,
      }}
      onClick={() => {
        setActiveSection("projects");
      }}
    >
      <SectionTitle
        type="projects"
        globalSettings={globalSettings}
        showTitle={showTitle}
      />
      <motion.div layout="position">
        {visibleProjects.map((item) => (
          <ProjectItem
            key={item.id}
            project={item}
            globalSettings={globalSettings}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ProjectSection;
