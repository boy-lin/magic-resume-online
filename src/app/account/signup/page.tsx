"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { isValidEmail } from "@/utils/reg";
import { signUp } from "@/utils/auth-helpers/server";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/toasts/use-toast";
import { setLocalStorageByName, getLocalStorageByName } from "@/utils/storage";

const RegisterPage = () => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const email = e.target[0].value;
      const password = e.target[1].value;
      const confirmPassword = e.target[2].value;

      if (!isValidEmail(email)) {
        throw new Error(t("account.valid.email"));
      }

      if (!password || password.length < 8) {
        throw new Error(t("account.valid.pwd"));
      }

      if (confirmPassword !== password) {
        throw new Error(t("Passwords are not equal"));
      }

      setIsSubmitting(true);

      const formData = new FormData(e.currentTarget);
      const redirectUrl: string = await signUp(formData);
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

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmpassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm password
            </label>
            <div className="mt-2">
              <Input
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                name="remember-me"
                className="h-4 w-4 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm leading-6 text-gray-900"
              >
                Accept our terms and privacy policy
              </label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              disabled={isSubmitting}
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
