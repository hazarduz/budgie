import { requireAdmin } from "@/lib/dal";
import { listUsers } from "@/lib/actions";
import { UserManager } from "@/components/UserManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const usersRaw = await listUsers();
  const users = usersRaw.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage who can sign in to Budgie. Each person gets their own private months,
          categories, and Christmas list.
        </p>
      </div>
      <UserManager users={users} currentUserId={session.userId} />
    </div>
  );
}
