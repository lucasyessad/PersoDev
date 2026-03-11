import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware Next.js — merged from both versions:
 *
 * From PersoDev:
 * - Supabase session refresh with cookie management
 * - Protected route redirects (/aqarpro/*, /favoris, /alertes, etc.)
 * - Auth route redirects (already logged in -> dashboard)
 * - Agency slug-based dashboard redirect
 *
 * From Github:
 * - CSRF protection for mutations
 * - Security headers (CSP, HSTS, etc.)
 * - Locale detection and i18n routing
 * - Webhook path exemptions
 */

const PROTECTED_PREFIXES = ['/aqarpro', '/favoris', '/alertes', '/recherches', '/messages', '/profil'];
const AUTH_ROUTES = ['/login', '/signup'];
const WEBHOOK_PATHS = ['/api/stripe/webhook', '/api/whatsapp/webhook'];

/** Détecter la locale depuis les préférences du navigateur */
function detectLocale(request: NextRequest): string {
  // Cookie de préférence
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && ['fr', 'ar', 'en'].includes(cookieLocale)) {
    return cookieLocale;
  }

  // Accept-Language
  const acceptLanguage = request.headers.get('accept-language') || '';
  if (acceptLanguage.includes('ar')) return 'ar';
  if (acceptLanguage.includes('en')) return 'en';

  return 'fr';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── CSRF Protection for mutations ──
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const isWebhook = WEBHOOK_PATHS.some((p) => pathname.startsWith(p));
    if (!isWebhook) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      if (origin && host) {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          console.warn(`CSRF blocked: origin=${origin}, host=${host}`);
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
    }
  }

  // ── Supabase session refresh ──
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session (important for SSR)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protected routes → redirect to /login if not authenticated ──
  const isProtected = PROTECTED_PREFIXES.some((route) => pathname.startsWith(route));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // ── Auth routes → redirect to dashboard if already authenticated ──
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && user) {
    const { data: agency } = await supabase
      .from('agencies')
      .select('slug')
      .eq('owner_id', user.id)
      .single();

    const url = request.nextUrl.clone();
    if (agency?.slug) {
      url.pathname = `/aqarpro/${agency.slug}/dashboard`;
    } else {
      url.pathname = '/profil';
    }
    return NextResponse.redirect(url);
  }

  // ── i18n locale routing (for public agency pages) ──
  // Skip internal routes, dashboard, auth, static files
  const skipLocaleRouting =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/aqarpro') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/espace') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/profil') ||
    pathname.startsWith('/recherche') ||
    pathname.startsWith('/favoris') ||
    pathname.startsWith('/alertes') ||
    pathname.startsWith('/pro') ||
    pathname.startsWith('/bien') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/);

  if (!skipLocaleRouting) {
    const LOCALES = ['fr', 'ar', 'en'];
    const hasLocale = LOCALES.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Redirect public pages without locale prefix (skip homepage "/")
    if (!hasLocale && pathname !== '/' && pathname.length > 1) {
      const locale = detectLocale(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // ── Security headers ──
  addSecurityHeaders(supabaseResponse);

  return supabaseResponse;
}

function addSecurityHeaders(response: NextResponse) {
  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://cdn.jsdelivr.net https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://res.cloudinary.com https://placehold.co https://*.supabase.co https://images.unsplash.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' ${isDev ? 'ws://localhost:* http://localhost:*' : ''} https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.cloudinary.com https://upload.cloudinary.com;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDev ? '' : 'upgrade-insecure-requests;'}
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
