import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";

export function Shell({ children, title, subtitle, actions }: { children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="border-b border-border px-6 md:px-10 py-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
        <div className="flex-1 p-6 md:p-10">{children}</div>
      </main>
      <Toaster theme="dark" position="top-right" richColors />
    </div>
  );
}
