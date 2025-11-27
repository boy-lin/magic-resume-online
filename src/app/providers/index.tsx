"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Toaster as ToasterUI } from "@/components/toasts/toaster";
import { InitDataProvider } from "./init-data";
import { Suspense } from "react";

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
        <Suspense>
          <Toaster richColors />
          <ToasterUI />
        </Suspense>
      </ThemeProvider>
    </InitDataProvider>
  );
}
