"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "@/components/shared/Logo";
import { signIn } from "next-auth/react";
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

const RegisterPage = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const formSchema = React.useMemo(
    () =>
      z.object({
        fullName: z.string().min(5, { message: t("account.invalid.fName") }),
        email: z.string().email({
          message: t("account.invalid.email"),
        }),
        password: z.string().min(5, { message: t("account.invalid.minFive") }),
        confirmPassword: z
          .string()
          .min(5, { message: t("account.invalid.minFive") }),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.confirmPassword !== values.password) {
      return toast.error(t("common.message.error"), {
        description: t("account.invalid.pwdUnequal"),
      });
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/account/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(t("common.message.error"), {
          description:
            data?.error || "注册失败，请检查信息后重试",
        });
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!signInResult || signInResult.error) {
        toast.error(t("common.message.error"), {
          description:
            signInResult?.error ||
            "注册成功，但自动登录失败，请手动登录",
        });
        return;
      }

      toast.success(t("common.message.success"), {
        description: "注册并登录成功",
      });

      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Logo size={48} />
          </Link>
          <div>
            <h1 className="text-base/6 font-medium">
              {t("account.signup.title")}
            </h1>
            <p className="text-sm/5 text-gray-600">{t("account.signup.sub")}</p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account.field.fName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jack"
                      autoComplete="fullName"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account.field.email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account.field.pwd")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account.field.confirmPwd")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={isSubmitting} className="w-full" type="submit">
              {t("common.btn.signU")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
