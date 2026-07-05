import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Explicitly type the cookie item to bypass TypeScript strict mode checks
          cookiesToSet.forEach((cookie: any) => request.cookies.set(cookie.name, cookie.value));
          
          supabaseResponse = NextResponse.next({
            request,
          });
          
          cookiesToSet.forEach((cookie: any) =>
            supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options)
          );
        },
      },
    }
  );

  // Triggers session verification
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in and viewing the dashboard, redirect to login
  if (!user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If logged in and viewing the auth page, redirect to dashboard
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};