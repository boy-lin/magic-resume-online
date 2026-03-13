"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui-lab/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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

type UpdatePasswordForm = z.infer<typeof formSchema>;

const ForgotPwdPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<UpdatePasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function updatePassword(values: UpdatePasswordForm) {
    const res = await fetch("/api/account/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: values.password.trim(),
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        error: data?.error || "密码更新失败，请稍后重试",
      };
    }

    return { error: null as string | null };
  }

  async function onSubmit(values: UpdatePasswordForm) {
    if (values.password.trim() !== values.passwordConfirm.trim()) {
      return toast.error("更新密码错误", {
        description: "密码不匹配",
      });
    }

    setIsSubmitting(true);
    try {
      const result = await updatePassword(values);

      if (result.error) {
        toast.error("更新密码错误", {
          description: result.error,
        });
        return;
      }

      toast.success("密码更新成功");
      router.push("/account/signin");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
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
