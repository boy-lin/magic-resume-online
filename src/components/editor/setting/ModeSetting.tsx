import { Switch } from "@/components/ui-lab/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";

export function ModeSetting() {
  const { activeResume, updateGlobalSettings } = useResumeStore();
  const { globalSettings = {} } = activeResume || {};
  const t = useTranslations("workbench.sidePanel");

  return (
    <div className="space-y-4 p-2">
      <h3 className="tracking-tight text-base font-medium">
        {t("mode.title")}
      </h3>
      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("mode.useIconMode.title")}
          </Label>
          <div className="flex items-center gap-4">
            <Switch
              checked={globalSettings.useIconMode}
              onCheckedChange={(checked) =>
                updateGlobalSettings({
                  useIconMode: checked,
                })
              }
            />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Label className="text-gray-600 dark:text-neutral-300">
            {t("mode.centerSubtitle.title")}
          </Label>
          <div className="flex items-center gap-4">
            <Switch
              checked={globalSettings.centerSubtitle}
              onCheckedChange={(checked) =>
                updateGlobalSettings({
                  centerSubtitle: checked,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
