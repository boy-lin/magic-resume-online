"use client";
import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Layout, Type, SpaceIcon, Palette, Zap } from "lucide-react";
import debounce from "lodash/debounce";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LayoutSetting from "./layout/LayoutSetting";
import { useResumeStore } from "@/store/resume/useResumeStore";
import { useResumeSettingsStore } from "@/store/resume/useResumeSettingsStore";

import { cn } from "@/lib/utils";
import { THEME_COLORS } from "@/types/resume";

// 字体大小选项
const FONT_SIZE_OPTIONS = [12, 13, 14, 15, 16, 18, 20, 24];

/**
 * 设置卡片组件
 * 用于包装各种设置项，提供统一的样式和布局
 */
interface SettingCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}

function SettingCard({ icon: Icon, title, children }: SettingCardProps) {
  return (
    <Card
      className={cn(
        "border shadow-sm",
        "dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-900/50",
        "bg-white border-gray-100 shadow-gray-100/50"
      )}
    >
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Icon
            className={cn("w-4 h-4 text-gray-600", "dark:text-neutral-300")}
          />
          <span className={cn("dark:text-neutral-200", "text-gray-700")}>
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

/**
 * 数字输入组件
 * 提供滑块和数字输入框的组合控制
 */
interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit?: string;
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  label,
  unit = "px",
}: NumberInputProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue);
      }
    },
    [onChange, min, max]
  );

  const handleIncrement = useCallback(() => {
    if (value < max) {
      onChange(value + step);
    }
  }, [value, max, step, onChange]);

  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - step);
    }
  }, [value, min, step, onChange]);

  return (
    <div className="space-y-2">
      <Label className="text-gray-600 dark:text-neutral-300">{label}</Label>
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([newValue]) => onChange(newValue)}
          className="flex-1"
        />
        <div className="flex items-center">
          <div className="flex h-8 w-20 overflow-hidden rounded-md border border-input">
            <Input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleInputChange}
              className="h-full w-12 border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 no-spinner"
            />
            <div className="flex flex-col border-l border-input">
              <button
                type="button"
                className="flex h-4 w-8 items-center justify-center border-b border-input bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleIncrement}
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
                onClick={handleDecrement}
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
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 主题色选择组件
 */
interface ThemeColorSelectorProps {
  themeColor: string;
  onThemeChange: (color: string) => void;
  t: (key: string) => string;
}

function ThemeColorSelector({
  themeColor,
  onThemeChange,
  t,
}: ThemeColorSelectorProps) {
  const debouncedSetColor = useMemo(
    () => debounce(onThemeChange, 100),
    [onThemeChange]
  );

  return (
    <div className="space-y-4">
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
            onClick={() => onThemeChange(presetTheme)}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: presetTheme }}
            />
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

      <div className="flex flex-col gap-4">
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
  );
}

/**
 * 侧边栏面板组件
 * 提供简历编辑的各种设置选项
 */
