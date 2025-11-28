import { cache } from "react";

/**
 * 使用后端 Prisma + NextAuth 接口获取当前登录用户。
 * 为了兼容旧签名，仍然接受一个参数但会被忽略。
 */
export const getUser = cache(async () => {
  try {
    const res = await fetch("/api/account/me", {
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.user ?? null;
  } catch {
    return null;
  }
});

/**
 * 更新用户基础信息（姓名、头像）。
 * 通过调用基于 Prisma 的 `/api/account/me` PATCH 接口完成更新。
 */
export const updateUserInfoById = async (
  _: unknown,
  id: string,
  params: { fullName?: string; avatarUrl?: string }
) => {
  try {
    const res = await fetch("/api/account/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        fullName: params.fullName,
        avatarUrl: params.avatarUrl,
      }),
    });

    if (!res.ok) {
      return { error: new Error("Failed to update user profile") };
    }

    const data = await res.json();
    return { error: null, data };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error when updating user profile"),
    };
  }
};
