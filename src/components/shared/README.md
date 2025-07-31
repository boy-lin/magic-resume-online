# 共享组件使用说明

## 错误处理组件

### 1. ErrorBoundary 组件

用于捕获 React 组件树中的 JavaScript 错误，记录错误信息，并显示降级 UI。

```tsx
import ErrorBoundary from "@/components/shared/ErrorBoundary";

// 基本使用
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// 自定义错误处理
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.log("捕获到错误:", error, errorInfo);
    // 可以发送错误到日志服务
  }}
>
  <YourComponent />
</ErrorBoundary>

// 自定义降级 UI
<ErrorBoundary
  fallback={<div>自定义错误页面</div>}
>
  <YourComponent />
</ErrorBoundary>
```

### 2. ErrorDisplay 组件

用于显示错误信息的通用组件，支持自定义样式和操作。

```tsx
import ErrorDisplay from "@/components/shared/ErrorDisplay";

// 基本使用
<ErrorDisplay
  error={new Error("错误信息")}
  onRetry={() => console.log("重试")}
/>

// 完整配置
<ErrorDisplay
  error={error}
  onRetry={handleRetry}
  onClose={handleClose}
  title="自定义标题"
  message="自定义消息"
  showRetry={true}
  showClose={true}
  className="custom-class"
/>
```

## Google Tag Manager 集成

### 1. 环境变量配置

在 `.env.local` 文件中添加你的 GTM ID：

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 2. 自动集成

GTM 已经集成到根布局中，会自动在所有页面加载。

### 3. 发送自定义事件

```tsx
import { event, pageview, setUserProperties } from "@/lib/gtm";

// 发送页面浏览事件
pageview("/about");

// 发送自定义事件
event({
  action: "click",
  category: "button",
  label: "download_button",
  value: 1,
});

// 设置用户属性
setUserProperties({
  user_id: "12345",
  user_type: "premium",
});
```

### 4. 在组件中使用

```tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/gtm";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  return null;
}
```

## 使用示例

查看 `ErrorExample.tsx` 文件了解完整的使用示例。
