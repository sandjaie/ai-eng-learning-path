"use client";

import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  const signIn = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };
  return (
    <button onClick={signIn} className="block-btn px-6 py-3 text-lg uppercase tracking-wide">
      Sign in with Google
    </button>
  );
}
