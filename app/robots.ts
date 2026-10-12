import type { MetadataRoute } from 'next';
import { company } from '@/content/company';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/admin.html'] }, sitemap: `${company.website}/sitemap.xml` };
}
