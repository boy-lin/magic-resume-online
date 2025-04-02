"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LocaleLayout({ children }) {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <div>设置</div>
        <div></div>
      </div>
      <main>{children}</main>
    </div>
  );
}
