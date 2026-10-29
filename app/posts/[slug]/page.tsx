import { getPostBySlug } from '@/lib/local-store.server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Eye } from 'lucide-react';
import { CommentSection } from '@/components/CommentSection';
import { CATEGORY_LABEL, CATEGORY_SLUG } from '@/components/ArticleCard';
import { ViewTracker } from '@/components/ViewTracker';
import ReactionPanel from '@/components/ReactionPanel';
import { ReadingProgress } from '@/components/ReadingProgress';
import fs from 'fs';
import path from 'path';

// ── Mock posts as fallback for the demo slugs ─────────────────────────────────
const MOCK_MAP: Record<string, any> = {
    'er-karakterer-rettferdige': {
        id: '1', title: 'Er karakterer egentlig rettferdige?', slug: 'er-karakterer-rettferdige',
        category: 'school', createdAt: new Date(Date.now() - 7200000).toISOString(),
        flag_count: 0, view_count: 247, is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=85',
        authorName: 'martine_e',
        content: `Karaktersystemet vårt er designet for å måle kunnskap, men gjør det egentlig det? Mange elever opplever at karakterer er mer et mål på memoreringsevne enn faktisk forståelse.

I en verden der kreativitet og kritisk tenkning stadig blir viktigere, bør vi spørre oss: er tallkarakterer utdatert?

Studier viser at karakterpress fører til økt stress og angst blant unge. Saken er satt på dagsorden av flere skolepolitikere, men lite har endret seg de siste ti årene.

## Hva sier forskningen?

Forskning på alternativ vurdering viser lovende resultater. Skoler som har innført mappevurdering rapporterer om mer engasjerte elever og bedre læringsutbytte på lengre sikt.

## Hva kan vi gjøre?

Det handler ikke nødvendigvis om å fjerne karakterer helt, men om å supplere dem med mer meningsfull tilbakemelding.`,
    },
    'psykisk-helse-sosiale-medier': {
        id: '2', title: 'Ungdommens psykiske helse i sosiale mediers tid', slug: 'psykisk-helse-sosiale-medier',
        category: 'mental_health', createdAt: new Date(Date.now() - 18000000).toISOString(),
        flag_count: 0, view_count: 189, is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=85',
        authorName: 'oskarl',
        content: `Vi bruker i snitt over 4 timer daglig på sosiale medier. Hva gjør dette med psyken vår?

Forskning peker på sammenhenger mellom høyt forbruk av Instagram og TikTok og økt risiko for depresjon og angst.

## Den doble naturen

Sosiale medier er verken godt eller vondt i seg selv. Det handler om hvordan vi bruker dem.

## Hva trenger vi?

Digital kompetanse bør inn i skolen på lik linje med lesing og skriving.`,
    },
    'stemmealer-16': {
        id: '3', title: 'Bør stemmealderen senkes til 16?', slug: 'stemmealer-16',
        category: 'politics', createdAt: new Date(Date.now() - 28800000).toISOString(),
        flag_count: 0, view_count: 134, is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=85',
        authorName: 'sofiak',
        content: `Flere land i Europa har allerede senket stemmealderen til 16. Østerrike og Skottland er blant de fremste eksemplene.

16-åringer kan ta sertifikat, jobbe og betale skatt. De rammes av politiske beslutninger i årtier framover.

## Argumentene for

Unge velgere viser seg å ha høyere valgdeltakelse enn eldre debutanter.

## Argumentene mot

Modenheten varierer. Hjernen er ikke ferdig utviklet.`,
    },
};

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const local = getPostBySlug(slug);
    const post = local || MOCK_MAP[slug];
    if (!post) return { title: 'Artikkel ikke funnet — Paragraf100' };
    return { title: `${post.title} — Paragraf100`, description: post.content.slice(0, 150) };
}

