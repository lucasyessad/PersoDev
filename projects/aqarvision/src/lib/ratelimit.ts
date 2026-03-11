import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting configuration using Upstash Redis
 *
 * Utilisation:
 * - API routes sensibles (auth, lead, contact)
 * - Protection contre les abus
 * - Sliding window algorithm
 */

// Créer une instance Redis (nécessite UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Rate limiters pour différents endpoints

/**
 * Rate limiter strict pour les routes d'authentification
 * 5 requêtes par 15 minutes par IP
 */
export const authRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "ratelimit:auth",
    })
  : null;

/**
 * Rate limiter modéré pour les formulaires de contact/lead
 * 10 requêtes par heure par IP
 */
export const contactRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "ratelimit:contact",
    })
  : null;

/**
 * Rate limiter pour la génération IA
 * 5 requêtes par minute par utilisateur
 */
export const iaRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "ratelimit:ia",
    })
  : null;

/**
 * Rate limiter pour les analytics (anti-spam)
 * 30 requêtes par minute par IP
 */
export const analyticsRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      analytics: true,
      prefix: "ratelimit:analytics",
    })
  : null;

/**
 * Rate limiter pour les API générales
 * 100 requêtes par minute par IP
 */
export const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null;

/**
 * Helper pour vérifier et appliquer le rate limit
 * Retourne true si la requête est autorisée
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!limiter) {
    // Si Redis n'est pas configuré, autoriser la requête (mode dev)
    console.warn("Rate limiting disabled: Redis not configured");
    return { success: true };
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // En cas d'erreur Redis, autoriser la requête pour ne pas bloquer le service
    return { success: true };
  }
}

/**
 * Extraire l'identifiant de la requête (IP ou user ID)
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  // Préférer l'user ID si disponible (plus précis que l'IP)
  if (userId) {
    return `user:${userId}`;
  }

  // Sinon utiliser l'IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";

  return `ip:${ip}`;
}

/**
 * Middleware helper pour Next.js API routes
 */
export function withRateLimit(
  handler: (req: Request) => Promise<Response>,
  limiter: Ratelimit | null
) {
  return async (req: Request): Promise<Response> => {
    const identifier = getRateLimitIdentifier(req);
    const { success, limit, remaining, reset } = await checkRateLimit(identifier, limiter);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Vous avez dépassé la limite de requêtes. Veuillez réessayer plus tard.",
          limit,
          remaining,
          reset,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit?.toString() || "",
            "X-RateLimit-Remaining": remaining?.toString() || "",
            "X-RateLimit-Reset": reset?.toString() || "",
            "Retry-After": reset ? Math.ceil((reset - Date.now()) / 1000).toString() : "60",
          },
        }
      );
    }

    // Ajouter les headers de rate limit à la réponse
    const response = await handler(req);

    if (limit && remaining !== undefined && reset) {
      response.headers.set("X-RateLimit-Limit", limit.toString());
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", reset.toString());
    }

    return response;
  };
}
