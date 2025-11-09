import { DEFAULT_AVATAR } from "@/constants";
import {
  DEFAULT_CONFIG,
  ResumeSection,
  ResumeSectionContent,
} from "@/types/resume";
import { ResumeTemplate } from "@/types/template";

const basicDefault: ResumeSection = {
  id: "basic",
  title: "基本信息",
  enabled: true,
  config: {
    layout: "left",
    useIconMode: true,
  },
  order: 1,
  content: [
    {
      id: "name",
      type: "text",
      label: "姓名",
      value: "你的名字",
      visible: true,
    },
    {
      id: "title",
      type: "text",
      label: "职位",
      value: "你的职位",
      visible: true,
    },
    {
      id: "photo",
      type: "image",
      label: "头像",
      config: DEFAULT_CONFIG,
      value: DEFAULT_AVATAR,
    },
    {
      id: "github",
      type: "",
      label: "GitHub",
      icon: "Github",
      visible: true,
      config: {
        githubKey: "",
        githubUseName: "",
        githubContributionsVisible: false,
      },
    },
    {
      id: "employementStatus",
      type: "text",
      label: "状态",
      value: "离职",
      visible: true,
      icon: "Briefcase",
    },
    {
      id: "email",
      type: "email",
      label: "邮箱",
      value: "你的邮箱",
      visible: true,
      icon: "Mail",
    },
    {
      id: "phone",
      type: "tel",
      label: "电话",
      value: "你的电话",
      visible: true,
      icon: "Phone",
    },
    {
      id: "location",
      type: "text",
      label: "所在地",
      value: "你的所在地",
      visible: true,
      icon: "MapPin",
    },
    {
      id: "birthDate",
      type: "date",
      label: "生日",
      value: "1995-01",
      visible: true,
      icon: "CalendarRange",
    },
    {
      id: "website",
      type: "link",
      label: "个人网站",
      value: "https://youdomain.dev",
      icon: "Globe",
      visible: true,
    },
  ],
};

const introductionDefault: ResumeSection = {
  id: "introduction",
  title: "个人简介",
  enabled: true,
  order: 2,
  content: [
    {
      id: "description",
      type: "textarea",
      value: "简单的介绍你自己",
    },
  ],
};

const skillsDefault: ResumeSection = {
  id: "skills",
  title: "专业技能",
  enabled: true,
  order: 3,
  content: [
    {
      id: "description",
      type: "textarea",
      value: `<ul class="custom-list"><li><p>熟练使用各种AI开发工具</p></li></ul>`,
    },
  ],
};

export const experienceContentDefault: ResumeSectionContent = {
  id: "1",
  type: "experience",
  visible: true,
  fields: [
    {
      id: "company",
      type: "text",
      value: "你的公司",
    },
    {
      id: "position",
      type: "text",
      value: "你的职位",
    },
    {
      id: "date",
      type: "text",
      value: "2021/7 - 至今",
    },
    {
      id: "description",
      type: "textarea",
      value: `<ul class="custom-list">
<li>简单的描述你的工作内容</li>
</ul>`,
    },
  ],
};
const experienceDefault: ResumeSection = {
  id: "experience",
  title: "工作经验",
  enabled: true,
  order: 4,
  content: [experienceContentDefault],
};

export const projectContentDefault: ResumeSectionContent = {
  id: "p1",
  type: "project",
  visible: true,
  fields: [
    {
      id: "name",
      type: "text",
      value: "你的项目名称",
    },
    {
      id: "role",
      type: "text",
      value: "你的角色",
    },
    {
      id: "date",
      type: "text",
      value: "2022/6 - 2023/12",
    },
    {
      id: "link",
      type: "text",
      value: "https://www.douyin.com",
    },
    {
      id: "description",
      type: "textarea",
      value: `<ul class="custom-list">
  <li>简单的描述你的项目内容</li>
</ul>`,
    },
  ],
};

