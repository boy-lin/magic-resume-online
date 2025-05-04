"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "@/components/shared/Logo";
import { updatePassword } from "@/utils/auth-helpers/server";
import { Button } from "@/components/ui-lab/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/toasts/use-toast";
import { setLocalStorageByName, getLocalStorageByName } from "@/utils/storage";
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

const formSchema = z.object({
  password: z.string().min(5, { message: "Must be 5 or more characters long" }),
  passwordConfirm: z
    .string()
    .min(5, { message: "Must be 5 or more characters long" }),
});

const ForgotPwdPage = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password.trim() !== values.passwordConfirm.trim()) {
      return toast({
        title: "更新密码错误",
        description: "密码不匹配。",
        variant: "destructive",
      });
    }
    setIsSubmitting(true);
    const redirectUrl = await updatePassword(values);
    setIsSubmitting(false);
    router.push(redirectUrl);
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white ring-1 shadow-md ring-black/5">
      <div className="p-7 sm:p-11">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Logo size={48} />
          </Link>
          <div>
            <h1 className="text-base/6 font-medium">重置密码</h1>
            <p className="text-sm/5 text-gray-600">登录您的帐户以继续。</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认新密码</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={isSubmitting} className="w-full" type="submit">
              更新密码
            </Button>
          </form>
        </Form>
      </div>
      <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
        <Link href="/account/signin" className="font-light text-sm">
          去登录页面
        </Link>
      </div>
    </div>
  );
};

export default ForgotPwdPage;
