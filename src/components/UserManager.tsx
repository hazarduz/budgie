"use client";

import { useState, useTransition } from "react";
import { Role } from "@prisma/client";
import {
  createUserAccount,
  deleteUserAccount,
  resetUserPassword,
  updateUserRole,
} from "@/lib/actions";

interface PlainUser {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
}

export function UserManager({
  users,
  currentUserId,
}: {
  users: PlainUser[];
  currentUserId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="card divide-y divide-[var(--border)]">
        {users.map((u) => (
          <UserRow key={u.id} user={u} isSelf={u.id === currentUserId} />
        ))}
      </div>
      <CreateUserForm />
    </div>
  );
}

function UserRow({ user, isSelf }: { user: PlainUser; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  function changeRole(role: Role) {
    setError(null);
    startTransition(async () => {
      const result = await updateUserRole(user.id, role);
      if (!result.ok) setError(result.error ?? "Something went wrong.");
    });
  }

  function submitReset() {
    if (!newPassword) return;
    setError(null);
    startTransition(async () => {
      const result = await resetUserPassword(user.id, newPassword);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
      } else {
        setResetting(false);
        setNewPassword("");
      }
    });
  }

  function remove() {
    if (!confirm(`Delete the account "${user.username}"? This deletes all of their data.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteUserAccount(user.id);
      if (!result.ok) setError(result.error ?? "Something went wrong.");
    });
  }

  return (
    <div className="p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-medium">{user.username}</span>
          {isSelf && <span className="text-xs text-slate-400">(you)</span>}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <select
            value={user.role}
            disabled={isPending}
            onChange={(e) => changeRole(e.target.value as Role)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-xs font-medium outline-none focus:border-teal-500"
          >
            <option value={Role.ADMIN}>Admin</option>
            <option value={Role.STANDARD}>Standard</option>
          </select>
          <button
            onClick={() => setResetting((v) => !v)}
            className="font-medium text-teal-700 hover:underline dark:text-teal-300"
          >
            Reset password
          </button>
          <button
            onClick={remove}
            disabled={isPending}
            className="font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
      {resetting && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="password"
            placeholder="New password (min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="min-w-[12rem] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-teal-500"
          />
          <button
            onClick={submitReset}
            disabled={isPending}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}

function CreateUserForm() {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.STANDARD);
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createUserAccount({ username, password, role });
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
      } else {
        setUsername("");
        setPassword("");
        setRole(Role.STANDARD);
      }
    });
  }

  return (
    <div className="card space-y-3 p-4">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Add a user</h2>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="min-w-[9rem] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          className="min-w-[12rem] flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
        >
          <option value={Role.STANDARD}>Standard</option>
          <option value={Role.ADMIN}>Admin</option>
        </select>
        <button
          onClick={submit}
          disabled={isPending || !username || !password}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          Add user
        </button>
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
