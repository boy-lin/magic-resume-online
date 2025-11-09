import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui-lab/button";
import { Share, Link2, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { isSupportClipboardWrite, textToBlob } from "@/utils/copy";
import { useResumeStore } from "@/store/resume/useResumeStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui-lab/switch";
import { createClient } from "@/utils/supabase/client";
import DownloadBtn from "./share/download-btn";
import PrintBtn from "./share/print-btn";
import JsonBtn from "./share/json-btn";
import ImageBtn from "./share/image-btn";
import { cn } from "@/lib/utils";
import { generateRandomString } from "@/utils";
import {
  publicResumeById,
  setPublicResumeById,
} from "@/utils/supabase/queries";

const ShareBtn = () => {
  const [loading, setLoading] = useState(null);
  const t = useTranslations("common");
  const ts = useTranslations("share");
  const { activeResume } = useResumeStore();
  const [permission, setPermission] = useState("view");
  const [openPassword, setOpenPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [openPublic, setOpenPublic] = useState(false);
  const [openPublicLoading, setOpenPublicLoading] = useState(false);
  const [openPasswordLoading, setOpenPasswordLoading] = useState(false);

  const canCopyLink = openPublic && !loading;

  const onCopyLink = async () => {
    try {
      setLoading(true);
      let target = `${window.origin}/preview/${activeResume.id}`;

      if (openPassword) {
        // 换行符 \n 空格符 \s
        target += `# 密码：${password}`;
      }

      const canWrite = await isSupportClipboardWrite();
      if (!canWrite || !window.ClipboardItem || !navigator.clipboard?.write) {
        throw Error("browser not supported!");
      }
      const blob = textToBlob(target);
      const data = [new window.ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
      toast.success(t("message.success"), {
        description: "copy resume url success",
      });
    } catch (e) {
      toast.error(t("message.error"), {
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onPublicChange = async (val) => {
    setOpenPublicLoading(true);
    try {
      const supabase = createClient();
      const res = await publicResumeById(supabase, activeResume.id, val);
      if (res.error) {
        toast.error(t("message.error"), {
          description: res.error.message,
        });
        return;
      }
      setOpenPublic(val);
    } finally {
      setOpenPublicLoading(false);
    }
  };

  const onPasswordChange = async (val) => {
    setOpenPasswordLoading(true);
    try {
      const supabase = createClient();
      const res = await setPublicResumeById(
        supabase,
        activeResume.id,
        val ? password : ""
      );
      if (res.error) {
        toast.error(t("message.error"), {
          description: res.error.message,
        });
        return;
      }
      setOpenPassword(val);
    } finally {
      setOpenPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (!activeResume) return;
    // console.log("aa2 activeResume", activeResume);
    setOpenPublic(activeResume.isPublic);
    if (activeResume.publicPassword) {
      setOpenPassword(true);
    }
    setPassword(activeResume.publicPassword || generateRandomString());
  }, [activeResume]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-foreground">
          <Share />
          {t("btn.share")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-120">
        {/* <div className="px-2 py-1.5 text-sm">权限：获得此链接的任何人</div> */}
        <div className="flex items-center gap-2 text-lg font-semibold mb-2">
          {ts("title")}
        </div>
        <div className="space-y-6 min-w-[328px]">
          {/* 访问级别 */}
          <div>
            <div className="font-semibold mb-2 flex justify-between">
              <span>{ts("label.public")}</span>
              <span>
                <Switch
                  checked={openPublic}
                  onCheckedChange={onPublicChange}
                  loading={openPublicLoading}
                />
              </span>
            </div>
            <div
              className={cn("flex items-center gap-2 p-3 bg-muted rounded", {
                hidden: !openPublic,
              })}
            >
              <Globe className="w-5 h-5 text-muted-foreground mr-2" />
              <div className="flex-1">
                <div>获得此链接的任何人</div>
                <div className="text-xs text-muted-foreground">
                  必须使用链接才能访问
                </div>
              </div>
              <Select value={permission} onValueChange={setPermission} disabled>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">可查看</SelectItem>
                  <SelectItem value="edit">可编辑</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* 链接密码及有效期 */}
          <div className="space-y-3">
            <div className="font-semibold mb-2 flex justify-between">
              <span>{ts("label.password")}</span>
              <div>
                <Switch
                  disabled={!openPublic}
                  checked={openPassword}
                  onCheckedChange={onPasswordChange}
                  loading={openPasswordLoading}
                />
              </div>
            </div>
            <div
              className={cn("flex gap-2 items-center", {
                hidden: !openPassword,
              })}
            >
              <Label htmlFor="share-password" className="w-20">
                密码
              </Label>
              <Input
                disabled
                id="share-password"
                type="text"
                max={6}
                placeholder="可选，访问需输入"
                className="flex-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* 复制链接按钮 */}
          <Button
            className="w-full"
            onClick={onCopyLink}
            disabled={!canCopyLink}
            loading={loading}
          >
            <Link2 className="mr-2" />
            {ts("btns.copyLink")}
          </Button>
        </div>
        <div className="flex justify-between gap-2 pt-4">
          <DownloadBtn activeResume={activeResume} />
          <PrintBtn activeResume={activeResume} />
          <JsonBtn activeResume={activeResume} />
          <ImageBtn activeResume={activeResume} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareBtn;
