import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, handle i18n routing
  const intlResponse = intlMiddleware(request);

  // Then, update Supabase session
  // We need to merge the cookies from both responses
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            intlResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh the session
  await supabase.auth.getUser();

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - API routes
    // - Static files
    // - _next internals
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
