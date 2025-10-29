import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Magic Resume - 在线简历编辑器",
    short_name: "ResumeX",
    description: "功能强大的在线简历编辑器，支持多种模板和格式导出",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon2.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["productivity", "utilities"],
    shortcuts: [
      {
        name: "创建简历",
        short_name: "创建",
        description: "快速创建新简历",
        url: "/app/dashboard?action=new",
        icons: [{ src: "/icon.png", sizes: "96x96" }],
      },
    ],
  };
}
