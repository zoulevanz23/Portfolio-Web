"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Isolated admin UI — no portfolio Sidebar/Footer, no theme chrome bleed
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
