import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/profil/innstillinger/'],
        },
        sitemap: 'https://paragraf100.no/sitemap.xml',
    };
}
