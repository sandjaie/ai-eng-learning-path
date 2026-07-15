import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && process.env.ALLOWED_EMAIL && data.user?.email === process.env.ALLOWED_EMAIL) {
      return NextResponse.redirect(`${origin}/`);
    }
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(`${origin}/login?error=unauthorized`);
}
