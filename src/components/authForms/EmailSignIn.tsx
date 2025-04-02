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

export default function EmailSignIn() {
  const router = useRouter();
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemember, setIRemember] = useState(false);
  const emailRef = useRef(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const email = e.target[0].value;
      const password = e.target[1].value;

      if (!isValidEmail(email)) {
        throw new Error(t("account.valid.email"));
      }

      if (!password || password.length < 8) {
        throw new Error(t("account.valid.pwd"));
      }

      if (isRemember) {
        setLocalStorageByName("userEmail", email);
      } else {
        localStorage.removeItem("userEmail");
      }

      setIsSubmitting(true);

      const formData = new FormData(e.currentTarget);
      const redirectUrl = await signInWithPassword(formData);

      router.push(redirectUrl);
    } catch (e) {
      toast({
        title: "登录错误",
        description: e.message || "unKnow error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const email = getLocalStorageByName("userEmail");
    if (email && emailRef.current) {
      emailRef.current.value = email;
      setIRemember(true);
    }
  }, []);

  return (
    <form noValidate={true} className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Email address
        </label>
        <div className="mt-2">
          <Input
            id="email"
            ref={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Email address"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Password
        </label>
        <div className="mt-2">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Password"
          />
        </div>
      </div>

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
            Remember me
          </label>
        </div>

        <div className="text-sm leading-6">
          <Link
            href="/account/forgot-pwd"
            className="text-black hover:text-gray-900"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          disabled={isSubmitting}
        >
          Sign in
        </Button>
      </div>
    </form>
  );
}
