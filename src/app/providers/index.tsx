// "use client";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/toasts/toaster";
import { AppProvider } from "./app";
// ----------------------------------------------------------------------

export function Providers({ children }: { children: React.ReactNode }) {
  console.debug("Providers render");
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="magic-resume-theme"
    >
      <AppProvider>{children}</AppProvider>
      <Analytics />
      <Suspense>
        <Toaster />
      </Suspense>
    </ThemeProvider>
  );
}
