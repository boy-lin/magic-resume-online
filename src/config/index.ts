import { DEFAULT_AVATAR } from "@/constants";
import { DEFAULT_CONFIG, ResumeSection } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";

const basicDefault: ResumeSection = {
  id: "basic",
  title: "基本信息",
  enabled: true,
  config: {
    layout: "left",
    useIconMode: true,
  },
  content: [
    {
      id: "name",
      type: "text",
      label: "姓名",
      value: "张明",
      visible: true,
    },
    {
      id: "title",
      type: "text",
      label: "职位",
      value: "资深Java开发工程师",
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
      value: "zhangming@example.com",
      visible: true,
      icon: "Mail",
    },
    {
      id: "phone",
      type: "text",
      label: "电话",
      value: "138xxxx5678",
      visible: true,
      icon: "Phone",
    },
    {
      id: "location",
      type: "text",
      label: "所在地",
      value: "上海",
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
      id: "personal",
      type: "link",
      label: "个人网站",
      value: "https://zhangsan.dev",
      icon: "Globe",
      visible: true,
    },
  ],
};

const introductionDefault: ResumeSection = {
  id: "introduction",
  title: "个人简介",
  enabled: true,
  content: [
    {
      id: "description",
      type: "textarea",
      value: "自我介绍",
    },
  ],
};

const skillsDefault: ResumeSection = {
  id: "skills",
  title: "专业技能",
  enabled: true,
  content: [
    {
      id: "description",
      type: "textarea",
      value: `<div class="skill-content">
<ul class="custom-list">
<li>前端框架：熟悉 React、Vue.js，熟悉 Next.js、Nuxt.js 等 SSR 框架</li>
<li>开发语言：TypeScript、JavaScript(ES6+)、HTML5、CSS3</li>
<li>UI/样式：熟悉 TailwindCSS、Sass/Less、CSS Module、Styled-components</li>
<li>状态管理：Redux、Vuex、Zustand、Jotai、React Query</li>
<li>工程化工具：Webpack、Vite、Rollup、Babel、ESLint</li>
<li>测试工具：Jest、React Testing Library、Cypress</li>
<li>性能优化：熟悉浏览器渲染原理、性能指标监控、代码分割、懒加载等优化技术</li>
<li>版本控制：Git、SVN</li>
<li>技术管理：具备团队管理经验，主导过多个大型项目的技术选型和架构设计</li>
</ul>
</div>`,
    },
  ],
};

