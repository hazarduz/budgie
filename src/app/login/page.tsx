import { BudgieLogo } from "@/components/BudgieLogo";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <BudgieLogo className="h-12 w-12" />
          <h1 className="text-xl font-bold tracking-tight">Sign in to Budgie</h1>
          <p className="text-sm text-slate-500">Your budget, your login, your data.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
