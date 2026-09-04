import { NextResponse } from "next/server";
import { exportBackupData } from "@/lib/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await exportBackupData();
  const filename = `budgie-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
