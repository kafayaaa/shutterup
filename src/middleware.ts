import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return res;
  });
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