const experienceDefault: ResumeSection = {
  id: "experience",
  title: "工作经验",
  enabled: true,
  content: [
    {
      id: "1",
      type: "experience",
      value: "字节跳动",
      fields: [
        {
          id: "position",
          type: "text",
          value: "高级前端工程师",
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
  <li>负责抖音创作者平台的开发与维护，主导多个核心功能的技术方案设计</li>
  <li>优化项目工程化配置，将构建时间从 8 分钟优化至 2 分钟，提升团队开发效率</li>
  <li>设计并实现组件库，提升代码复用率达 70%，显著减少开发时间</li>
  <li>主导性能优化项目，使平台首屏加载时间减少 50%，接入 APM 监控系统</li>
  <li>指导初级工程师，组织技术分享会，提升团队整体技术水平</li>
</ul>`,
        },
      ],
    },
  ],
};

const projectsDefault: ResumeSection = {
  id: "projects",
  title: "项目经历",
  enabled: true,
  content: [
    {
      id: "p1",
      type: "project",
      value: "抖音创作者中台",
      fields: [
        {
          id: "position",
          type: "text",
          value: "前端负责人",
        },
        {
          id: "role",
          type: "text",
          value: "前端负责人",
        },
        {
          id: "link",
          type: "text",
          value: "https://www.douyin.com",
        },
        {
          id: "date",
          type: "text",
          value: "2022/6 - 2023/12",
        },
        {
          id: "description",
          type: "textarea",
          value: `<ul class="custom-list">
    <li>基于 React 开发的创作者数据分析和内容管理平台，服务百万级创作者群体</li>
    <li>包含数据分析、内容管理、收益管理等多个子系统</li>
    <li>使用 Redux 进行状态管理，实现复杂数据流的高效处理</li>
    <li>采用 Ant Design 组件库，确保界面设计的一致性和用户体验</li>
    <li>实施代码分割和懒加载策略，优化大规模应用的加载性能</li>
  </ul>`,
        },
      ],
    },
    {
      id: "p2",
      type: "project",
      value: "微信小程序开发者工具",
      fields: [
        {
          id: "position",
          type: "text",
          value: "前端负责人",
        },
        {
          id: "role",
          type: "text",
          value: "前端负责人",
        },
        {
          id: "link",
          type: "text",
          value: "https://www.douyin.com",
        },
        {
          id: "date",
          type: "text",
          value: "2022/6 - 2023/12",
        },
        {
          id: "description",
          type: "textarea",
          value: `<ul class="custom-list">
    <li>基于 React 开发的创作者数据分析和内容管理平台，服务百万级创作者群体</li>
    <li>包含数据分析、内容管理、收益管理等多个子系统</li>
    <li>使用 Redux 进行状态管理，实现复杂数据流的高效处理</li>
    <li>采用 Ant Design 组件库，确保界面设计的一致性和用户体验</li>
    <li>实施代码分割和懒加载策略，优化大规模应用的加载性能</li>
  </ul>`,
        },
      ],
    },
    {
      id: "p2",
      type: "project",
      value: "微信小程序开发者工具",
      fields: [
        { id: "position", type: "text", value: "核心开发者" },
        { id: "role", type: "text", value: "核心开发者" },
        { id: "link", type: "text", value: "https://www.douyin.com" },
        { id: "date", type: "text", value: "2022/6 - 2023/12" },
        {
          id: "description",
          type: "textarea",
          value: `<ul class="custom-list">
    <li>为开发者提供小程序开发、调试和发布的一站式解决方案</li>
    <li>基于 Electron 构建的跨平台桌面应用</li>
    <li>支持多平台开发，包括 Windows、macOS 和 Linux</li>
    <li>提供实时的错误日志和性能分析工具</li>
    <li>集成第三方插件和 SDK，支持开发者自定义功能</li>
  </ul>`,
        },
      ],
    },
    {
      id: "p3",
      type: "project",
      value: "前端监控平台",
      fields: [
        { id: "position", type: "text", value: "技术负责人" },
        { id: "role", type: "text", value: "技术负责人" },
        { id: "link", type: "text", value: "https://www.douyin.com" },
        { id: "date", type: "text", value: "2021/9 - 2022/3" },
        {
          id: "description",
          type: "textarea",
          value: `<ul class="custom-list">
    <li>一个完整的前端监控解决方案，包含错误监控、性能监控、用户行为分析等功能。</li>
    <li>基于 Vue 和 Element UI 构建，提供实时的监控数据和可视化分析工具。</li>
    <li>支持多种监控指标，包括错误日志、性能指标、用户行为分析等。</li>
    <li>提供详细的错误日志和性能分析工具，帮助开发者定位和优化问题。</li>
    <li>集成第三方插件和 SDK，支持开发者自定义功能。</li>
  </ul>`,
        },
      ],
    },
  ],
};

const educationDefault: ResumeSection = {
  id: "education",
  title: "教育经历",
  enabled: true,
  content: [
    {
      id: "1",
      type: "education",
      value: "北京大学",
      fields: [
        { id: "major", type: "text", value: "计算机科学与技术" },
        { id: "degree", type: "text", value: "本科" },
        { id: "start-date", type: "text", value: "2013-09" },
        { id: "end-date", type: "text", value: "2017-06" },
        {
          id: "description",
          type: "text",
          value: `<ul class="custom-list">
    <li>主修课程：数据结构、算法设计、操作系统、计算机网络、Web开发技术</li>
    <li>专业排名前 5%，连续三年获得一等奖学金</li>
    <li>担任计算机协会技术部部长，组织多次技术分享会</li>
    <li>参与开源项目贡献，获得 GitHub Campus Expert 认证</li>
  </ul>`,
        },
      ],
    },
  ],
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
      sectionGap: 24,
      itemGap: 16,
      contentPadding: 32,
    },
    menuSections: [
      basicDefault,
      introductionDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
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
      introductionDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
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
      sectionGap: 24,
      itemGap: 16,
      contentPadding: 32,
    },
    menuSections: [
      basicDefault,
      introductionDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
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
      introductionDefault,
      skillsDefault,
      experienceDefault,
      projectsDefault,
      educationDefault,
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
      sectionGap: 24,
      itemGap: 16,
      contentPadding: 24,
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
