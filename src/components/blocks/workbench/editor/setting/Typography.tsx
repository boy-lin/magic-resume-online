import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResumeListStore } from "@/store/resume/useResumeListStore";
import { useResumeSettingsStore } from "@/store/resume/useResumeSettingsStore";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AlignSelector from "../basic/AlignSelector";

const fontOptions = [
  { value: "sans", label: "无衬线体" },
  { value: "serif", label: "衬线体" },
  { value: "mono", label: "等宽体" },
];

export function TypographySetting() {
  const { activeResume } = useResumeListStore();
  const { updateGlobalSettings } = useResumeSettingsStore();
  const { globalSettings = {} } = activeResume || {};
  const t = useTranslations("workbench.sidePanel");

  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("typography.font.title")}
          </Label>
          <Select
            value={globalSettings?.fontFamily}
            onValueChange={(value) =>
              updateGlobalSettings?.({ fontFamily: value })
            }
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <SelectTrigger className="border border-gray-200 bg-white text-gray-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                <SelectValue />
              </SelectTrigger>
            </motion.div>
            <SelectContent
              className={cn(
                "dark:bg-neutral-900 dark:border-neutral-800 text-white",
                "bg-white border-gray-200"
              )}
            >
              {fontOptions.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                  className="text-gray-600 cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 行高选择 */}
        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("typography.lineHeight.title")}
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[globalSettings?.lineHeight || 1.5]}
              min={1}
              max={2}
              step={0.1}
              onValueChange={([value]) =>
                updateGlobalSettings?.({ lineHeight: value })
              }
            />
            <span className="min-w-[3ch] text-sm text-gray-600 dark:text-neutral-300">
              {globalSettings?.lineHeight}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("typography.baseFontSize.title")}
          </Label>
          <Select
            value={globalSettings?.baseFontSize?.toString()}
            onValueChange={(value) =>
              updateGlobalSettings?.({ baseFontSize: parseInt(value) })
            }
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <SelectTrigger className="border border-gray-200 bg-white text-gray-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                <SelectValue />
              </SelectTrigger>
            </motion.div>
            <SelectContent
              className={cn(
                "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white",
                "bg-white border-gray-200"
              )}
            >
              {[12, 13, 14, 15, 16, 18, 20, 24].map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("typography.headerSize.title")}
          </Label>
          <Select
            value={globalSettings?.headerSize?.toString()}
            onValueChange={(value) =>
              updateGlobalSettings?.({ headerSize: parseInt(value) })
            }
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <SelectTrigger className="border border-gray-200 bg-white text-gray-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                <SelectValue />
              </SelectTrigger>
            </motion.div>
            <SelectContent
              className={cn(
                "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white",
                "bg-white border-gray-200"
              )}
            >
              {[12, 13, 14, 15, 16, 18, 20, 24].map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("typography.subheaderSize.title")}
          </Label>
          <Select
            value={globalSettings?.subheaderSize?.toString()}
            onValueChange={(value) =>
              updateGlobalSettings?.({ subheaderSize: parseInt(value) })
            }
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <SelectTrigger className="border border-gray-200 bg-white text-gray-700 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                <SelectValue />
              </SelectTrigger>
            </motion.div>
            <SelectContent
              className={cn(
                "dark:bg-neutral-900 dark:border-neutral-800 dark:text-white",
                "bg-white border-gray-200"
              )}
            >
              {[12, 13, 14, 15, 16, 18, 20, 24].map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="tracking-tight flex items-center gap-2 text-base font-medium">
          {t("spacing.title")}
        </h3>
        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("spacing.pagePadding.title")}
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[globalSettings?.pagePadding || 0]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) =>
                updateGlobalSettings?.({ pagePadding: value })
              }
              className="flex-1"
            />
            <div className="flex items-center">
              <div className="flex h-8 w-20 overflow-hidden rounded-md border border-input">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  value={globalSettings?.pagePadding || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 100) {
                      updateGlobalSettings?.({ pagePadding: value });
                    }
                  }}
                  className="h-full w-12 border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                />
                <div className="flex flex-col border-l border-input">
                  <button
                    type="button"
                    className="flex h-4 w-8 items-center justify-center border-b border-input bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      const currentValue = globalSettings?.pagePadding || 0;
                      if (currentValue < 100) {
                        updateGlobalSettings?.({
                          pagePadding: currentValue + 1,
                        });
                      }
                    }}
                  >
                    <span className="sr-only">增加</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex h-4 w-8 items-center justify-center bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      const currentValue = globalSettings?.pagePadding || 0;
                      if (currentValue > 0) {
                        updateGlobalSettings?.({
                          pagePadding: currentValue - 1,
                        });
                      }
                    }}
                  >
                    <span className="sr-only">减少</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <span className="ml-1 text-sm text-gray-600 dark:text-neutral-300">
                px
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("spacing.sectionSpacing.title")}
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[globalSettings?.sectionSpacing || 0]}
              min={1}
              max={100}
              step={1}
              onValueChange={([value]) =>
                updateGlobalSettings?.({ sectionSpacing: value })
              }
              className="flex-1"
            />
            <div className="flex items-center">
              <div className="flex h-8 w-20 overflow-hidden rounded-md border border-input">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  value={globalSettings?.sectionSpacing || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= 100) {
                      updateGlobalSettings?.({ sectionSpacing: value });
                    }
                  }}
                  className="h-full w-12 border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                />
                <div className="flex flex-col border-l border-input">
                  <button
                    type="button"
                    className="flex h-4 w-8 items-center justify-center border-b border-input bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      const currentValue = globalSettings?.sectionSpacing || 0;
                      if (currentValue < 100) {
                        updateGlobalSettings?.({
                          sectionSpacing: currentValue + 1,
                        });
                      }
                    }}
                  >
                    <span className="sr-only">增加</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex h-4 w-8 items-center justify-center bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      const currentValue = globalSettings?.sectionSpacing || 0;
                      if (currentValue > 1) {
                        updateGlobalSettings?.({
                          sectionSpacing: currentValue - 1,
                        });
                      }
                    }}
                  >
                    <span className="sr-only">减少</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <span className="ml-1 text-sm text-gray-600 dark:text-neutral-300">
                px
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("spacing.paragraphSpacing.title")}
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[globalSettings?.paragraphSpacing || 0]}
              min={1}
              max={50}
              step={1}
              onValueChange={([value]) =>
                updateGlobalSettings?.({ paragraphSpacing: value })
              }
              className="flex-1"
            />
            <div className="flex items-center">
              <div className="flex h-8 w-20 overflow-hidden rounded-md border border-input">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  value={globalSettings?.paragraphSpacing || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 1) {
                      updateGlobalSettings?.({ paragraphSpacing: value });
                    }
                  }}
                  className="h-full w-12 border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
                />
                <div className="flex flex-col border-l border-input">
                  <button
                    type="button"
                    className="flex h-4 w-8 items-center justify-center border-b border-input bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      const currentValue =
                        globalSettings?.paragraphSpacing || 0;
                      if (currentValue < 100) {
                        updateGlobalSettings?.({
                          paragraphSpacing: currentValue + 1,
                        });
                      }
                    }}
                  >
                    <span className="sr-only">增加</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex h-4 w-8 items-center justify-center bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      const currentValue =
                        globalSettings?.paragraphSpacing || 0;
                      if (currentValue > 1) {
                        updateGlobalSettings?.({
                          paragraphSpacing: currentValue - 1,
                        });
                      }
                    }}
                  >
                    <span className="sr-only">减少</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <span className="ml-1 text-sm text-gray-600 dark:text-neutral-300">
                px
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
