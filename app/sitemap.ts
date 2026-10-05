import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const paths = ['', '/about', '/services', '/fleet', '/projects', '/quality-hse', '/contact', '/privacy', '/terms']; return paths.map((path) => ({ url: `https://ruachdredging.com${path}`, lastModified: new Date(), changeFrequency: 'monthly', priority: path === '' ? 1 : .8 })); }
