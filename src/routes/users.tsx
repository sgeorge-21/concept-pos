import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/pos/Shell";
import { users, type Role, type UserStatus } from "@/lib/pos-data";
import { useMemo, useState } from "react";
import { Search, UserPlus, Shield, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/users")({
  component: UsersPage,
  head: () => ({ meta: [{ title: "Users · SmartPOS" }, { name: "description", content: "Manage cashiers, managers and access roles." }] }),
});

const roleColors: Record<Role, string> = {
  Owner: "bg-primary/15 text-primary border-primary/30",
  Manager: "bg-accent/15 text-accent border-accent/30",
  Cashier: "bg-secondary text-secondary-foreground border-border",
  Stockist: "bg-warning/15 text-warning border-warning/30",
};

const statusDot: Record<UserStatus, string> = {
  Active: "bg-success",
  Invited: "bg-warning",
  Suspended: "bg-destructive",
};

function UsersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"All" | Role>("All");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
      const r = role === "All" || u.role === role;
      return q && r;
    });
  }, [query, role]);

  const stats = [
    { label: "Total users", value: users.length },
    { label: "Active", value: users.filter((u) => u.status === "Active").length },
    { label: "Pending invites", value: users.filter((u) => u.status === "Invited").length },
    { label: "Roles", value: new Set(users.map((u) => u.role)).size },
  ];

  return (
    <Shell
      title="Users"
      subtitle="Cashiers, managers and access control."
      actions={
        <button
          onClick={() => toast.success("Invitation sent", { description: "An onboarding email is on its way." })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-display font-bold hover:opacity-90"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <UserPlus className="h-4 w-4" />
          Invite user
        </button>
      }
    >
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="font-display text-3xl font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["All", "Owner", "Manager", "Cashier", "Stockist"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition border",
                role === r ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 sm:hidden">
        {filtered.map((u) => (
          <div key={u.id} className="rounded-2xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-3">
              <Avatar u={u} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{u.name}</div>
                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
              </div>
              <span className={cn("h-2 w-2 rounded-full", statusDot[u.status])} />
            </div>
            <div className="flex items-center justify-between mt-3 gap-2">
              <span className={cn("text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border", roleColors[u.role])}>{u.role}</span>
              <span className="text-xs text-muted-foreground truncate">{u.outlet}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-muted-foreground">
            <tr className="text-left">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Outlet</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Last active</th>
              <th className="px-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-secondary/20">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar u={u} />
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={cn("text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border inline-flex items-center gap-1", roleColors[u.role])}>
                    <Shield className="h-3 w-3" />
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{u.outlet}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-2 text-xs">
                    <span className={cn("h-2 w-2 rounded-full", statusDot[u.status])} />
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{u.lastActive}</td>
                <td className="px-5 py-3 text-right">
                  <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

function Avatar({ u }: { u: typeof users[number] }) {
  return (
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: `linear-gradient(135deg, oklch(0.65 0.18 ${u.hue}), oklch(0.55 0.20 ${(u.hue + 40) % 360}))` }}
    >
      {u.initials}
    </div>
  );
}
