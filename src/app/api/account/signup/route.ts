import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/service/prisma";
import { isValidEmail } from "@/utils/reg";

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        fullName,
        hashedPassword,
      },
    });

    // 如需发送注册成功邮件，可在此处调用外部邮件服务
    // 参考 src/app/api/external/send-email/route.ts 中的 HMAC 调用方式

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}
