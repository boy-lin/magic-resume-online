import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/toasts/use-toast";
import { isSupportClipboardWrite, textToBlob } from "@/utils/copy";
import { useLocale } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";

const Btn = () => {
  const [loading, setLoading] = useState(null);
  const t = useTranslations("common");
  const { activeResume } = useResumeStore();

  const onCopyLink = async () => {
    try {
      const target = `${window.origin}/app/resumes-preview/${activeResume.id}/`;
      setLoading(true);
      const canWrite = await isSupportClipboardWrite();
      if (!canWrite || !window.ClipboardItem || !navigator.clipboard?.write) {
        throw Error("broswer not supported!");
      }
      const blob = textToBlob(target);
      const data = [new window.ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
      toast({
        title: t("msg.successT"),
        description: "复制完成",
      });
    } catch (e) {
      toast({
        title: t("msg.errT"),
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Share />
          {t("btn.share")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-base">
          通过Web分享此简历
        </DropdownMenuLabel>
        <div className="px-2 py-1.5 text-sm">权限：获得此链接的任何人</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant="ghost" onClick={onCopyLink} disabled={loading}>
            <Link2 />
            复制连接
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Btn;
