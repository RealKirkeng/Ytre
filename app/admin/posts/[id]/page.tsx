'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Check, X, Loader2, PenLine,
    Eye, Clock, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { checkContent, ModerationResult } from '@/lib/moderation';
import { useAuth } from '@/hooks/useAuth';
import { ArticleInlineImage } from '@/components/ArticleInlineImage';

function formatAuthors(author: string, coAuthors?: string[]): string {
    if (!coAuthors || coAuthors.length === 0) return author;
    const all = [author, ...coAuthors.filter(Boolean)];
    if (all.length === 1) return all[0];
    if (all.length === 2) return `Av ${all[0]} og ${all[1]}`;
    return `Av ${all.slice(0, -1).join(', ')} og ${all[all.length - 1]}`;
}

const CATEGORY_LABEL: Record<string, string> = {
    school: '📚 Skole', politics: '🗳️ Politikk', mental_health: '🧠 Psykisk helse',
    society: '🌍 Samfunn', environment: '🌱 Miljø', technology: '💻 Teknologi',
    infrastructure: '🏗️ Infrastruktur', culture: '🎭 Kultur', economy: '💰 Økonomi', rights: '⚖️ Rettigheter',
};

// Reuse renderBody logic from article page
function renderBody(content: string) {
    if (!content) return null;
    return content.split('\n\n').filter(Boolean).map((para, i) => {
        if (para.startsWith(':::image:')) {
            try {
                const data = JSON.parse(para.slice(9, -3));
                return <ArticleInlineImage key={i} {...data} />;
            } catch {
                return null;
            }
        }
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

export default function AdminReviewPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user: admin } = useAuth();
    const [post, setPost] = useState<any>(null);
    const [author, setAuthor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [moderation, setModeration] = useState<ModerationResult | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch post
                const postRes = await fetch(`/api/posts/${id}`);
                if (!postRes.ok) throw new Error('Fant ikke innlegget');
                const postData = await postRes.json();
                setPost(postData);

                // Fetch author details (admins can see all users)
                const usersRes = await fetch('/api/admin/users'); // I'll assume this endpoint returns email
                if (usersRes.ok) {
                    const allUsers = await usersRes.json();
                    const authorData = allUsers.find((u: any) => u.id === postData.authorId);
                    setAuthor(authorData);
                }

                // Run moderation
                const modResult = checkContent(postData.title, postData.content);
                setModeration(modResult);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (admin?.isAdmin) fetchData();
    }, [id, admin]);

    const handleAction = async (status: 'published' | 'rejected') => {
        setActionLoading(status);
        try {
            const res = await fetch('/api/posts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                router.push('/admin');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    if (!admin?.isAdmin) return <div className="p-10 text-center">Ingen tilgang.</div>;
    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-fjord" /></div>;
    if (!post) return <div className="p-10 text-center">Fant ikke innlegget.</div>;

    const dateStr = new Date(post.createdAt || post.created_at).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-sand flex">
            {/* Sidebar Moderation Panel */}
            <aside className="hidden lg:flex w-96 bg-white border-r border-sand-dark/40 flex-col sticky top-0 h-screen overflow-y-auto">
                <div className="p-6 border-b border-sand-dark/20 flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-bold text-ink">Moderering</h2>
                        <p className="text-xs text-ink-300">Gjennomgang av innhold</p>
                    </div>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* Auto-flagging Results */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-ink uppercase tracking-wider">
                            <X className="w-5 h-5" /> Systemkontroll
                        </div>

                        {moderation?.isClean ? (
                            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-start gap-3">
                                <Check className="w-5 h-5" />
                                <div>
                                    <p className="text-sm font-bold text-green-700 leading-tight">Ingen flaggede ord</p>
                                    <p className="text-xs text-green-600 mt-1">Systemet fant ingen restricted ord i tittelen eller innholdet.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                                <X className="w-5 h-5" />
                                <div>
                                    <p className="text-sm font-bold text-red-700 leading-tight">Flere treff funnet</p>
                                    <p className="text-xs text-red-600 mt-1">Følgende ord bør vurderes manuelt:</p>
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {moderation?.flaggedTerms.map(term => (
                                            <span key={term} className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wide border border-red-200">
                                                {term}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-sand/30 p-4 rounded-2xl border border-sand-dark/20">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-xs font-bold text-ink-300 uppercase">Risiko-score</span>
                                <span className={`text-lg font-black ${moderation && moderation.riskScore > 50 ? 'text-red-500' : moderation && moderation.riskScore > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                                    {moderation?.riskScore}%
                                </span>
                            </div>
                            <div className="w-full bg-sand-dark/20 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${moderation?.riskScore}%` }}
                                    className={`h-full ${moderation && moderation.riskScore > 50 ? 'bg-red-500' : moderation && moderation.riskScore > 0 ? 'bg-amber-500' : 'bg-green-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Author Details */}
                    <div className="space-y-4 pt-6 border-t border-sand-dark/20">
                        <div className="flex items-center gap-2 text-sm font-bold text-ink uppercase tracking-wider">
                            <PenLine className="w-4 h-4" /> Skribent-detaljer
                        </div>
                        <div className="bg-white border border-sand-dark/40 p-4 rounded-2xl">
                            <p className="text-xs text-ink-300">Navn:</p>
                            <p className="text-sm font-bold text-ink">{post.authorName}</p>
                            <p className="text-xs text-ink-300 mt-2">E-post:</p>
                            <p className="text-sm font-semibold text-fjord break-all">{author?.email || 'Henter e-post...'}</p>
                            <a
                                href={`mailto:${author?.email}?subject=Vedrørende ditt innlegg: ${post.title}&body=Hei ${post.authorName}, %0D%0A%0D%0AVi har sett på ditt innlegg til Ytre.`}
                                className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-fjord text-fjord hover:bg-fjord/5 text-xs font-bold transition-all"
                            >
                                <BookOpen className="w-3.5 h-3.5" /> Kontakt skribent
                            </a>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-sand/20 border-t border-sand-dark/20 space-y-3">
                    <button
                        onClick={() => handleAction('published')}
                        disabled={!!actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm bg-green-500 hover:bg-green-600 transition-all shadow-lg shadow-green-200"
                    >
                        {actionLoading === 'published' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                        Godkjenn og publiser
                    </button>
                    <button
                        onClick={() => handleAction('rejected')}
                        disabled={!!actionLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold transition-all"
                    >
                        {actionLoading === 'rejected' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        Avvis artikkel
                    </button>
                </div>
            </aside>

            {/* Content Preview */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="max-w-[75ch] mx-auto px-6 lg:px-12 py-12">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-sand-dark/20 lg:hidden">
                        <Link href="/admin" className="flex items-center gap-2 text-sm text-ink-300 font-bold">
                            <ArrowLeft className="w-4 h-4" /> Admin
                        </Link>
                        <div className="flex gap-2">
                            <button onClick={() => handleAction('published')} className="text-green-500 p-2"><Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleAction('rejected')} className="text-red-500 p-2"><X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fjord/10 text-fjord text-[10px] font-bold uppercase tracking-widest">
                        <Eye className="w-3 h-3" /> Forhåndsvisning
                    </div>

                    <article className="pointer-events-none opacity-90 select-none">
                        {post.image_url && (
                            <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden mb-8 shadow-lg">
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <header className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none bg-white/80 text-ink border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-md"
                                    style={{
                                        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                                        backdropFilter: 'blur(16px) saturate(180%)',
                                    }}
                                >
                                    {CATEGORY_LABEL[post.category] || post.category}
                                </span>
                            </div>

                            <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4 tracking-tight">
                                {post.title}
                            </h1>
                            {post.subtitle && (
                                <p className="text-xl text-ink-400 mb-6 leading-snug">{post.subtitle}</p>
                            )}

                            <div className="flex items-center gap-2.5 pb-8 border-b border-sand-dark/40">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                                    style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                                    {(post.authorName || 'A')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-ink leading-none">
                                        {formatAuthors(post.authorName || 'Anonym', post.coAuthors)}
                                        {post.organization && (
                                            <span className="text-fjord ml-1.5 font-bold italic opacity-85">
                                                · {post.position && `${post.position}, `}{post.organization}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-ink-300 mt-0.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />{dateStr}
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className="reading-body">
                            {renderBody(post.content)}
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
