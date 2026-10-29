import { getPosts, getSettings } from '@/lib/local-store.server';
import { MasonryGrid } from '@/components/MasonryGrid';
import type { Post } from '@/components/ArticleCard';
import Link from 'next/link';
import { PenLine, X } from 'lucide-react';
import { FluidHero } from '@/components/FluidHero';
import { DiscoveryFilters } from '@/components/DiscoveryFilters';
import { SortFilter } from '@/components/SortFilter';
import { HomepageModulesCarousel } from '@/components/HomepageModulesCarousel';
import fs from 'fs';
import path from 'path';

interface HomePageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

const CATEGORIES = [
    { id: '', label: '🔥 Alle' },
    { id: 'school', label: '📚 Skole' },
    { id: 'politics', label: '🗳️ Politikk' },
    { id: 'mental_health', label: '🧠 Psykisk helse' },
    { id: 'society', label: '🌍 Samfunn' },
    { id: 'environment', label: '🌱 Miljø' },
    { id: 'technology', label: '💻 Teknologi' },
    { id: 'infrastructure', label: '🏗️ Infrastruktur' },
    { id: 'culture', label: '🎭 Kultur' },
    { id: 'economy', label: '💰 Økonomi' },
    { id: 'rights', label: '⚖️ Rettigheter' },
];

async function getLocalPosts(
    category?: string,
    region?: string,
    audience?: string,
    angle?: string,
    level?: string,
    orgLevel?: string,
    hasSources?: boolean,
    query?: string,
    sort?: string
): Promise<Post[]> {
    const local = getPosts(category, region);

    // Join with user data for avatars
    let users: any[] = [];
    try {
        users = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf-8'));
    } catch (e) { }

    // Fetch comment counts
    let comments: any[] = [];
    try {
        comments = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'comments.json'), 'utf-8'));
    } catch (e) { }

    let mapped: Post[] = local.map(p => {
        const author = users.find(u => u.id === p.authorId);
        const postComments = comments.filter(c => c.postId === p.id);
        return {
            id: p.id, title: p.title, slug: p.slug, content: p.content,
            category: p.category, created_at: p.createdAt,
            flag_count: p.flag_count, view_count: p.view_count,
            is_featured: p.is_featured, image_url: p.image_url,
            profiles: {
                username: p.authorName,
                avatar_url: author?.avatarUrl
            },
            comment_count: postComments.length,
            regions: p.regions ? p.regions.map(r => ({ level: r.level, id: r.id, name: r.name })) : undefined,
            audience: p.audience,
            angle: p.angle,
            readingLevel: p.readingLevel,
            sources: p.sources,
            organization: p.organization,
            position: p.position,
            orgLevel: p.orgLevel
        };
    });

    if (audience) mapped = mapped.filter(p => p.audience?.includes(audience));
    if (angle) mapped = mapped.filter(p => p.angle === angle);
    if (level) mapped = mapped.filter(p => p.readingLevel === level);
    if (orgLevel) mapped = mapped.filter(p => p.orgLevel === orgLevel);
    if (hasSources) mapped = mapped.filter(p => p.sources && p.sources.length > 0);

    if (query) {
        const q = query.toLowerCase();
        mapped = mapped.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.profiles?.username.toLowerCase().includes(q)
        );
    }

    let filteredMock = MOCK_POSTS;
    if (category) filteredMock = filteredMock.filter(p => p.category === category);
    if (region) filteredMock = filteredMock.filter(p => p.regions?.some(r => r.id === region));
    if (query) {
        const q = query.toLowerCase();
        filteredMock = filteredMock.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.profiles?.username.toLowerCase().includes(q)
        );
    }
    if (audience || angle || level || orgLevel || hasSources) filteredMock = [];

    const combined = [...mapped, ...filteredMock];

    // Final sorting
    if (sort === 'views') {
        combined.sort((a, b) => b.view_count - a.view_count);
    } else if (sort === 'comments') {
        combined.sort((a, b) => (b.comment_count ?? 0) - (a.comment_count ?? 0));
    } else {
        // Latest (default)
        combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return combined;
}

