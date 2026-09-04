import { BudgieLogo } from "@/components/BudgieLogo";
import { LoginForm } from "@/components/LoginForm";
import { SetupForm } from "@/components/SetupForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const userCount = await prisma.user.count();
  const needsSetup = userCount === 0;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <BudgieLogo className="h-12 w-12" />
          <h1 className="text-xl font-bold tracking-tight">
            {needsSetup ? "Welcome to Budgie" : "Sign in to Budgie"}
          </h1>
          <p className="text-sm text-slate-500">
            {needsSetup
              ? "Create the first account — it becomes the admin."
              : "Your budget, your login, your data."}
          </p>
        </div>
        {needsSetup ? <SetupForm /> : <LoginForm />}
      </div>
    </div>
  );
}
