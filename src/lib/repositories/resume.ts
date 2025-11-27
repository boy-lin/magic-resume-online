import { prisma } from "@/lib/prisma";

export async function getResumesByUserId(userId: string, params: { current: number; pageSize: number }) {
  const skip = (params.current - 1) * params.pageSize;
  const take = params.pageSize;

  const [rows, total] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        templateId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    }),
    prisma.resume.count({
      where: { userId },
    }),
  ]);

  return {
    data: rows.map((it) => ({
      id: it.id,
      title: it.title,
      created_at: it.createdAt,
      template_id: it.templateId,
    })),
    count: total,
  };
}

export type ResumeUpsertInput = {
  id?: string;
  title?: string;
  userId: string;
  templateId?: string | null;
  customData?: any;
  globalSettings?: any;
  menuSections?: any;
};

export async function upsertResumeByIdPrisma(input: ResumeUpsertInput) {
  const { id, userId, title, templateId, customData, globalSettings, menuSections } = input;

  if (id) {
    return prisma.resume.upsert({
      where: { id },
      create: {
        id,
        userId,
        title,
        templateId,
        customData,
        globalSettings,
        menuSections,
      },
      update: {
        title,
        templateId,
        customData,
        globalSettings,
        menuSections,
      },
    });
  }

  return prisma.resume.create({
    data: {
      userId,
      title,
      templateId,
      customData,
      globalSettings,
      menuSections,
    },
  });
}

export async function deleteResumeByIdPrisma(id: string) {
  return prisma.resume.delete({
    where: { id },
  });
}

export async function getResumeByIdPrisma(id: string) {
  const val = await prisma.resume.findUnique({
    where: { id },
  });

  if (!val) {
    throw new Error("Resume not found");
  }

  return {
    id: val.id,
    title: val.title,
    createdAt: val.createdAt,
    updatedAt: val.updatedAt,
    basic: val.basic,
    templateId: val.templateId,
    customData: val.customData,
    education: val.education,
    experience: val.experience,
    globalSettings: val.globalSettings,
    menuSections: val.menuSections,
    projects: val.projects,
    isPublic: val.isPublic,
    publicPassword: val.publicPassword,
  };
}

export async function publicResumeByIdPrisma(id: string, isPublic: boolean) {
  return prisma.resume.update({
    where: { id },
    data: {
      isPublic,
    },
  });
}

export async function setPublicResumeByIdPrisma(id: string, publicPassword: string | null) {
  return prisma.resume.update({
    where: { id },
    data: {
      publicPassword: publicPassword || null,
    },
  });
}