const projectsDefault: ResumeSection = {
  id: "projects",
  title: "项目经历",
  enabled: true,
  order: 5,
  content: [
    projectContentDefault,
    {
      ...projectContentDefault,
      id: "p2",
      value: "你的项目名称",
    },
    {
      ...projectContentDefault,
      id: "p3",
      value: "你的项目名称",
    },
  ],
};
export const educationContentDefault: ResumeSectionContent = {
  id: "1",
  type: "education",
  visible: true,
  fields: [
    { id: "school", type: "text", value: "你的学校" },
    { id: "major", type: "text", value: "你的专业" },
    { id: "degree", type: "text", value: "你的学位" },
    { id: "start-date", type: "text", value: "2013-09" },
    { id: "end-date", type: "text", value: "2017-06" },
    {
      id: "description",
      type: "textarea",
      value: `<ul class="custom-list">
<li>主修课程：数据结构</li>
</ul>`,
    },
  ],
};
const educationDefault: ResumeSection = {
  id: "education",
  title: "教育经历",
  enabled: true,
  order: 6,
  content: [educationContentDefault],
};

export const customSectionContentDefault: ResumeSectionContent = {
  id: "",
  type: "custom",
  value: "自定义模块",
  visible: true,
  fields: [
    { id: "title", type: "text", value: "", label: "标题" },
    { id: "subtitle", type: "text", value: "", label: "副标题" },
    {
      id: "dateRange",
      type: "text",
      value: "2013-09 - 2017-06",
      label: "时间范围",
    },
    { id: "description", type: "textarea", value: "", label: "描述" },
  ],
};

export const customSectionDefault: ResumeSection = {
  id: "",
  title: "自定义模块",
  enabled: true,
  content: [customSectionContentDefault],
};

export const DEFAULT_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "经典模板",
    description: "传统简约的简历布局，适合大多数求职场景",
    thumbnail: "classic",
    layout: "classic",
    colorScheme: {
      primary: "#000000",
      secondary: "#4b5563",
      background: "#ffffff",
      text: "#1f2937",
    },
    spacing: {
      sectionGap: 20,
      itemGap: 16,
      contentPadding: 28,
    },
    menuSections: [
      basicDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
      introductionDefault,
    ],
  },
  {
    id: "modern",
    name: "两栏布局",
    description: "经典两栏，突出个人特色",
    thumbnail: "modern",
    layout: "modern",
    colorScheme: {
      primary: "#000000",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#111827",
    },
    spacing: {
      sectionGap: 20,
      itemGap: 20,
      contentPadding: 1,
    },
    menuSections: [
      basicDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
      introductionDefault,
    ],
  },
  {
    id: "left-right",
    name: "模块标题背景色",
    description: "模块标题背景鲜明，突出美观特色",
    thumbnail: "leftRight",
    layout: "left-right",
    colorScheme: {
      primary: "#000000",
      secondary: "#9ca3af",
      background: "#ffffff",
      text: "#374151",
    },
    spacing: {
      sectionGap: 20,
      itemGap: 16,
      contentPadding: 28,
    },
    menuSections: [
      basicDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
      introductionDefault,
    ],
  },
  {
    id: "timeline",
    name: "时间线风格",
    description: "时间线布局，突出经历的时间顺序",
    thumbnail: "timeline",
    layout: "timeline",
    colorScheme: {
      primary: "#18181b",
      secondary: "#64748b",
      background: "#ffffff",
      text: "#1e293b",
    },
    spacing: {
      sectionGap: 1,
      itemGap: 12,
      contentPadding: 24,
    },
    menuSections: [
      basicDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
      introductionDefault,
    ],
  },
  {
    id: "two-column",
    name: "双栏专业版",
    description: "专业双栏布局，左侧个人信息，右侧主要内容",
    thumbnail: "two-column",
    layout: "two-column",
    colorScheme: {
      primary: "#1a1a1a",
      secondary: "#6b7280",
      background: "#ffffff",
      text: "#111827",
    },
    spacing: {
      sectionGap: 20,
      itemGap: 16,
      contentPadding: 28,
    },
    menuSections: [
      basicDefault,
      introductionDefault,
      experienceDefault,
      educationDefault,
      skillsDefault,
      projectsDefault,
    ],
  },
];

export const avatarUrlDefault = "/images/avatar.jpeg";
