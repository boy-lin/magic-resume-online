"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "@/components/shared/Logo";
import { requestPasswordUpdate } from "@/utils/auth-helpers/server";
import { Button } from "@/components/ui/button";
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setIsSubmitting(true);
    const redirectUrl = await requestPasswordUpdate(values);
    setIsSubmitting(false);
    console.debug("redirectUrl", redirectUrl);
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
            <h1 className="text-base/6 font-medium">找回密码</h1>
            <p className="text-sm/5 text-gray-600">
              Sign in to your account to continue.
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} className="w-full" type="submit">
              下一步
            </Button>
          </form>
        </Form>
      </div>
      <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
        <Link href="/account/signin" className="font-light text-sm">
          Sign in with email and password
        </Link>
      </div>
    </div>
  );
};

export default ForgotPwdPage;