export function SidePanel() {
  const { activeResume } = useResumeStore();
  const { updateGlobalSettings, setThemeColor } = useResumeSettingsStore();
  const { addMenuSection } = useResumeStore();
  const { globalSettings = {} } = activeResume || {};
  const { themeColor = THEME_COLORS[0] } = globalSettings;
  const t = useTranslations("workbench.sidePanel");

  // 更新全局设置
  const handleUpdateGlobalSettings = useCallback(
    (updates: Partial<typeof globalSettings>) => {
      updateGlobalSettings?.(updates);
    },
    [updateGlobalSettings]
  );

  return (
    <motion.div
      className={cn(
        "w-[80] border-r overflow-y-auto",
        "dark:bg-neutral-950 dark:border-neutral-800",
        "bg-gray-50 border-gray-100"
      )}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="p-2 space-y-2">
        {/* 布局设置 */}
        <SettingCard icon={Layout} title={t("layout.title")}>
          <LayoutSetting />
          <div className="space-y-2 py-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.9 }}
              onClick={addMenuSection}
              className="flex justify-center w-full rounded-lg items-center gap-2 py-2 px-3 text-sm font-medium text-primary bg-indigo-50"
            >
              {t("layout.addCustomSection")}
            </motion.button>
          </div>
        </SettingCard>

        {/* 主题色设置 */}
        <SettingCard icon={Palette} title={t("theme.title")}>
          <ThemeColorSelector
            themeColor={themeColor}
            onThemeChange={setThemeColor}
            t={t}
          />
        </SettingCard>

        {/* 排版设置 */}
        <SettingCard icon={Type} title={t("typography.title")}>
          <div className="space-y-6">
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
                    handleUpdateGlobalSettings({ lineHeight: value })
                  }
                />
                <span className="min-w-[3ch] text-sm text-gray-600 dark:text-neutral-300">
                  {globalSettings?.lineHeight}
                </span>
              </div>
            </div>

            {/* 基础字体大小 */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-neutral-300">
                {t("typography.baseFontSize.title")}
              </Label>
              <Select
                value={globalSettings?.baseFontSize?.toString()}
                onValueChange={(value) =>
                  handleUpdateGlobalSettings({ baseFontSize: parseInt(value) })
                }
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
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
                  {FONT_SIZE_OPTIONS.map((size) => (
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

            {/* 标题字体大小 */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-neutral-300">
                {t("typography.headerSize.title")}
              </Label>
              <Select
                value={globalSettings?.headerSize?.toString()}
                onValueChange={(value) =>
                  handleUpdateGlobalSettings({ headerSize: parseInt(value) })
                }
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
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
                  {FONT_SIZE_OPTIONS.map((size) => (
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

            {/* 副标题字体大小 */}
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-neutral-300">
                {t("typography.subheaderSize.title")}
              </Label>
              <Select
                value={globalSettings?.subheaderSize?.toString()}
                onValueChange={(value) =>
                  handleUpdateGlobalSettings({ subheaderSize: parseInt(value) })
                }
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
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
                  {FONT_SIZE_OPTIONS.map((size) => (
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
        </SettingCard>

        {/* 间距设置 */}
        <SettingCard icon={SpaceIcon} title={t("spacing.title")}>
          <div className="space-y-6">
            <NumberInput
              value={globalSettings?.pagePadding || 0}
              onChange={(value) =>
                handleUpdateGlobalSettings({ pagePadding: value })
              }
              min={0}
              max={100}
              step={1}
              label={t("spacing.pagePadding.title")}
            />

            <NumberInput
              value={globalSettings?.sectionSpacing || 0}
              onChange={(value) =>
                handleUpdateGlobalSettings({ sectionSpacing: value })
              }
              min={1}
              max={100}
              step={1}
              label={t("spacing.sectionSpacing.title")}
            />

            <NumberInput
              value={globalSettings?.paragraphSpacing || 0}
              onChange={(value) =>
                handleUpdateGlobalSettings({ paragraphSpacing: value })
              }
              min={1}
              max={50}
              step={1}
              label={t("spacing.paragraphSpacing.title")}
            />
          </div>
        </SettingCard>

        {/* 模式设置 */}
        <SettingCard icon={Zap} title={t("mode.title")}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-neutral-300">
                {t("mode.useIconMode.title")}
              </Label>
              <div className="flex items-center gap-4">
                <Switch
                  checked={globalSettings.useIconMode}
                  onCheckedChange={(checked) =>
                    handleUpdateGlobalSettings({ useIconMode: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 dark:text-neutral-300">
                {t("mode.centerSubtitle.title")}
              </Label>
              <div className="flex items-center gap-4">
                <Switch
                  checked={globalSettings.centerSubtitle}
                  onCheckedChange={(checked) =>
                    handleUpdateGlobalSettings({ centerSubtitle: checked })
                  }
                />
              </div>
            </div>
          </div>
        </SettingCard>
      </div>
    </motion.div>
  );
}
