import { GlobalSettings } from "../types/resume";

const initialGlobalSettings: GlobalSettings = {
  baseFontSize: 16,
  pagePadding: 32,
  paragraphSpacing: 12,
  lineHeight: 1.5,
  sectionSpacing: 10,
  headerSize: 18,
  subheaderSize: 16,
  useIconMode: true,
  themeColor: "#000000",
  centerSubtitle: true,
};

export const initialResumeState = {
  title: "简历模板",
  globalSettings: initialGlobalSettings,
};

export const initialResumeStateEn = {
  title: "New Resume",
  globalSettings: initialGlobalSettings,
};
