import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeEditorStore } from "@/store/resume/useResumeEditorStore";
import { useResumeListStore } from "@/store/resume/useResumeListStore";

import { DialogProps } from "@radix-ui/react-dialog";
import { MenuSection } from "@/types/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// 表单验证模式
const upsertSectionSchema = z.object({
  title: z
    .string()
    .min(2, "模块名称不能少于2个字符")
    .max(50, "模块名称不能超过50个字符")
    .regex(
      /^[a-zA-Z0-9\u4e00-\u9fa5\s_-]+$/,
      "模块名称只能包含字母、数字、中文、空格、下划线和连字符"
    ),
  description: z.string().max(200, "模块描述不能超过200个字符").optional(),
});

type UpsertSectionFormData = z.infer<typeof upsertSectionSchema>;

interface UpsertSectionProps extends DialogProps {
  title?: string;
  onSuccess?: (section: MenuSection) => void;
  onCancel?: () => void;
}

export function UpsertSection(props: UpsertSectionProps) {
  const { activeResume } = useResumeListStore();
  const menuSections = activeResume?.menuSections || [];
  const { updateMenuSections, addCustomData } = useResumeEditorStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 使用 react-hook-form 和 zod 验证
  const form = useForm<UpsertSectionFormData>({
    resolver: zodResolver(upsertSectionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // 处理表单提交
  const handleSubmit = async (data: UpsertSectionFormData) => {
    try {
      setIsSubmitting(true);
      const sectionId = uuidv4();
      const newSection: MenuSection = {
        id: sectionId,
        title: data.title,
        enabled: true,
        order: menuSections.length,
        icon: "➕",
        description: data.description || "",
      };

      updateMenuSections([...menuSections, newSection]);
      addCustomData(sectionId);

      // 重置表单
      form.reset();
      props.onSuccess?.(newSection);

      // 关闭对话框
      if (props.onOpenChange) {
        props.onOpenChange(false);
      }
    } catch (error) {
      console.error("创建自定义模块失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.reset();
    props.onCancel?.();
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加自定义模块</DialogTitle>
          <DialogDescription>
            创建一个新的自定义模块，用于展示特定的内容或功能。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>模块名称 *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入模块名称，如：项目经验、技能证书等"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>模块描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入模块描述，用于说明该模块的用途（可选）"
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? "创建中..." : "创建模块"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
