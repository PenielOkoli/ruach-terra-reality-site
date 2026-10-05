import type { MetadataRoute } from 'next';
import { company } from '@/content/site';
export default function manifest(): MetadataRoute.Manifest { return { name: company.name, short_name: 'Ruach Dredging', description: 'Dredging | Hydraulic Fill | Reclamation', start_url: '/', display: 'standalone', background_color: '#071d3c', theme_color: '#071d3c', icons: [{ src: '/logo.png', sizes: '640x640', type: 'image/png' }] }; }
