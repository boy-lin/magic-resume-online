"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Logo from "@/components/shared/Logo";
import { isValidEmail } from "@/utils/reg";
import { signUp } from "@/utils/auth-helpers/server";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.debug(
      "valuesvaluesvalues",
      values.confirmPassword !== values.password,
      values
    );
    if (values.confirmPassword !== values.password) {
      return toast({
        title: t("common.msg.titleE"),
        description: t("account.invalid.pwdUnequal"),
        variant: "destructive",
      });
    }

    setIsSubmitting(true);
    const redirectUrl = await signUp(values);
    setIsSubmitting(false);
    router.push(redirectUrl);
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
            <Button disabled={isSubmitting} className="w-full" type="submit">
              {t("common.btn.signU")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
