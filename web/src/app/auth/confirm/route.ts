
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type === "signup") {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as EmailOtpType,
    });

    if (!error) {
      return NextResponse.redirect(
        new URL("/login?confirmed=true", origin)
      );
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation", origin)
  );
}
