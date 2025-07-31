"use client";
import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui-lab/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { updateUserInfoById } from "@/utils/supabase/queries";
import { useAppStore } from "@/store/useApp";
import { DEFAULT_AVATAR } from "@/constants";

/**
 * 个人信息设置页面组件
 * 支持头像上传、URL设置和姓名修改功能
 * @returns JSX.Element
 */

const Page = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const user = useAppStore((state) => state.user) || {};
  const supabase = createClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const formSchema = React.useMemo(
    () =>
      z.object({
        fullName: z.string().min(5, { message: t("account.invalid.minFive") }),
        avatarUrl: z.string(),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.user_metadata?.full_name,
      avatarUrl: user.user_metadata?.avatar_url || DEFAULT_AVATAR,
    },
  });

  // 初始化预览URL和表单默认值
  React.useEffect(() => {
    const avatarUrl = form.getValues("avatarUrl");
    setPreviewUrl(avatarUrl || DEFAULT_AVATAR);
  }, [form]);

  // 当用户信息更新时，重新设置表单默认值
  React.useEffect(() => {
    if (user.user_metadata) {
      form.setValue("fullName", user.user_metadata.full_name || "");
      form.setValue(
        "avatarUrl",
        user.user_metadata.avatar_url || DEFAULT_AVATAR
      );
      setPreviewUrl(user.user_metadata.avatar_url || DEFAULT_AVATAR);
    }
  }, [user.user_metadata, form]);

  /**
   * 文件上传处理函数
   * 支持图片文件上传到服务器并更新头像URL
   * @param file - 要上传的文件
   */
  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("account.setting.avatar.error.sizeLimit"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t("account.setting.avatar.error.typeLimit"));
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", file.name);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (res.code !== 0) {
        toast.error(res.message);
        return;
      }

      setPreviewUrl(res.data);
      form.setValue("avatarUrl", res.data);
      toast.success(t("account.setting.avatar.success.upload"));
    } catch (error) {
      toast.error(t("account.setting.avatar.error.uploadFailed"));
    } finally {
      setUploadLoading(false);
    }
  };

  /**
   * 文件选择处理函数
   * 处理文件输入框的变化事件
   * @param event - 文件输入事件
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * URL输入处理函数
   * 验证图片URL的有效性并更新预览
   * @param url - 图片URL地址
   */
  const handleUrlChange = async (url: string) => {
    const trimmedUrl = url.trim();
    form.setValue("avatarUrl", trimmedUrl);

    if (!trimmedUrl) {
      setPreviewUrl(DEFAULT_AVATAR);
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(t("account.setting.avatar.error.timeout")));
        }, 10000);
        img.onload = () => {
          clearTimeout(timer);
          resolve(undefined);
        };
        img.onerror = () => {
          clearTimeout(timer);
          reject(new Error(t("account.setting.avatar.error.loadError")));
        };
        img.src = trimmedUrl;
      });

      setPreviewUrl(trimmedUrl);
      toast.success(t("account.setting.avatar.success.urlSet"));
    } catch (error) {
      toast.error(t("account.setting.avatar.error.invalidUrl"));
      setPreviewUrl(DEFAULT_AVATAR);
    }
  };

  /**
   * 拖拽处理函数组
   * 支持拖拽上传图片文件
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * 移除头像函数
   * 重置头像为默认头像
   */
  const handleRemovePhoto = () => {
    setPreviewUrl(DEFAULT_AVATAR);
    form.setValue("avatarUrl", DEFAULT_AVATAR);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /**
   * 表单提交处理函数
   * 更新用户个人信息到数据库和Auth元数据
   * @param values - 表单数据
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // 更新数据库和Auth中的用户信息
      const { error } = await updateUserInfoById(supabase, user.id, values);
      if (error) {
        toast.error(t("account.setting.error.update"));
        return;
      }

      // 重新获取用户信息并更新store
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();
      console.log("更新前的用户信息:", user);
      console.log("更新后的用户信息:", updatedUser);
      if (updatedUser) {
        useAppStore.getState().setUser(updatedUser);
        console.log("Store已更新");
      }

      toast.success(t("account.setting.success.update"));
      router.back();
    } catch (e) {
      console.error("更新用户信息失败:", e);
      toast.error(t("account.setting.error.update"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 头像设置区域 */}
          <div className="space-y-4">
            <FormLabel className="text-base font-medium">
              {t("account.setting.avatar.title")}
            </FormLabel>

            {/* 头像预览和上传区域 */}
            <div className="flex items-start gap-6">
              {/* 头像预览 */}
              <div className="relative">
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="头像预览"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                {uploadLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              {/* 上传控制区域 */}
              <div className="flex-1 space-y-4">
                {/* 拖拽上传区域 */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("account.setting.avatar.upload.dragHint")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {t("account.setting.avatar.upload.sizeLimit")}
                    </p>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadLoading}
                  />
                </div>
              </div>
            </div>

            {/* 头像URL输入 */}
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("account.setting.avatar.upload.urlLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "account.setting.avatar.upload.urlPlaceholder"
                      )}
                      className="h-20 resize-none"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleUrlChange(e.target.value);
                      }}
                      disabled={uploadLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 姓名输入 */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("account.field.fName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("account.field.fName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 提交按钮 */}
          <Button loading={isSubmitting} className="w-full" type="submit">
            {t("common.btn.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page; // Cursor
