"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui-lab/button";
import { Input } from "@/components/ui/input";
import { setLocalStorageByName, getLocalStorageByName } from "@/utils/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErrorRedirect, getFeedbackRedirect } from "@/utils/helpers";
import { isValidEmail } from "@/utils/reg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
});

const ForgotPwdPage = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function requestPasswordUpdate(values: z.infer<typeof formSchema>) {
    const email = values.email.trim();

    if (!isValidEmail(email)) {
      return getErrorRedirect(
        "/account/forgot-pwd",
        "电子邮件地址无效",
        "请重试。"
      );
    }

    try {
      const res = await fetch("/api/external/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "密码重置",
          text: `请点击以下链接重置密码：${window.location.origin}/account/update-pwd`,
        }),
      });

      if (!res.ok) {
        return getErrorRedirect(
          "/account/forgot-pwd",
          "无法发送密码重置电子邮件。",
          "请重试。"
        );
      }

      return getFeedbackRedirect(
        "/feedback/success",
        "成功。",
        "请查看您的电子邮件，获取密码重置链接。您现在可以关闭此页面了。"
      );
    } catch {
      return getErrorRedirect(
        "/account/forgot-pwd",
        "无法发送密码重置电子邮件。",
        "请重试。"
      );
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const redirectUrl = await requestPasswordUpdate(values);
    setIsSubmitting(false);
    router.push(redirectUrl);
  }

  useEffect(() => {
    const email = getLocalStorageByName("userEmail");
    form.setValue("email", email);
  }, []);

  return (
    <div className="w-full max-w-md rounded-xl bg-white ring-1 shadow-md ring-black/5">
      <div className="p-7 sm:p-11">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Logo size={48} />
          </Link>
          <div>
            <h1 className="text-base/6 font-medium">
              {t("account.forgot.title")}
            </h1>
            <p className="text-sm/5 text-gray-600">{t("account.forgot.sub")}</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account.field.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={isSubmitting} className="w-full" type="submit">
              {t("common.btn.next")}
            </Button>
          </form>
        </Form>
      </div>
      <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
        <Link href="/account/signin" className="font-light text-sm">
          {t("account.signWP")}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPwdPage;
