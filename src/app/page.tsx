import { redirect } from "next/navigation";
import { currentMonthKey, monthSlug } from "@/lib/months";

export default function Home() {
  redirect(`/months/${monthSlug(currentMonthKey())}`);
}
