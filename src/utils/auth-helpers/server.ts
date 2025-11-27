"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function updatePassword(formData: { password: string }) {
  const password = String(formData.password ?? "").trim();

  if (!password || password.length < 5) {
    return getErrorRedirect(
      "/account/update-pwd",
      "您的密码无法更新",
      "密码长度至少为 5 位"
    );
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return getErrorRedirect(
        "/account/update-pwd",
        "您的密码无法更新",
        "您还没有登录"
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    });

    return getStatusRedirect("/", "成功", "您的密码已更新");
  } catch (error) {
    console.error("Update password error:", error);
    return getErrorRedirect(
      "/account/update-pwd",
      "您的密码无法更新",
      "请稍后重试"
    );
  }
}

