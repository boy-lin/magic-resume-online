import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const resume = {
    id: "dfb4c999-507e-4514-ba4c-ac07a0417a96",
    userId: "008d3428-1010-4f2e-8308-70b65a755da2",
    templateId: "two-column",
    title: "史浩林",
    basic: null,
    customData: "null",
    globalSettings: {
      baseFontSize: 16,
      pagePadding: 28,
      paragraphSpacing: 16,
      lineHeight: 1.5,
      sectionSpacing: 20,
      headerSize: 18,
      subheaderSize: 16,
      useIconMode: true,
      themeColor: "#1a1a1a",
      centerSubtitle: true,
    },
    menuSections: [
      {
        id: "basic",
        title: "基本信息",
        enabled: true,
        config: {
          layout: "left",
          useIconMode: true,
        },
        order: 0,
        content: [
          {
            id: "name",
            type: "text",
            label: "姓名",
            value: "史浩林",
            visible: true,
          },
          {
            id: "title",
            type: "text",
            label: "职位",
            value: "资深前端开发",
            visible: true,
          },
          {
            id: "photo",
            type: "image",
            label: "头像",
            config: {
              width: 100,
              height: 120,
              aspectRatio: "custom",
              borderRadius: "medium",
              customBorderRadius: 0,
              visible: true,
            },
            value:
              "https://r2.2342342.xyz/output/temp_b1ee3ed9-e07c-41e0-8110-f69dbd626f01.png",
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
            value: "xiaoyaosha@gmail.com",
            visible: true,
            icon: "Mail",
          },
          {
            id: "phone",
            type: "tel",
            label: "电话",
            value: "19083208407",
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
            value: "1992-11-10T16:00:00.000Z",
            visible: true,
            icon: "CalendarRange",
          },
          {
            id: "website",
            type: "link",
            label: "个人网站",
            value: "https://s.2342342.xyz",
            icon: "Globe",
            visible: true,
          },
        ],
      },
      {
        id: "skills",
        title: "专业技能",
        enabled: true,
        order: 1,
        content: [
          {
            id: "description",
            type: "textarea",
            value:
              '<ul class="custom-list"><li><p>熟练使用各种AI开发工具</p></li><li><p>精通Hybird、Electron客户端、响应式页面、SSR、小程序、微前端、视频直播, 精通HTML、CSS、JavaScript、TypeScript、Node.js、React、Vue、Electron、UniApp、Next.js等技术栈</p></li><li><p>熟练掌握 Flutter、Three.js、MUI、ShadcnUi、WebRtc、Konva、G6、ECharts、GSAP、Motion等常用库</p></li><li><p>熟练掌握 Php、Java、MySQL、PostgreSQL、Nest.js、GraphQL、Prisma 等后端技术</p></li><li><p>擅长 Webpack、Gulp、Rollup、Git、SVN、Docker、Shell 等工具</p></li></ul>',
          },
        ],
      },
      {
        id: "experience",
        title: "工作经验",
        enabled: true,
        order: 2,
        content: [
          {
            id: "1",
            type: "experience",
            visible: true,
            fields: [
              {
                id: "company",
                type: "text",
                value: "众畅科技有限公司",
              },
              {
                id: "position",
                type: "text",
                value: "前端开发专家",
              },
              {
                id: "date",
                type: "text",
                value: "2023-10 ~ 2025-4-3",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>负责多个停车项目的前端项目管理、涵盖智慧停车、充电管理、发票管理、监控通话等多个领域，涉及APP、小程序、h5等多种技术；与团队紧密合作、确保所有前端功能稳定可靠，同时满足迭代排期。</p></li></ul>',
              },
            ],
          },
          {
            id: "5534e25e-3b01-42aa-bf8d-d3d2732a024b",
            type: "experience",
            visible: true,
            fields: [
              {
                id: "company",
                type: "text",
                value: "云学堂信息科技（江苏）有限公司",
              },
              {
                id: "position",
                type: "text",
                value: "高级前端开发",
              },
              {
                id: "date",
                type: "text",
                value: "2022-01 ~ 2023-1",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>架构了审批中心系统、IM 消息/聊天系统。负责迭代 公共业务组件、基础业务系统、下载中心系统、分享中心系统、运营管理系统、开放开发中心等20+个项目</p></li><li><p>负责绚星平台基础领域前端组，确保能高质效的落地需求</p></li><li><p>负责基础领域的核心系统设计，复杂系统架构/重构/性能优化，技术攻坚，方案落地</p></li></ul>',
              },
            ],
          },
          {
            id: "1ef9ef38-abfd-4ba5-86a3-649b8d6775aa",
            type: "experience",
            visible: true,
            fields: [
              {
                id: "company",
                type: "text",
                value: "众畅科技有限公司",
              },
              {
                id: "position",
                type: "text",
                value: "前端开发专家",
              },
              {
                id: "date",
                type: "text",
                value: "2020-10 ~ 2022-1",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>负责前端部门的项目人员项目管理，需求排期，确保需求稳定上线</p></li><li><p>负责前端项目架构，技术选型，性能优化，code review</p></li></ul>',
              },
            ],
          },
          {
            id: "6bef404a-ccdb-4c8a-9922-90b0f911746b",
            type: "experience",
            visible: true,
            fields: [
              {
                id: "company",
                type: "text",
                value: "上海掌小门教育科技有限公司",
              },
              {
                id: "position",
                type: "text",
                value: "前端开发工程师",
              },
              {
                id: "date",
                type: "text",
                value: "2018-9 ~ 2020-10",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>负责研究 Electron 打包，编译，优化，完成掌门少儿的直播客户端开发。</p></li></ul>',
              },
            ],
          },
          {
            id: "568a401f-688d-4ddf-9a63-a6881382d87c",
            type: "experience",
            visible: true,
            fields: [
              {
                id: "company",
                type: "text",
                value: "上海米领通信技术有限公司",
              },
              {
                id: "position",
                type: "text",
                value: "React开发工程师",
              },
              {
                id: "date",
                type: "text",
                value: "2017-6 ~ 2018-9",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>负责 Hybrid h5 开发，编写 React 通⽤组件。</p></li></ul>',
              },
            ],
          },
        ],
      },
      {
        id: "projects",
        title: "项目经历",
        enabled: true,
        order: 3,
        content: [
          {
            id: "38b05254-c757-458a-9069-8d114c7ce6f9",
            type: "project",
            visible: true,
            fields: [
              {
                id: "name",
                type: "text",
                value: "格式工厂网站",
              },
              {
                id: "role",
                type: "text",
                value: "前端负责人",
              },
              {
                id: "date",
                type: "text",
                value: "2025/8 - 2025/9",
              },
              {
                id: "link",
                type: "text",
                value: "https://z.pcgeshi.com/feature/",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>使用ffmpeg.wasm实现音视频，图片的转码、压缩、调音等功能</p></li><li><p>使用php接入人声分离、音频降噪等功能</p></li></ul>',
              },
            ],
          },
          {
            id: "30c13a24-4760-4243-868a-20d88b0b13ea",
            type: "project",
            visible: true,
            fields: [
              {
                id: "name",
                type: "text",
                value: "蜀大侠小游戏",
              },
              {
                id: "role",
                type: "text",
                value: "前端开发",
              },
              {
                id: "date",
                type: "text",
                value: "2025/09- 2023/10",
              },
              {
                id: "link",
                type: "text",
                value: "https://www.shudaxia.com/mouse-click-train/index.html",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>基于 React+PixiJs 实现简单的小游戏</p></li></ul>',
              },
            ],
          },
          {
            id: "34d0649e-2b0d-4eb4-a126-7ed910b4e6fc",
            type: "project",
            visible: true,
            fields: [
              {
                id: "name",
                type: "text",
                value: "简历编辑器",
              },
              {
                id: "role",
                type: "text",
                value: "全栈架构",
              },
              {
                id: "date",
                type: "text",
                value: "2025/3 - 至今",
              },
              {
                id: "link",
                type: "text",
                value: "https://resume.2342342.xyz/",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>个人项目在线简历编辑器</p></li></ul><p>* Next.js全栈架构，采用supabase、shadcn、tailwindcss、zustand、zod等流行方案</p>',
              },
            ],
          },
          {
            id: "2f78cc76-1818-4b95-84d4-6e14dca52e7e",
            type: "project",
            visible: true,
            fields: [
              {
                id: "name",
                type: "text",
                value: "aifooler",
              },
              {
                id: "role",
                type: "text",
                value: "前端开发",
              },
              {
                id: "date",
                type: "text",
                value: "2025/6 - 2025/8",
              },
              {
                id: "link",
                type: "text",
                value: "https://www.aifooler.com",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>通过AI模型实现了音频降噪、人声分离，音轨分离等</p></li><li><p>实现了web端的音频无限剪裁，合并等编辑功能</p></li></ul>',
              },
            ],
          },
          {
            id: "p2",
            type: "project",
            visible: true,
            fields: [
              {
                id: "name",
                type: "text",
                value: "停车智慧大屏",
              },
              {
                id: "role",
                type: "text",
                value: "前端架构",
              },
              {
                id: "date",
                type: "text",
                value: "2024/8 - 2024/10",
              },
              {
                id: "link",
                type: "text",
                value: "",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>描述：3D效果的停车智慧大屏</p></li><li><p>成果：架构项目，采用Three.js渲染大屏地图，配合GSAP动效，提升了页面科技感</p></li><li><p>成果：引进unocss、tailwindcss技术增强了多项目层面的CSS复用率。</p></li></ul>',
              },
            ],
            value: "微信小程序开发者工具",
          },
          {
            id: "p3",
            type: "project",
            visible: true,
            fields: [
              {
                id: "name",
                type: "text",
                value: "绚星教育平台",
              },
              {
                id: "role",
                type: "text",
                value: "前端负责人",
              },
              {
                id: "date",
                type: "text",
                value: "2022-01 ~ 2023-1",
              },
              {
                id: "link",
                type: "text",
                value: "",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>描述：一款为企业打造的智能化学习平台，支持私有化部署。</p></li><li><p>成果：改造了业务组件打包分成多模块打包，实现了性能优化，Lighthouse测试数据所有页面加载平局减少约1.2s。</p></li><li><p>成果：采用G6(Canvas)自定义节点来实现多级审核流程的可视化拖拽编排，并且封装成SDK开放到其他团队，开箱即用并且体验更流畅。</p></li><li><p>成果：推进网页安全改造，接入国密加密，端读写分离，利用XSS插件解决所有项目的XSS安全漏洞。</p></li><li><p>成果：抽象了H5,PC等各业务处的IM通信逻辑，封装im-sdk包，加入adapter层支持了一键切换服务商，方便扩展。</p></li><li><p>成果：设计实现基于 Egg 架构的多端扫码统一登录方案。</p></li></ul>',
              },
            ],
            value: "前端监控平台",
          },
          {
            id: "3d55e0f5-5802-4006-acc5-5d3f6ec14a5f",
            type: "project",
            visible: true,
            fields: [
              {
                id: "name",
                type: "text",
                value: "掌⻔少⼉直播",
              },
              {
                id: "role",
                type: "text",
                value: "核心开发者",
              },
              {
                id: "date",
                type: "text",
                value: "2018-9 ~ 2020-10",
              },
              {
                id: "link",
                type: "text",
                value: "",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>描述： 通过直播视频给学员上课的客户端，基于Electron技术。</p></li></ul><ul class="custom-list"><li><p>成果：封装zegoliveroom包，使Zego, Agora接口一致，实现直播服务商动态切换，同时被接入多个项目。成果：研究了c++编译，实现了ffmpeg的静态重编译，减小了客户端60M体积。</p></li><li><p>成果：开发项⽬脚⼿架，快速生成微前端子项目。</p></li></ul>',
              },
            ],
          },
        ],
      },
      {
        id: "education",
        title: "教育经历",
        enabled: true,
        order: 4,
        content: [
          {
            id: "1",
            type: "education",
            visible: true,
            fields: [
              { id: "school", type: "text", value: "无锡职业技术学院" },
              {
                id: "major",
                type: "text",
                value: "计算机网络技术系",
              },
              {
                id: "degree",
                type: "text",
                value: "专科",
              },
              {
                id: "start-date",
                type: "text",
                value: "2012-08-31T16:00:00.000Z",
              },
              {
                id: "end-date",
                type: "text",
                value: "2015-07-14T16:00:00.000Z",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>主修课程：计算机网络</p></li></ul>',
              },
            ],
          },
          {
            id: "03c7de30-7a33-4cbc-8e86-90e45219a068",
            type: "education",
            visible: true,
            fields: [
              { id: "school", type: "text", value: "江苏开放大学" },
              {
                id: "major",
                type: "text",
                value: "行政管理",
              },
              {
                id: "degree",
                type: "text",
                value: "本科",
              },
              {
                id: "start-date",
                type: "text",
                value: "2023-02-28T16:00:00.000Z",
              },
              {
                id: "end-date",
                type: "text",
                value: "2025-07-14T16:00:00.000Z",
              },
              {
                id: "description",
                type: "textarea",
                value:
                  '<ul class="custom-list"><li><p>主修课程：行政管理</p></li></ul>',
              },
            ],
          },
        ],
      },
      {
        id: "introduction",
        title: "关于我",
        enabled: true,
        order: 5,
        content: [
          {
            id: "description",
            type: "textarea",
            value:
              "<p>9年开发经验，有带前端组经验；具备丰富的前端架构、问题定位解决、性能优化、安全优化经验；全栈开发有Java、Php开发经验，熟练使用各种AI开发工具。</p>",
          },
        ],
      },
    ],
    createdAt: "2025-11-01T11:19:55.318098+00:00",
    updatedAt: "2025-11-01T11:19:55.318098+00:00",
    isPublic: true,
    publicPassword: null,
  };
  return NextResponse.json(resume);
}
