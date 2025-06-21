import { useMemo } from "react";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_COLORS } from "@/types/resume";
import { useResumeStore } from "@/store/useResumeStore";
import { useTranslations } from "next-intl";
import { debounce } from "lodash";
import { SettingCard } from "./SettingCard";

export function ColorSetting() {
  const { activeResume, setThemeColor } = useResumeStore();
  const { globalSettings = {} } = activeResume || {};
  const { themeColor = THEME_COLORS[0] } = globalSettings;
  const t = useTranslations("workbench.sidePanel");

  const debouncedSetColor = useMemo(
    () =>
      debounce((value) => {
        setThemeColor(value);
      }, 100),
    []
  );

  return (
    <div className="space-y-4 p-2">
      <h3 className={cn("dark:text-neutral-200", "text-gray-700")}>
        {t("theme.title")}
      </h3>
      <div className="space-y-2">
        <div className="grid grid-cols-6 gap-2">
          {THEME_COLORS.map((presetTheme) => (
            <button
              key={presetTheme}
              className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                themeColor === presetTheme
                  ? "border-black dark:border-white"
                  : "dark:border-neutral-800 dark:hover:border-neutral-700 border-gray-100 hover:border-gray-200"
              )}
              onClick={() => setThemeColor(presetTheme)}
            >
              {/* 颜色展示 */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: presetTheme }}
              />

              {/* 选中指示器 */}
              {themeColor === presetTheme && (
                <motion.div
                  layoutId="theme-selected"
                  className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-white/20"
                  initial={false}
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white dark:bg-black" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("theme.custom")}
          </div>
          <motion.input
            type="color"
            value={themeColor}
            onChange={(e) => debouncedSetColor(e.target.value)}
            className="w-[40px] h-[40px] rounded-lg cursor-pointer overflow-hidden hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>
  );
}
