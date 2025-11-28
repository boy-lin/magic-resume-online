import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "@/lib/service/auth";
import { prisma } from "@/lib/service/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { password } = await req.json();

    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length < 5
    ) {
      return NextResponse.json(
        { error: "密码长度至少为 5 位" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password.trim(), 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update password:", error);
    return NextResponse.json(
      { error: "密码更新失败，请稍后重试" },
      { status: 500 }
    );
  }
}
