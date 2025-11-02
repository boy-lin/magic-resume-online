"use client";
import React, { useState } from "react";
import { Settings2, Image as ImageIcon, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PhotoConfigDrawer from "./PhotoConfigDrawer";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";
import { PhotoConfig, ResumeSectionContent } from "@/types/resume";
import { useTranslations } from "next-intl";
import useResumeListStore from "@/store/resume/useResumeListStore";
import Image from "next/image";

interface Props {
  className?: string;
  photo: ResumeSectionContent;
  updatePhoto: (value: ResumeSectionContent) => void;
}

const PhotoSelector: React.FC<Props> = ({ className, photo, updatePhoto }) => {
  const t = useTranslations("workbench");
  const [showConfig, setShowConfig] = useState(false);

  const handlePhotoChange = (val: Partial<ResumeSectionContent>) => {
    updatePhoto({ ...photo, ...val });
  };

  const handleConfigChange = (config: PhotoConfig) => {
    updatePhoto({
      ...photo,
      config: {
        ...photo.config,
        ...config,
      },
    });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowConfig(true)}
        >
          {photo.value ? (
            <Image
              src={photo.value}
              alt="Selected"
              className="w-[48px] h-[48px] rounded"
              width={48}
              height={48}
            />
          ) : (
            <div>
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t("basicPanel.avatar")}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => setShowConfig(true)}
          >
            <Settings2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => {
              handleConfigChange({
                visible: !photo.config?.visible,
              });
            }}
          >
            {photo.config?.visible !== false ? (
              <Eye className="w-4 h-4 text-primary" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <PhotoConfigDrawer
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
        photo={photo.value}
        config={photo.config}
        onPhotoChange={handlePhotoChange}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
};

export default PhotoSelector;
