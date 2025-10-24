import { CSSProperties } from "react";
import { ResumeSection } from "./resume";
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  layout:
    | "classic"
    | "modern"
    | "left-right"
    | "professional"
    | "timeline"
    | "two-column";
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    contentPadding: number;
  };
  menuSections: ResumeSection[];
}

export interface TemplateConfig {
  sectionTitle: {
    className?: string;
    styles: CSSProperties;
  };
}
