import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/agence/',
        disallow: ['/aqarpro/', '/api/', '/login', '/register'],
      },
    ],
  };
}
