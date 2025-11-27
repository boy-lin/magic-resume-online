import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const updateSession = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/account/signin", request.url));
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
};
