import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/service/auth";
import { prisma } from "@/lib/service/prisma";

function normalizeUser(user: {
  id: string;
  email: string | null;
  name: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  image: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.fullName ?? null,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl ?? user.image ?? null,
    createdAt: user.createdAt,
  };
}

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      fullName: true,
      avatarUrl: true,
      image: true,
      createdAt: true,
    },
  });

  if (!dbUser) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user: normalizeUser(dbUser) });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const fullName = body.fullName as string | undefined;
  const avatarUrl = body.avatarUrl as string | undefined;

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName,
        avatarUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        fullName: true,
        avatarUrl: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: normalizeUser(updated) });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
