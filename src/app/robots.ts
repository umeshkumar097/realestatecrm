import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://propgocrm.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/api',
          '/super-admin',
          '/portal-inactive',
          '/_next',
          '/static',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
