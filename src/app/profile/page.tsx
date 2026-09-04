import { notFound } from "next/navigation";
import { getProfile } from "@/lib/actions";
import { AvatarUploader } from "@/components/AvatarUploader";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) notFound();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          {profile.username} · {profile.role === "ADMIN" ? "Admin" : "Standard"}
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Picture
        </h2>
        <div className="card p-4 sm:p-5">
          <AvatarUploader defaultAvatar={profile.avatar} username={profile.username} />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Password
        </h2>
        <div className="card p-4 sm:p-5">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
