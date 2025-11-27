import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  deleteResumeByIdPrisma,
  getResumeByIdPrisma,
  upsertResumeByIdPrisma,
  publicResumeByIdPrisma,
  setPublicResumeByIdPrisma,
} from "@/lib/repositories/resume";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const resume = await getResumeByIdPrisma(params.id);
  return NextResponse.json(resume);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const resume = await upsertResumeByIdPrisma({
    id: params.id,
    userId: session.user.id,
    title: body.title,
    templateId: body.templateId,
    customData: body.customData,
    globalSettings: body.globalSettings,
    menuSections: body.menuSections,
  });

  return NextResponse.json(resume);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteResumeByIdPrisma(params.id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  if (typeof body.isPublic === "boolean") {
    const updated = await publicResumeByIdPrisma(params.id, body.isPublic);
    return NextResponse.json(updated);
  }

  if ("publicPassword" in body) {
    const updated = await setPublicResumeByIdPrisma(
      params.id,
      body.publicPassword
    );
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
}

