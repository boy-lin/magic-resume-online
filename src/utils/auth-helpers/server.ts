"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getURL,
  getErrorRedirect,
  getStatusRedirect,
  getFeedbackRedirect,
} from "@/utils/helpers";
import { getAuthTypes } from "@/utils/auth-helpers/settings";
import { generateRandomUsername } from "@/utils";
import { isValidEmail } from "@/utils/reg";

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get("pathName")).trim();

  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(pathName, "嗯...出了点问题。", "您无法退出。");
  }

  return "/signin";
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = cookies();
  const callbackURL = getURL("/auth/callback");

  const email = String(formData.get("email")).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      "/signin/email_signin",
      "电子邮件地址无效。",
      "请重试。"
    );
  }

  const supabase = createClient();
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true,
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/signin/email_signin",
      "您还没有登录。",
      error.message
    );
  } else if (data) {
    cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
    redirectPath = getFeedbackRedirect(
      "/feedback/success",
      "成功！",
      "请查看您的电子邮件，获取一个注册的魔术链接。您现在可以关闭此页面了。"
    );
  } else {
    redirectPath = getErrorRedirect(
      "/signin/email_signin",
      "嗯...出了点问题。",
      "您还没有登录。"
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(formData) {
  const callbackURL = getURL("/auth/reset-password");

  // Get form data
  const email = String(formData.email).trim();
  let redirectPath: string;

  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/account/forgot-pwd",
      error.message,
      "请重试。"
    );
  } else if (data) {
    redirectPath = getFeedbackRedirect(
      "/feedback/success",
      "成功！",
      "请查看您的电子邮件，获取密码重置链接。您现在可以关闭此页面了。"
    );
  } else {
    redirectPath = getErrorRedirect(
      "/account/forgot-pwd",
      "嗯...出了点问题。",
      "无法发送密码重置电子邮件。"
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData) {
  const cookieStore = cookies();
  const email = String(formData.email).trim();
  const password = String(formData.password).trim();
  let redirectPath: string;
  const singInPath = "/account/signin";
  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    redirectPath = getErrorRedirect(singInPath, "登录失败。", error.message);
  } else if (data.user) {
    cookieStore.set("preferredSignInView", "password_signin", { path: "/" });
    redirectPath = getStatusRedirect("/", "成功！", "您现在已登录。");
  } else {
    redirectPath = getErrorRedirect(
      singInPath,
      "嗯...出了点问题。",
      "您还没有登录。"
    );
  }

  return redirectPath;
}

export async function signUp(formData) {
  const callbackURL = getURL("/auth/callback");
  const email = String(formData.email).trim();
  const password = String(formData.password).trim();
  const fullName = String(formData.fullName).trim();
  let redirectPath: string;

  const supabase = createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/account/signup",
      "注册失败。",
      error.message
    );
  } else if (data.session) {
    redirectPath = getStatusRedirect("/", "成功！", "您现在已登录。");
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    redirectPath = getErrorRedirect(
      "/account/signup",
      "注册失败。",
      "There is already an account associated with this email address. Try resetting your password."
    );
  } else if (data.user) {
    redirectPath = getFeedbackRedirect(
      "/feedback/success",
      "成功！",
      "请查看您的电子邮件，获取确认链接。您现在可以关闭此页面了。"
    );
  } else {
    redirectPath = getErrorRedirect(
      "/account/signup",
      "嗯...出了点问题。",
      "您可能无法注册。"
    );
  }

  return redirectPath;
}

export async function updatePassword(formData) {
  const password = String(formData.password).trim();
  let redirectPath: string;

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/account/update-pwd",
      "您的密码无法更新。",
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect("/", "成功！", "您的密码已更新。");
  } else {
    redirectPath = getErrorRedirect(
      "/account/update-pwd",
      "嗯...出了点问题。",
      "您的密码无法更新。"
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get("newEmail")).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      "/account",
      "您的电子邮件无法更新。",
      "电子邮件地址无效。"
    );
  }

  const supabase = createClient();

  const callbackUrl = getURL(
    getStatusRedirect("/account", "成功！", `Your email has been updated.`)
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl,
    }
  );

  if (error) {
    return getErrorRedirect(
      "/account",
      "您的电子邮件无法更新。",
      error.message
    );
  } else {
    return getStatusRedirect(
      "/account",
      "确认电子邮件已发送。",
      `您需要点击发送到新旧电子邮件地址的链接来确认更新。`
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get("fullName")).trim();

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) {
    return getErrorRedirect("/account", "您的姓名无法更新。", error.message);
  } else if (data.user) {
    return getStatusRedirect("/account", "成功！", "您的姓名已更新。");
  } else {
    return getErrorRedirect(
      "/account",
      "嗯...出了点问题。",
      "您的姓名无法更新。"
    );
  }
}
