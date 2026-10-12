import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function hasAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "1";
}

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  if (await hasAuth()) redirect("/admin");
  const params = await searchParams;
  const isError = params?.error === "1";

  async function login(formData: FormData) {
    "use server";
    const password = String(formData.get("password") || "");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || password !== expected) {
      redirect("/admin/login?error=1");
    }
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-[380px]">
        <div className="border border-zinc-800 bg-zinc-900/50 p-8">
          <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">PORTFOLIO ADMIN</p>
          <h1 className="text-xl font-medium mt-2 tracking-tight">Sign in</h1>
          <p className="text-sm text-zinc-400 mt-2">Isolated admin — not part of the portfolio UI. Simple password auth.</p>

          {isError && <p className="mt-4 text-xs text-red-400 border border-red-900/50 bg-red-950/30 px-3 py-2">Wrong password.</p>}
          <form action={login} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-widest text-zinc-400">PASSWORD</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-2 w-full bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-sm outline-none focus:border-zinc-600"
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-white text-black py-2.5 text-sm font-medium hover:bg-zinc-200 transition-colors">
              Enter Admin
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-800 pt-4">
            <Link href="/" className="inline-block font-mono text-xs text-zinc-400 hover:text-white">
              ← Back to portfolio
            </Link>
          </div>
        </div>
        <p className="text-center font-mono text-[10px] text-zinc-600 mt-4">Protected route • httpOnly cookie • 7d session</p>
      </div>
    </div>
  );
}
