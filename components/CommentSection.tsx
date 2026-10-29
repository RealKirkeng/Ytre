'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, PenLine, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserBadge } from '@/components/UserBadge';

interface Comment {
    id: string;
    postId: string;
    parentId?: string;
    content: string;
    createdAt: string;
    authorName: string;
    authorAvatar?: string;
}

function timeAgo(iso: string) {
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (d < 60) return 'nå nettopp';
    if (d < 3600) return `${Math.floor(d / 60)} min siden`;
    if (d < 86400) return `${Math.floor(d / 3600)} t siden`;
    return `${Math.floor(d / 86400)} d siden`;
}

export function CommentSection({ postId }: { postId: string }) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [posted, setPosted] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const fetchComments = async () => {
        setLoading(true); setFetchError('');
        try {
            const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`);
            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
        } catch { setFetchError('Kunne ikke laste kommentarer.'); }
        setLoading(false);
    };

    useEffect(() => { fetchComments(); }, [postId]);

    const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault();
        const text = parentId ? replyContent : content;
        if (!text.trim() || !user) return;
        setSubmitting(true);
        const res = await fetch('/api/comments', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content: text.trim(), parentId }),
        });
        if (res.ok) {
            if (parentId) {
                setReplyContent('');
                setReplyTo(null);
            } else {
                setContent('');
            }
            setPosted(true);
            setTimeout(() => setPosted(false), 3000);
            fetchComments();
        }
        setSubmitting(false);
    };

    const renderComments = (parentId: string | undefined = undefined, depth = 0) => {
        const filtered = comments.filter(c => c.parentId === parentId);
        if (filtered.length === 0) return null;

        return (
            <div className={depth > 0 ? "ml-4 sm:ml-8 mt-3 pl-4 border-l-2 border-sand-dark/20" : "space-y-4"}>
                {filtered.map(c => (
                    <div key={c.id} className="relative group">
                        <div className="bg-white rounded-2xl border border-sand-dark/40 p-4 hover:border-fjord/20 transition-colors shadow-sm">
                            <div className="flex items-center gap-2.5 mb-2">
                                {c.authorAvatar ? (
                                    <img src={c.authorAvatar} alt="" className="w-7 h-7 rounded-full border border-sand-dark object-cover shrink-0" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm"
                                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                                        {c.authorName?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <span className="text-xs font-bold text-ink">{c.authorName || 'Anonym'}</span>
                                <UserBadge postCount={0} totalViews={0} size="sm" />
                                <span className="text-[10px] text-ink-300 font-medium ml-auto uppercase tracking-wider">{timeAgo(c.createdAt)}</span>
                            </div>
                            <p className="text-sm text-ink-500 leading-relaxed break-words">{c.content}</p>

                            {user && depth < 3 && (
                                <div className="mt-3 flex items-center gap-4">
                                    <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-ink-300 hover:text-fjord transition-colors">
                                        Svar
                                    </button>
                                </div>
                            )}

                            {replyTo === c.id && (
                                <motion.form initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                    onSubmit={(e) => handleSubmit(e, c.id)} className="mt-4 pt-4 border-t border-sand-dark/20">
                                    <div className="bg-sand/30 rounded-xl border border-sand-dark/30 overflow-hidden">
                                        <textarea autoFocus value={replyContent} onChange={e => setReplyContent(e.target.value)}
                                            placeholder="Skriv ditt svar…" rows={2}
                                            className="w-full bg-transparent px-3 py-2 text-sm text-ink focus:outline-none resize-none" />
                                        <div className="flex items-center justify-end p-2 gap-2">
                                            <button type="button" onClick={() => setReplyTo(null)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-ink-300 hover:bg-white/50">Avbryt</button>
                                            <button type="submit" disabled={!replyContent.trim() || submitting}
                                                className="px-4 py-1.5 rounded-lg bg-fjord text-white text-xs font-bold disabled:opacity-50">
                                                Svar
                                            </button>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </div>
                        {renderComments(c.id, depth + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="mt-14 pt-10 border-t border-sand-dark/40">
            <h2 className="font-display text-xl font-bold text-ink mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-fjord" />
                Kommentarer {comments.length > 0 && <span className="text-ink-300 text-base font-normal">({comments.length})</span>}
            </h2>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="bg-white rounded-2xl border border-sand-dark/40 overflow-hidden focus-within:border-fjord/40 focus-within:ring-2 focus-within:ring-fjord/10 transition-all">
                        <textarea value={content} onChange={e => setContent(e.target.value)}
                            placeholder={`Del dine tanker, ${user.name.split(' ')[0]}…`}
                            rows={3} className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-ink placeholder-ink-300 resize-none focus:outline-none" />
                        <div className="flex items-center justify-between px-4 pb-3">
                            <span className="text-xs text-ink-300">{content.length}/500</span>
                            <button type="submit" disabled={!content.trim() || submitting}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-40 hover:brightness-110"
                                style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
                                Send
                            </button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {posted && (
                            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="text-xs text-green-600 font-medium mt-2 ml-1">✅ Kommentaren ble publisert!</motion.p>
                        )}
                    </AnimatePresence>
                </form>
            ) : (
                <div className="bg-white rounded-2xl border border-sand-dark/40 p-6 mb-8 text-center">
                    <User className="w-7 h-7 text-fjord mx-auto mb-3" />
                    <p className="text-sm font-semibold text-ink mb-1">Logg inn for å kommentere</p>
                    <p className="text-xs text-ink-300 mb-4">Alle kan lese — for å delta trenger du en konto.</p>
                    <div className="flex items-center justify-center gap-3">
                        <Link href="/auth/login"
                            className="px-5 py-2.5 rounded-xl border border-sand-dark/60 text-sm font-medium text-ink-400 hover:bg-sand/60 transition-colors">Logg inn</Link>
                        <Link href="/auth/signup"
                            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-110"
                            style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>Registrer gratis</Link>
                    </div>
                </div>
            )}

            <div>
                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-ink-200" /></div>
                ) : fetchError ? (
                    <p className="text-center text-sm text-red-500 py-8 font-medium">{fetchError}</p>
                ) : comments.length === 0 ? (
                    <div className="text-center py-16 bg-white/40 rounded-3xl border border-dashed border-sand-dark/60 text-ink-300">
                        <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium">Ingen kommentarer ennå.</p>
                        <p className="text-xs mt-1">Vær den første til å dele dine tanker!</p>
                    </div>
                ) : (
                    renderComments()
                )}
            </div>
        </section>
    );
}