// Render markdown-like paragraphs with bold/italic support
function renderBody(content: string) {
    return content.split('\n\n').filter(Boolean).map((para, i) => {
        if (para.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-ink mt-10 mb-4">{para.slice(3)}</h2>;
        if (para.startsWith('### ')) return <h3 key={i} className="font-display text-xl font-semibold text-ink mt-8 mb-3">{para.slice(4)}</h3>;
        if (para.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-fjord/40 pl-5 italic text-ink-400 my-6">{para.slice(2)}</blockquote>;
        const parts = para.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((chunk, j) => {
            if (chunk.startsWith('**') && chunk.endsWith('**')) return <strong key={j} className="font-bold text-ink">{chunk.slice(2, -2)}</strong>;
            if (chunk.startsWith('*') && chunk.endsWith('*')) return <em key={j} className="italic">{chunk.slice(1, -1)}</em>;
            return chunk;
        });
        return <p key={i} className="text-ink-500 leading-[1.9] mb-6 text-[1.09rem]">{parts}</p>;
    });
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;

    // Check local storage first, then fall back to mock data
    const localPost = getPostBySlug(slug);
    const mockPost = MOCK_MAP[slug];
    const raw = localPost || mockPost;
    if (!raw) notFound();

    // Normalise: local posts use `createdAt`, mock posts vary
    // Join with user data for real avatar
    let users: any[] = [];
    try {
        users = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf-8'));
    } catch (e) { }

    const author = users.find(u => u.id === raw.authorId);

    const post = {
        ...raw,
        created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
        profiles: author ? {
            username: author.name,
            avatar_url: author.avatarUrl
        } : (raw.profiles || { username: raw.authorName || 'Anonym' }),
    };

    const paragraphs = post.content.split('\n\n').filter(Boolean);
    const dateStr = new Date(post.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
    const isBase64 = post.image_url?.startsWith('data:');
    const wordCount = post.content.replace(/\n/g, ' ').split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-[75ch] mx-auto">
            <ReadingProgress />
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Tilbake til forsiden
            </Link>

            {/* 5-second view tracker — invisible, fires after reading */}
            <ViewTracker postId={post.id} />

            <article>
                {/* Hero image — base64 or URL */}
                {post.image_url && (
                    <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden mb-8 shadow-lg">
                        {isBase64 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                            <Image src={post.image_url} alt={post.title} fill className="object-cover" priority />
                        )}
                    </div>
                )}

                <header className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href={`/category/${CATEGORY_SLUG[post.category] || post.category}`}
                            className={`badge badge-${post.category} hover:opacity-80 transition-opacity`}>
                            {CATEGORY_LABEL[post.category] || post.category}
                        </Link>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4 tracking-tight">
                        {post.title}
                    </h1>
                    {post.subtitle && (
                        <p className="text-xl text-ink-400 mb-6 leading-snug">{post.subtitle}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-sand-dark/40">
                        <div className="flex items-center gap-2.5">
                            {post.profiles?.avatar_url ? (
                                <img
                                    src={post.profiles.avatar_url}
                                    alt=""
                                    className="w-10 h-10 rounded-full border border-sand-dark object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                                    style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                                    {(post.profiles?.username || 'A')[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-ink leading-none">
                                    {post.profiles?.username || 'Anonym'}
                                    {post.organization && (
                                        <span className="text-fjord ml-1.5 font-bold italic opacity-85">
                                            · {post.position && `${post.position}, `}{post.organization}
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-ink-300 mt-0.5 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />{dateStr}
                                    <span className="text-sand-dark/60">·</span>
                                    <span>⏱️ {readingMinutes} min lesetid</span>
                                </p>
                            </div>
                        </div>
                        <span className="ml-auto flex items-center gap-1 text-xs text-ink-300">
                            <Eye className="w-3.5 h-3.5" />{post.view_count || 0} visninger
                        </span>
                    </div>
                </header>

                {/* Body */}
                <div className="reading-body">
                    {renderBody(post.content)}
                </div>

                <div className="mt-12 pt-6 border-t border-sand-dark/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-ink-300">Hva synes du om innlegget?</p>
                    <ReactionPanel targetId={post.slug} initialReactions={post.reactions || {}} />
                </div>

                <div className="mt-12">
                    <CommentSection postId={post.id} />
                </div>
            </article>
        </div>
    );
}
