import { prisma } from "@/lib/prisma";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUserProfileById(id: string, params: { fullName?: string; avatarUrl?: string }) {
  return prisma.user.update({
    where: { id },
    data: {
      fullName: params.fullName,
      avatarUrl: params.avatarUrl,
    },
  });
}

