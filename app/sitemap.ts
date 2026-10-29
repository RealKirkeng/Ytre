import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/local-store.server';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ytre.no';

    // Static routes
    const routes = ['', '/skriv', '/profil', '/auth/login', '/auth/signup', '/vilkar', '/personvern', '/om-oss', '/kontakt', '/retningslinjer', '/medielisensiering', '/bli-verifiserer', '/juridisk'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic routes (Public Posts)
    // For local MVP, we only read from the initial store.
    // Replace with real DB fetch in production.
    const posts = getPosts();
    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/innlegg/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date(post.createdAt).toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...postRoutes];
}
