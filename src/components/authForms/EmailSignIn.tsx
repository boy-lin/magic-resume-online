"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/utils/reg";
import {
  signInWithPassword,
  redirectToPath,
} from "@/utils/auth-helpers/server";
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

export default function EmailSignIn() {
  const router = useRouter();
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemember, setIRemember] = useState(false);

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
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isRemember) {
      setLocalStorageByName("userEmail", values.email);
    } else {
      localStorage.removeItem("userEmail");
    }

    setIsSubmitting(true);
    const redirectUrl = await signInWithPassword(values);
    setIsSubmitting(false);
    router.push(redirectUrl);
  }

  useEffect(() => {
    const email = getLocalStorageByName("userEmail");
    form.setValue("email", email);
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
              onCheckedChange={(val) => setIRemember(!!val)}
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
        <Button disabled={isSubmitting} className="w-full" type="submit">
          {t("common.btn.signI")}
        </Button>
      </form>
    </Form>
  );
}
