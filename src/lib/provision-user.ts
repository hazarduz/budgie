import type { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "@/lib/categories";

export async function provisionUserDefaults(prisma: PrismaClient, userId: string) {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map(({ name, color }, i) => ({
      userId,
      name,
      color,
      isDefault: true,
      sortOrder: i,
    })),
  });

  await prisma.christmasSettings.create({
    data: { userId, budget: 250 },
  });
}
