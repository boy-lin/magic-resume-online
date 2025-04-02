"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "@/components/shared/Logo";
import { updatePassword } from "@/utils/auth-helpers/server";
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
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateUserInfoById } from "@/utils/supabase/queries";
import { useAppContext } from "@/app/providers";

const formSchema = z.object({
  fullName: z.string().min(5, { message: "Must be 5 or more characters long" }),
  avatarUrl: z.string(),
});

const Page = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { state } = useAppContext();
  const user = state.user || {};
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      avatarUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await updateUserInfoById(supabase, user.id, {
        full_name: values.fullName,
        avatar_url: "/images/avatar.jpeg",
      });
      console.debug("res", res);
    } catch (e) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-[620px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="jack" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Avatar</FormLabel>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <div>
                  <Button variant="ghost" size="icon">
                    <Plus />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} className="w-full" type="submit">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
