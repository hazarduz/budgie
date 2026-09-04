import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../src/lib/categories";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
    const { name, color } = DEFAULT_CATEGORIES[i];
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, color, isDefault: true, sortOrder: i },
    });
  }

  await prisma.christmasSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, budget: 250 },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
