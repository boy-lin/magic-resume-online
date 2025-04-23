import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const next = searchParams.get("next") ?? "/";
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    return NextResponse.redirect(
      getErrorRedirect(
        `${origin}/signin`,
        error.name,
        "Sorry, we weren't able to log you in. Please try again."
      )
    );
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(`${origin}/account`, "Success!", "You are now signed in.")
  );
}
