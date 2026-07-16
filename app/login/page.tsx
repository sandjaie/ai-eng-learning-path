import { LoginButton } from "@/components/login-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="block-card w-full max-w-md p-8 text-center">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight">
          AI Engineer Path
        </h1>
        <p className="mt-2 text-muted">18-month transition tracker</p>
        {error === "unauthorized" && (
          <p className="mt-4 border-2 border-ink bg-[#ff8a5c] p-3 text-sm font-bold">
            That Google account isn&apos;t allowed here. This is a single-user app.
          </p>
        )}
        {error === "dev_login" && (
          <p className="mt-4 border-2 border-ink bg-[#ff8a5c] p-3 text-left text-sm font-bold">
            Dev auto-login failed (invalid credentials). In Supabase →
            Authentication → Users, open your allowed user and set a password
            that matches <code className="font-mono">DEV_LOGIN_PASSWORD</code>.
            Also enable the Email provider under Authentication → Providers.
          </p>
        )}
        <div className="mt-8 flex justify-center">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
