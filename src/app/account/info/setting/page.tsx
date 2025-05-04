"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui-lab/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/toasts/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAppContext } from "@/app/providers";

const Page = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { state } = useAppContext();
  const user = state.user || {};
  const supabase = createClient();
  const router = useRouter();

  const formSchema = React.useMemo(
    () =>
      z.object({
        fullName: z.string().min(5, { message: t("account.invalid.minFive") }),
        avatarUrl: z.string(),
      }),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      avatarUrl: "/images/avatar.jpeg",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { error } = await updateUserInfoById(supabase, user.id, values);
      if (!error) {
        toast({
          title: "成功！",
          description: "更新用户信息成功！",
        });
        router.back();
      }
    } catch (e) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("account.field.fName")}</FormLabel>
                <FormControl>
                  <Input placeholder="jack" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("account.field.avatar")}</FormLabel>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <div>
                  <Button disabled variant="ghost" size="icon">
                    <Plus />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button loading={isSubmitting} className="w-full" type="submit">
            {t("common.btn.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
