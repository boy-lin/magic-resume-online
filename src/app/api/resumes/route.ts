import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getResumesByUserId } from "@/lib/repositories/resume";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const current = Number(searchParams.get("current") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "20");

  const result = await getResumesByUserId(session.user.id, { current, pageSize });

  return NextResponse.json({
    data: result.data,
    count: result.count,
  });
}

