import { createClient } from '@/lib/supabase/server';
import { MasonryGrid } from '@/components/MasonryGrid';
import type { Post } from '@/components/ArticleCard';
import { CATEGORY_LABEL } from '@/components/ArticleCard';
import Link from 'next/link';
import type { Metadata } from 'next';

// Map URL slug → DB category value
const SLUG_TO_DB: Record<string, string> = {
    'skole': 'school',
    'politikk': 'politics',
    'psykisk-helse': 'mental_health',
    'samfunn': 'society',
};

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const dbCat = SLUG_TO_DB[slug];
    const label = CATEGORY_LABEL[dbCat] || slug;
    return { title: `${label} — Paragraf100` };
}

async function getPostsByCategory(dbCategory: string): Promise<Post[]> {
    const supabase = await createClient();
    const { data } = await (supabase
        .from('posts')
        .select('id, title, slug, content, category, created_at, flag_count, view_count, is_featured, image_url, profiles(username), comments(count)')
        .eq('status', 'published')
        .eq('category', dbCategory)
        .order('created_at', { ascending: false })
        .limit(30) as any);

    if (!data || !data.length) return MOCK_POSTS.filter((p) => p.category === dbCategory);
    return data.map((p: any) => ({ ...p, comment_count: p.comments?.[0]?.count ?? 0, profiles: Array.isArray(p.profiles) ? p.profiles[0] : p.profiles }));
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const dbCat = SLUG_TO_DB[slug];

    if (!dbCat) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
                <div>
                    <div className="text-5xl mb-4">🔍</div>
                    <h1 className="font-display text-2xl font-bold text-ink mb-2">Kategori ikke funnet</h1>
                    <Link href="/" className="text-fjord text-sm font-medium hover:underline">← Tilbake til forsiden</Link>
                </div>
            </div>
        );
    }

    const posts = await getPostsByCategory(dbCat);
    const label = CATEGORY_LABEL[dbCat];

    const categoryIcon: Record<string, string> = {
        school: '📚', politics: '🗳️', mental_health: '🧠', society: '🌍',
    };

    return (
        <div className="min-h-screen">
            <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-16 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink transition-colors mb-6">
                        ← Alle kategorier
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{categoryIcon[dbCat]}</span>
                        <div>
                            <h1 className="font-display text-4xl font-bold text-ink">{label}</h1>
                            <p className="text-ink-300 text-sm mt-1">{posts.length} innlegg</p>
                        </div>
                    </div>
                </div>
                <MasonryGrid posts={posts} />
            </section>
        </div>
    );
}

// Reuse mock posts from main page
const MOCK_POSTS: Post[] = [
    { id: '1', title: 'Er karakterer egentlig rettferdige?', slug: 'er-karakterer-rettferdige', content: 'Karaktersystemet vårt er designet for å måle kunnskap, men gjør det egentlig det? Mange elever opplever at karakterer er mer et mål på memoreringsevne enn faktisk forståelse.\n\nI en verden der kreativitet og kritisk tenkning stadig blir viktigere, bør vi spørre oss: er tallkarakterer utdatert?', category: 'school', created_at: new Date(Date.now() - 7200000).toISOString(), flag_count: 0, view_count: 247, is_featured: true, image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80', profiles: { username: 'martine_e' }, comment_count: 14 },
    { id: '5', title: 'Leksefri skole – drøm eller virkelighet?', slug: 'leksefri-skole', content: 'Færre lekser er vedtatt i flere kommuner. Forskning spriker. Er lekser et nødvendig verktøy for læring, eller handler det bare om ytelse og kontroll?', category: 'school', created_at: new Date(Date.now() - 72000000).toISOString(), flag_count: 0, view_count: 71, is_featured: false, profiles: { username: 'lindam' }, comment_count: 7 },
    { id: '3', title: 'Bør stemmealderen senkes til 16?', slug: 'stemmealer-16', content: 'Flere land i Europa har allerede senket stemmealderen til 16.', category: 'politics', created_at: new Date(Date.now() - 28800000).toISOString(), flag_count: 0, view_count: 134, is_featured: false, image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80', profiles: { username: 'sofiak' }, comment_count: 42 },
    { id: '6', title: 'Gen Z og politisk apati – myte eller realitet?', slug: 'gen-z-politisk-apati', content: 'Valgdeltakelsen blant unge er lavere enn blant eldre. Men betyr dette at unge er apatiske?', category: 'politics', created_at: new Date(Date.now() - 93600000).toISOString(), flag_count: 0, view_count: 155, is_featured: false, profiles: { username: 'akselh' }, comment_count: 17 },
    { id: '2', title: 'Ungdommens psykiske helse i sosiale mediers tid', slug: 'psykisk-helse-sosiale-medier', content: 'Vi bruker i snitt over 4 timer daglig på sosiale medier. Hva gjør dette med psyken vår?', category: 'mental_health', created_at: new Date(Date.now() - 18000000).toISOString(), flag_count: 0, view_count: 189, is_featured: true, image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', profiles: { username: 'oskarl' }, comment_count: 28 },
    { id: '7', title: 'Ensomhet blant menn: et tabu vi ikke snakker om', slug: 'ensomhet-menn-tabu', content: 'Statistikk viser at menn i alle aldre er mer ensomme enn kvinner, men er langt mindre tilbøyelige til å søke hjelp.', category: 'mental_health', created_at: new Date(Date.now() - 129600000).toISOString(), flag_count: 0, view_count: 213, is_featured: false, profiles: { username: 'tobiasr' }, comment_count: 33 },
    { id: '4', title: 'Klimaangst: en rasjonell respons?', slug: 'klimaangst-rasjonell', content: 'Stadig flere unge rapporterer om klimaangst. Men er bekymringen for fremtiden faktisk en sunn og rasjonell reaksjon?', category: 'society', created_at: new Date(Date.now() - 50400000).toISOString(), flag_count: 0, view_count: 98, is_featured: false, image_url: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80', profiles: { username: 'erikb' }, comment_count: 9 },
    { id: '8', title: 'Influencer-kulturen og kropp: hvem har ansvar?', slug: 'influencer-kropp-ansvar', content: 'Når influencere med millioner av følgere markedsfører vekttapsprodukt og skjønnhetsoperasjoner, hvem bærer ansvaret?', category: 'society', created_at: new Date(Date.now() - 172800000).toISOString(), flag_count: 0, view_count: 89, is_featured: false, profiles: { username: 'idah' }, comment_count: 5 },
];
