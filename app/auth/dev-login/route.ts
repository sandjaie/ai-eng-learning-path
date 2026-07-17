import { NextResponse } from "next/server";
import { isDevAutoLoginEnabled } from "@/lib/dev-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  if (
    !isDevAutoLoginEnabled({
      NODE_ENV: process.env.NODE_ENV,
      DEV_AUTO_LOGIN: process.env.DEV_AUTO_LOGIN,
      DEV_LOGIN_PASSWORD: process.env.DEV_LOGIN_PASSWORD,
      ALLOWED_EMAIL: process.env.ALLOWED_EMAIL,
    })
  ) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.ALLOWED_EMAIL!,
    password: process.env.DEV_LOGIN_PASSWORD!,
  });

  if (error || data.user?.email !== process.env.ALLOWED_EMAIL) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=dev_login`);
  }

  return NextResponse.redirect(`${origin}/`);
}
