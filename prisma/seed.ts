import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { provisionUserDefaults } from "../src/lib/provision-user";

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || "hazarduz";

  const existingAdmin = await prisma.user.findUnique({ where: { username: adminUsername } });
  if (existingAdmin) {
    console.log(`Admin account "${adminUsername}" already exists — skipping bootstrap.`);
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      `No user accounts exist yet and ADMIN_PASSWORD is not set. ` +
        `Set ADMIN_PASSWORD (and optionally ADMIN_USERNAME, default "hazarduz") in your .env, then re-run the seed.`
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.create({
    data: { username: adminUsername, passwordHash, role: "ADMIN" },
  });

  await provisionUserDefaults(prisma, admin.id);

  console.log(`Created admin account "${adminUsername}".`);
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
