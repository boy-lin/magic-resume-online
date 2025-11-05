import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/store/resume/useResumeStore";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";

export default function Name() {
  const { activeResume } = useResumeStore();
  const { updateResumeTitle } = useResumeStore();
  const { loading, runAsync } = useRequest(
    async (title: string) => {
      await updateResumeTitle(title);
    },
    {
      manual: true,
    }
  );

  return (
    <div className="flex items-center gap-2">
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <Input
        disabled={loading}
        defaultValue={activeResume?.title || ""}
        onBlur={(e) => {
          runAsync(e.target.value || "未命名简历");
        }}
        className="w-60  text-sm hidden md:block"
        placeholder="简历名称"
      />
    </div>
  );
}
