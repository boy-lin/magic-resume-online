import { prisma } from "@/lib/service/prisma";
import { SubscriptionStatus } from "@prisma/client";

export async function getActiveSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: [SubscriptionStatus.TRIALING, SubscriptionStatus.ACTIVE],
      },
    },
    include: {
      price: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getActiveProductsWithPrices() {
  return prisma.product.findMany({
    where: {
      active: true,
      prices: {
        some: {
          active: true,
        },
      },
    },
    include: {
      prices: {
        where: {
          active: true,
        },
      },
    },
    orderBy: [
      {
        metadata: {
          path: ["index"],
          sort: "asc",
        } as any,
      },
      {
        prices: {
          _min: {
            unitAmount: "asc",
          },
        },
      },
    ],
  });
}