export default async function HomePage({ searchParams }: HomePageProps) {
    const sp = await searchParams;
    const category = sp.category ?? '';
    const region = sp.region ?? '';
    const audience = sp.audience ?? '';
    const angle = sp.angle ?? '';
    const level = sp.level ?? '';
    const orgLevel = sp.orgLevel ?? '';
    const hasSources = sp.sources === 'true';
    const query = sp.q ?? '';

    const posts = await getLocalPosts(
        category || undefined,
        region || undefined,
        audience || undefined,
        angle || undefined,
        level || undefined,
        orgLevel || undefined,
        hasSources,
        query || undefined,
        sp.sort
    );

    const settings = getSettings();

    return (
        <main className="min-h-screen relative" id="home-root">
            <div className="sticky top-0 z-0 h-[85vh] overflow-hidden">
                <FluidHero />
            </div>

            {/* Overlapping Content Panel */}
            <div className="relative z-10 bg-sand rounded-t-[3rem] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] sm:rounded-t-[4rem] min-h-screen pt-12 pb-24 -mt-[15vh]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-sand-dark/20 rounded-full mt-4" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    {settings?.isVideoFeatureEnabled && (
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex p-1 bg-sand-dark/30 rounded-2xl border border-sand-dark/10">
                                <Link href="/" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-ink shadow-sm pointer-events-none">
                                    📝 Artikler
                                </Link>
                                <Link href="/videoer" className="px-6 py-2.5 rounded-xl text-sm font-bold text-ink-500 hover:text-ink transition-colors flex items-center">
                                    🎬 Videoer <span className="ml-1.5 text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Multi-Module Homepage Carousel */}
                    {!query && !category && (
                        <div className="mb-0 sm:mb-2">
                            <HomepageModulesCarousel posts={[...posts].sort((a, b) => b.view_count - a.view_count)} />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 items-center py-2">
                        <div className="flex flex-wrap gap-1 items-center">
                            {CATEGORIES.map(cat => {
                                const active = category === cat.id;
                                return (
                                    <Link
                                        key={cat.id}
                                        href={cat.id ? `/?category=${cat.id}` : '/'}
                                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${active
                                            ? 'text-white border-transparent shadow-md'
                                            : 'border-sand-dark/20 text-ink-400 hover:text-ink hover:bg-white/80 hover:border-fjord/30 hover:shadow-soft hover:-translate-y-0.5'
                                            }`}
                                        style={active ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', borderColor: 'transparent' } : {}}
                                    >
                                        {cat.label}
                                    </Link>
                                );
                            })}
                        </div>

                        <span className="h-5 w-px bg-sand-dark/40 mx-2" />

                        <div className="flex flex-wrap gap-2 items-center">
                            <DiscoveryFilters />
                            <SortFilter />

                            {(category || region || query || audience || angle || level || orgLevel) && (
                                <Link
                                    href="/"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-fjord/30 bg-fjord/5 text-fjord hover:bg-fjord hover:text-white text-xs font-bold transition-all"
                                    title="Nullstill alle filtre og søk"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Nullstill
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-16 max-w-7xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center py-24 text-ink-300">
                            <p className="text-5xl mb-4">📭</p>
                            <p className="text-base font-medium">Ingen innlegg i denne kategorien ennå.</p>
                            <Link href="/skriv" className="mt-4 inline-block text-fjord text-sm hover:underline">Bli den første →</Link>
                        </div>
                    ) : (
                        <MasonryGrid posts={posts} />
                    )}
                </section>

                <footer className="border-t border-sand-dark/40 py-12 px-4 bg-sand rounded-t-[3rem] relative z-10">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>§</div>
                            <span className="font-display font-bold text-ink text-sm">Paragraf100</span>
                        </div>
                        <p className="text-ink-300 text-sm">© 2026 · Fri ytring for unge norske stemmer</p>
                        <div className="flex items-center gap-5 text-xs text-ink-300">
                            <Link href="/kontakt" className="hover:text-ink transition-colors">Kontakt</Link>
                            <Link href="/personvern" className="hover:text-ink transition-colors">Personvern</Link>
                            <Link href="/vilkar" className="hover:text-ink transition-colors">Vilkår</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}

const MOCK_POSTS: Post[] = [
    { id: '1', title: 'Er karakterer egentlig rettferdige?', slug: 'er-karakterer-rettferdige', content: 'Karaktersystemet vårt er designet for å måle kunnskap...', category: 'school', created_at: '2026-02-25T14:00:00.000Z', flag_count: 0, view_count: 247, is_featured: true, image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', profiles: { username: 'martine_e' }, comment_count: 14, regions: [{ level: 'fylke', id: 'oslo', name: 'Oslo' }] },
    { id: '2', title: 'Ungdommens psykiske helse i sosiale mediers tid', slug: 'psykisk-helse-sosiale-medier', content: 'Vi bruker i snitt over 4 timer daglig...', category: 'mental_health', created_at: '2026-02-25T12:00:00.000Z', flag_count: 0, view_count: 189, is_featured: true, image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', profiles: { username: 'oskarl' }, comment_count: 28, regions: [{ level: 'fylke', id: 'viken', name: 'Viken' }] },
    { id: '3', title: 'Bør stemmealderen senkes til 16?', slug: 'stemmealer-16', content: 'Flere land i Europa har allerede senket stemmealderen...', category: 'politics', created_at: '2026-02-25T10:00:00.000Z', flag_count: 0, view_count: 134, is_featured: false, image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80', profiles: { username: 'sofiak' }, comment_count: 42, regions: [{ level: 'fylke', id: 'oslo', name: 'Oslo' }] },
    { id: '4', title: 'Klimaangst: en rasjonell respons?', slug: 'klimaangst-rasjonell', content: 'Stadig flere unge rapporterer om klimaangst...', category: 'society', created_at: '2026-02-25T08:00:00.000Z', flag_count: 0, view_count: 98, is_featured: false, image_url: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80', profiles: { username: 'erikb' }, comment_count: 9, regions: [{ level: 'fylke', id: 'innlandet', name: 'Innlandet' }] },
    { id: '5', title: 'Leksefri skole – drøm eller virkelighet?', slug: 'leksefri-skole', content: 'Færre lekser er vedtatt i flere kommuner...', category: 'school', created_at: '2026-02-25T06:00:00.000Z', flag_count: 0, view_count: 71, is_featured: false, profiles: { username: 'lindam' }, comment_count: 7, regions: [{ level: 'fylke', id: 'vestland', name: 'Vestland' }] },
    { id: '6', title: 'Gen Z og politisk apati – myte eller realitet?', slug: 'gen-z-politisk-apati', content: 'Valgdeltakelsen blant unge er lavere enn...', category: 'politics', created_at: '2026-02-25T04:00:00.000Z', flag_count: 0, view_count: 155, is_featured: false, profiles: { username: 'akselh' }, comment_count: 17, regions: [{ level: 'fylke', id: 'agder', name: 'Agder' }] },
    { id: '7', title: 'Ensomhet blant menn: et tabu vi ikke snakker om', slug: 'ensomhet-menn-tabu', content: 'Statistikk viser at menn i alle aldre er mer ensomme...', category: 'mental_health', created_at: '2026-02-25T02:00:00.000Z', flag_count: 0, view_count: 213, is_featured: false, profiles: { username: 'tobiasr' }, comment_count: 33, regions: [{ level: 'fylke', id: 'rogaland', name: 'Rogaland' }] },
    { id: '8', title: 'Influencer-kulturen og kropp: hvem har ansvar?', slug: 'influencer-kropp-ansvar', content: 'Når influencere med millioner av følgere...', category: 'society', created_at: '2026-02-25T00:00:00.000Z', flag_count: 0, view_count: 89, is_featured: false, profiles: { username: 'idah' }, comment_count: 5, regions: [{ level: 'fylke', id: 'troms_finnmark', name: 'Troms og Finnmark' }] },
];
