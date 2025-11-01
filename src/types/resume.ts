export interface FieldType {
  id: string;
  type: string;
  value?: string;
  visible?: boolean;
  icon?: string;
  label?: string;
}
export interface ResumeSectionContent {
  id: string;
  type: string;
  value?: string;
  visible?: boolean;
  icon?: string;
  label?: string;
  subtitle?: string;
  config?: Record<string, any>;
  fields?: FieldType[];
}
export interface ResumeSection {
  id: string;
  title: string;
  enabled: boolean;
  content?: ResumeSectionContent[];
  config?: Record<string, any>;
  visible?: boolean;
  order?: number;
}

export interface PhotoConfig {
  width?: number;
  height?: number;
  aspectRatio?: "1:1" | "4:3" | "3:4" | "16:9" | "custom";
  borderRadius?: "none" | "medium" | "full" | "custom";
  customBorderRadius?: number;
  visible?: boolean;
}

export const DEFAULT_CONFIG: PhotoConfig = {
  width: 90,
  height: 120,
  aspectRatio: "1:1",
  borderRadius: "none",
  customBorderRadius: 0,
  visible: true,
};

export const getRatioMultiplier = (ratio: PhotoConfig["aspectRatio"]) => {
  switch (ratio) {
    case "4:3":
      return 3 / 4;
    case "3:4":
      return 4 / 3;
    case "16:9":
      return 9 / 16;
    default:
      return 1;
  }
};

export const getBorderRadiusValue = (config?: PhotoConfig) => {
  if (!config) return "0";

  switch (config.borderRadius) {
    case "medium":
      return "0.5rem";
    case "full":
      return "9999px";
    case "custom":
      return `${config.customBorderRadius}px`;
    default:
      return "0";
  }
};

export interface CustomFieldType {
  id: string;
  label: string;
  value: string;
  icon?: string;
  visible?: boolean;
  custom?: boolean;
}

export type GlobalSettings = {
  themeColor?: string | undefined;
  fontFamily?: string | undefined;
  baseFontSize?: number | undefined;
  pagePadding?: number | undefined;
  paragraphSpacing?: number | undefined;
  lineHeight?: number | undefined;
  sectionSpacing?: number | undefined;
  headerSize?: number | undefined;
  subheaderSize?: number | undefined;
  useIconMode?: boolean | undefined;
  centerSubtitle?: boolean | undefined;
};

export interface ResumeTheme {
  id: string;
  name: string;
  color: string;
}

export const THEME_COLORS = [
  "#000000",
  "#1A1A1A",
  "#333333",
  "#4D4D4D",
  "#666666",
  "#808080",
  "#999999",
  "#0047AB",
  "#8B0000",
  "#FF4500",
  "#4B0082",
  "#2E8B57",
];

export enum MenuSectionId {
  introduction = "introduction",
  basic = "basic",
  experience = "experience",
  education = "education",
  skills = "skills",
  projects = "projects",
}

export interface ResumeData {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  templateId: string | null | undefined;
  activeSection: string;
  draggingProjectId: string | null;
  menuSections: ResumeSection[];
  globalSettings: GlobalSettings;
  isNeedSync?: boolean;
  isPublic?: boolean;
  publicPassword?: string;
}
