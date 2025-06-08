"use client";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { InitDataProvider } from "./init-data";
// ----------------------------------------------------------------------

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InitDataProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="magic-resume-theme"
      >
        {children}
        <Toaster />
      </ThemeProvider>
      <Analytics />
    </InitDataProvider>
  );
}
