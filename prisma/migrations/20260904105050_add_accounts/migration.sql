-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#0d9488',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_name_key" ON "Account"("userId", "name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: add the new relation column, keep the old free-text column for now
ALTER TABLE "Entry" ADD COLUMN "accountId" TEXT;

-- Data migration: turn each distinct free-text account value per user into a
-- real Account row, then point existing entries at it.
INSERT INTO "Account" ("id", "userId", "name", "color", "sortOrder", "createdAt")
SELECT gen_random_uuid()::text, t."userId", t."account", '#0d9488', 0, CURRENT_TIMESTAMP
FROM (
    SELECT DISTINCT m."userId" AS "userId", e."account" AS "account"
    FROM "Entry" e
    JOIN "Month" m ON m."id" = e."monthId"
    WHERE e."account" IS NOT NULL AND e."account" <> ''
) t;

UPDATE "Entry" e
SET "accountId" = a."id"
FROM "Account" a, "Month" m
WHERE e."monthId" = m."id"
  AND a."userId" = m."userId"
  AND a."name" = e."account";

-- AlterTable: now safe to drop the old free-text column
ALTER TABLE "Entry" DROP COLUMN "account";

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
