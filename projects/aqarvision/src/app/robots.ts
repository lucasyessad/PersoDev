import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://aqarvision.dz';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/agence/', '/recherche', '/bien/', '/pricing'],
        disallow: ['/aqarpro/', '/api/', '/login', '/signup', '/register', '/dashboard/', '/auth/', '/profil'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
