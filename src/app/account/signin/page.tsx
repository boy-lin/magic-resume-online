"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import EmailSignIn from "@/components/authForms/EmailSignIn";
import Logo from "@/components/shared/Logo";
import ButtonGoogle from "@/components/biz/account/signin/button-google";
import ButtonGithub from "@/components/biz/account/signin/button-github";

const NextLoginPage = () => {
  const t = useTranslations();

  return (
    <div className="w-full max-w-md rounded-xl bg-white ring-1 shadow-md ring-black/5">
      <div className="p-7 sm:p-11">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Logo size={48} />
          </Link>
          <div>
            <h1 className="text-base/6 font-medium">
              {t("account.signin.title")}
            </h1>
            <p className="text-sm/5 text-gray-600">{t("account.signin.sub")}</p>
          </div>
        </div>

        <EmailSignIn />

        <div>
          <div className="relative mt-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">
                {t("account.signin.thirdL")}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <ButtonGoogle />
            <ButtonGithub />
          </div>
        </div>
      </div>
      <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
        {t("account.notAM")}{" "}
        <Link
          href="/account/signup"
          className="font-medium hover:text-gray-600"
        >
          {t("account.createAA")}
        </Link>
      </div>
    </div>
  );
};

export default NextLoginPage;
