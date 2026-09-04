-- AlterTable: add nullable first so existing rows can be backfilled
ALTER TABLE "Entry" ADD COLUMN "seriesId" TEXT;

-- Existing entries have no known lineage (they predate this feature), so each
-- becomes its own singleton series rather than guessing at name/category
-- matches across months.
UPDATE "Entry" SET "seriesId" = "id" WHERE "seriesId" IS NULL;

-- AlterTable: now safe to require it
ALTER TABLE "Entry" ALTER COLUMN "seriesId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Entry_seriesId_idx" ON "Entry"("seriesId");
