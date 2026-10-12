import type { MetadataRoute } from 'next';
import { company } from '@/content/company';

// Do not claim that every page changes each time a crawler requests this file.
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', '/services', '/fleet', '/projects', '/quality-hse', '/careers', '/contact', '/privacy', '/terms']
    .map(path => ({ url: `${company.website}${path}` }));
}
