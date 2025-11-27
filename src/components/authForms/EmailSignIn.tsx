"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui-lab/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  setLocalStorageByName,
  getLocalStorageByName,
  clearLocalStorage,
} from "@/utils/storage";
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
import { isRememberKey, userEmailKey } from "@/config/key";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";

export default function EmailSignIn() {
  const router = useRouter();
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemember, setIsRemember] = useState<any>(false);

  const formSchema = React.useMemo(
    () =>
      z.object({
        email: z.string().email({
          message: t("account.invalid.email"),
        }),
        password: z.string().min(5, { message: t("account.invalid.minFive") }),
      }),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInWithPassword(values: z.infer<typeof formSchema>) {
    const signInPath = "/account/signin";

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (!result) {
      return getErrorRedirect(
        signInPath,
        "登录失败",
        "登录服务暂时不可用，请稍后重试"
      );
    }

    if (result.error) {
      return getErrorRedirect(signInPath, "登录失败", result.error);
    }

    return getStatusRedirect("/", "成功", "您现在已登录");
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const redirectUrl = await signInWithPassword(values);
    clearLocalStorage();
    if (isRemember) {
      setLocalStorageByName(userEmailKey, values.email);
    } else {
      localStorage.removeItem(userEmailKey);
    }
    setIsSubmitting(false);
    router.push(redirectUrl);
  }

  useEffect(() => {
    const email = getLocalStorageByName(userEmailKey);
    form.setValue("email", email);

    const isRemember = getLocalStorageByName(isRememberKey) === "true";
    // console.debug("isRemember::", isRemember);
    setIsRemember(isRemember);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              name="remember-me"
              checked={isRemember}
              className="h-4 w-4 rounded"
              onCheckedChange={(val) => {
                setLocalStorageByName(isRememberKey, String(val));
                setIsRemember(val);
              }}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm leading-6 text-gray-900"
            >
              {t("account.signin.remember")}
            </label>
          </div>

          <div className="text-sm leading-6">
            <Link
              href="/account/forgot-pwd"
              className="text-black hover:text-gray-900"
            >
              {t("account.signin.forgot")}
            </Link>
          </div>
        </div>
        <Button loading={isSubmitting} className="w-full" type="submit">
          {t("common.btn.signI")}
        </Button>
      </form>
    </Form>
  );
}
