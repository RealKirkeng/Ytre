'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PenLine, Check, X, Loader2, Clock, Eye, Menu, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { CropModal } from '@/components/CropModal';

interface Post {
    id: string;
    title: string;
    slug: string;
    subtitle?: string;
    content: string;
    category: string;
    status: 'pending' | 'published' | 'rejected' | 'draft';
    createdAt: string;
    updatedAt?: string;
    view_count: number;
    authorName: string;
}

interface Comment {
    id: string;
    postId: string;
    content: string;
    createdAt: string;
    authorName: string;
}

const CATEGORY_LABELS: Record<string, string> = {
    school: '📚 Skole', politics: '🗳️ Politikk', mental_health: '🧠 Psykisk helse',
    society: '🌍 Samfunn', environment: '🌱 Miljø', technology: '💻 Teknologi',
    infrastructure: '🏗️ Infrastruktur', culture: '🎭 Kultur', economy: '💰 Økonomi', rights: '⚖️ Rettigheter',
};

const STATUS_CONFIG = {
    pending: { label: 'Venter godkjenning', icon: Clock, color: 'text-amber-600  bg-amber-50  border-amber-200' },
    published: { label: 'Publisert', icon: Check, color: 'text-green-600  bg-green-50  border-green-200' },
    rejected: { label: 'Avvist', icon: X, color: 'text-red-500    bg-red-50    border-red-200' },
    draft: { label: 'Utkast', icon: PenLine, color: 'text-ink-300    bg-sand      border-sand-dark/40' },
};

const THEMES = [
    { id: 'original', label: 'Nordisk Lys', color: 'bg-[#FDFBFA]' },
    { id: 'dark', label: 'Midnattsblå', color: 'bg-[#1A1612]' },
    { id: 'blue', label: 'Fjord Blå', color: 'bg-gradient-to-br from-[#5B89A8] to-[#8FA9BB]' },
    { id: 'purple', label: 'Lyng Lilla', color: 'bg-gradient-to-br from-[#A87B8E] to-[#C99FB1]' },
    { id: 'rose', label: 'Solnedgang', color: 'bg-gradient-to-br from-[#E8A598] to-[#F2D1C1]' },
    { id: 'pride', label: 'Stolt', color: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' },
];

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [myComments, setMyComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'settings'>('posts');
    const [editId, setEditId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ title: '', subtitle: '', content: '', category: '' });
    const [saving, setSaving] = useState(false);
    const [confirm, setConfirm] = useState<string | null>(null);
    const [toast, setToast] = useState('');
    const [toastErr, setToastErr] = useState(false);
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const showToast = (msg: string, err = false) => {
        setToast(msg); setToastErr(err);
        setTimeout(() => setToast(''), 3500);
    };

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([
                fetch(`/api/posts?authorId=${user.id}`),
                fetch(`/api/comments?authorId=${user.id}`)
            ]);
            if (pRes.ok) setPosts(await pRes.json());
            if (cRes.ok) setMyComments(await cRes.json());
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => { if (user) fetchData(); }, [user, fetchData]);

    const startEdit = (p: Post) => {
        setEditId(p.id);
        setEditData({ title: p.title, subtitle: p.subtitle || '', content: p.content, category: p.category });
    };

    const saveEdit = async () => {
        if (!editId) return;
        setSaving(true);
        const res = await fetch('/api/posts', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editId, ...editData }),
        });
        setSaving(false);
        if (res.ok) { showToast('Endringer lagret!'); setEditId(null); fetchData(); }
        else showToast('Feil ved lagring.', true);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch('/api/posts', {
            method: 'DELETE', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        if (res.ok) { showToast('Innlegget er slettet.'); setConfirm(null); fetchData(); }
        else showToast('Feil ved sletting.', true);
    };

    const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            setCroppingImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBase64: string) => {
        setCroppingImage(null);
        setSaving(true);
        const res = await fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatarUrl: croppedBase64 }),
        });
        setSaving(false);
        if (res.ok) {
            showToast('Profilbilde oppdatert!');
            window.location.reload();
        } else showToast('Feil ved lagring.', true);
    };

    const updateSettings = async (data: any) => {
        setSaving(true);
        const res = await fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        setSaving(false);
        if (res.ok) {
            showToast('Innstillinger lagret!');
            window.location.reload();
        } else showToast('Feil ved lagring.', true);
    };

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-ink-300" />
        </div>
    );

    if (!user) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center px-4">
            <p className="text-5xl">🔒</p>
            <h1 className="font-display text-2xl font-bold text-ink">Logg inn for å se profilen din</h1>
            <Link href="/auth/login" className="mt-2 text-fjord text-sm hover:underline">Logg inn →</Link>
        </div>
    );

    const published = posts.filter(p => p.status === 'published').length;
    const pending = posts.filter(p => p.status === 'pending').length;

    return (
        <div className="min-h-screen bg-sand">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
                {/* Back */}
                <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Tilbake
                </button>

                {/* Profile header */}
                <div className="bg-white rounded-3xl border border-sand-dark/40 p-6 mb-8 flex items-center gap-5"
                    style={{ boxShadow: '0 2px 20px rgba(26,22,18,0.07)' }}>

                    <div className="relative group shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name}
                                className="w-16 h-16 rounded-2xl object-cover border border-sand-dark/40" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-sm"
                                style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}>
                                {user.name[0].toUpperCase()}
                            </div>
                        )}
                        <button onClick={() => fileRef.current?.click()}
                            className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-white border border-sand-dark/50 shadow-sm text-ink-400 hover:text-fjord transition-colors">
                            <PenLine className="w-3.5 h-3.5" />
                        </button>
                        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleAvatarFile} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="font-display text-2xl font-bold text-ink">{user.name}</h1>
                        <p className="text-sm text-ink-400 mt-0.5">{user.email}</p>
                        {user.isAdmin && (
                            <span className="mt-1.5 inline-block text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
                        )}
                    </div>
                    {/* Stats */}
                    <div className="hidden sm:flex gap-6 text-center shrink-0">
                        <div>
                            <p className="text-2xl font-black text-ink">{published}</p>
                            <p className="text-xs text-ink-300 mt-0.5">Publisert</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-amber-500">{pending}</p>
                            <p className="text-xs text-ink-300 mt-0.5">Venter</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-ink">{posts.reduce((s, p) => s + (p.view_count || 0), 0)}</p>
                            <p className="text-xs text-ink-300 mt-0.5">Visninger</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-sand-dark/30 mb-8 gap-8">
                    {(['posts', 'comments', 'settings'] as const).map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === t ? 'text-fjord' : 'text-ink-300 hover:text-ink-500'}`}>
                            {t === 'posts' ? 'Mine innlegg' : t === 'comments' ? 'Mine kommentarer' : 'Innstillinger'}
                            {activeTab === t && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-fjord" />}
                        </button>
                    ))}
                </div>

                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-display font-bold text-ink text-lg">Publiseringer</h2>
                            <Link href="/skriv"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all"
                                style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}>
                                <PenLine className="w-4 h-4" /> Nytt innlegg
                            </Link>
                        </div>

                        {pending > 0 && (
                            <div className="px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50 text-sm text-amber-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 shrink-0" />
                                <span>Du har <strong>{pending}</strong> innlegg som venter på vurdering.</span>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-20 text-ink-200"><Loader2 className="w-6 h-6 animate-spin" /></div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-sand-dark/60">
                                <p className="text-4xl mb-4">✍️</p>
                                <p className="text-sm font-medium text-ink-400">Du har ikke skrevet noe ennå.</p>
                                <Link href="/skriv" className="text-fjord text-sm mt-2 inline-block font-semibold hover:underline">Skriv ditt første innlegg →</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {posts.map(p => {
                                    const sc = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.draft;
                                    const StatusIcon = sc.icon;
                                    return (
                                        <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="bg-white rounded-2xl border border-sand-dark/30 overflow-hidden shadow-sm">
                                            {editId === p.id ? (
                                                <div className="p-5 space-y-4">
                                                    <input value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                                                        className="w-full bg-sand/50 p-2.5 rounded-xl border border-sand-dark/40 text-sm font-bold" placeholder="Tittel" />
                                                    <textarea value={editData.content} onChange={e => setEditData(d => ({ ...d, content: e.target.value }))}
                                                        rows={8} className="w-full bg-sand/50 p-2.5 rounded-xl border border-sand-dark/40 text-sm resize-none" placeholder="Innhold" />
                                                    <div className="flex gap-2">
                                                        <button onClick={saveEdit} disabled={saving} className="flex-1 bg-fjord text-white py-2 rounded-xl text-sm font-bold">Lagre</button>
                                                        <button onClick={() => setEditId(null)} className="flex-1 border border-sand-dark/60 text-ink-400 py-2 rounded-xl text-sm font-bold">Avbryt</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 flex items-center justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sc.color}`}>
                                                                <StatusIcon className="w-2.5 h-2.5" /> {sc.label}
                                                            </span>
                                                            <span className="text-[10px] text-ink-300">{new Date(p.createdAt).toLocaleDateString('nb-NO')}</span>
                                                        </div>
                                                        <h3 className="font-bold text-ink text-sm sm:text-base truncate">{p.title}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-sand transition-colors"><PenLine className="w-4 h-4 text-ink-300" /></button>
                                                        <button onClick={() => setConfirm(p.id)} className="p-2 rounded-lg hover:bg-red-50 group transition-colors"><X className="w-4 h-4 text-ink-300 group-hover:text-red-500" /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'comments' && (
                    <div className="space-y-4">
                        <h2 className="font-display font-bold text-ink text-lg mb-4">Mine kommentarer</h2>
                        {myComments.length === 0 ? (
                            <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-sand-dark/60 text-ink-300">
                                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">Du har ikke kommentert på noen innlegg ennå.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {myComments.map(c => (
                                    <div key={c.id} className="bg-white rounded-2xl border border-sand-dark/30 p-4 shadow-sm">
                                        <p className="text-sm text-ink-500 mb-2 leading-relaxed italic">"{c.content}"</p>
                                        <div className="flex items-center justify-between text-[10px] text-ink-300 font-bold uppercase tracking-widest">
                                            <span>Kommentert {new Date(c.createdAt).toLocaleDateString('nb-NO')}</span>
                                            <Link href={`/posts/${c.postId}`} className="text-fjord hover:underline">Se i tråd →</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-8 bg-white rounded-3xl border border-sand-dark/30 p-8 shadow-sm">
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Menu className="w-5 h-5 text-fjord" />
                                <h2 className="font-display font-bold text-ink text-lg">Fargetema</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {THEMES.map(t => (
                                    <button key={t.id} onClick={() => updateSettings({ theme: t.id })}
                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${user.theme === t.id ? 'border-fjord bg-fjord/5' : 'border-sand-dark/20 hover:border-sand-dark/40'}`}>
                                        <div className={`w-10 h-10 rounded-full shadow-inner ${t.color}`} />
                                        <span className="text-xs font-bold text-ink">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="border-t border-sand-dark/20 pt-8">
                            <div className="flex items-center gap-2 mb-6">
                                <PenLine className="w-5 h-5 text-fjord" />
                                <h2 className="font-display font-bold text-ink text-lg">Skrifttype</h2>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => updateSettings({ font: 'default' })}
                                    className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all text-center ${user.font !== 'serif' && user.font !== 'opensans' && user.font !== 'hyperlegible' && user.font !== 'comic' ? 'border-fjord bg-fjord/5' : 'border-sand-dark/20 hover:border-sand-dark/40'}`}>
                                    <p className="font-display text-xl font-bold text-ink">Abcd</p>
                                    <p className="text-xs text-ink-300 mt-1">Inter (Standard)</p>
                                </button>
                                <button onClick={() => updateSettings({ font: 'serif' })}
                                    className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all text-center ${user.font === 'serif' ? 'border-fjord bg-fjord/5' : 'border-sand-dark/20 hover:border-sand-dark/40'}`}>
                                    <p className="text-xl font-bold text-ink" style={{ fontFamily: 'serif' }}>Abcd</p>
                                    <p className="text-xs text-ink-300 mt-1">Times New Roman</p>
                                </button>
                                <button onClick={() => updateSettings({ font: 'opensans' })}
                                    className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all text-center ${user.font === 'opensans' ? 'border-fjord bg-fjord/5' : 'border-sand-dark/20 hover:border-sand-dark/40'}`}>
                                    <p className="text-xl font-bold text-ink" style={{ fontFamily: 'var(--font-opensans)' }}>Abcd</p>
                                    <p className="text-xs text-ink-300 mt-1">Open Sans (Høy Lesbarhet)</p>
                                </button>
                                <button onClick={() => updateSettings({ font: 'hyperlegible' })}
                                    className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all text-center ${user.font === 'hyperlegible' ? 'border-fjord bg-fjord/5' : 'border-sand-dark/20 hover:border-sand-dark/40'}`}>
                                    <p className="text-xl font-bold text-ink" style={{ fontFamily: 'var(--font-atkinson)' }}>Abcd</p>
                                    <p className="text-xs text-ink-300 mt-1">Hyperlegible (For Dysleksi)</p>
                                </button>
                                <button onClick={() => updateSettings({ font: 'comic' })}
                                    className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all text-center ${user.font === 'comic' ? 'border-fjord bg-fjord/5' : 'border-sand-dark/20 hover:border-sand-dark/40'}`}>
                                    <p className="text-xl font-bold text-ink" style={{ fontFamily: 'var(--font-comic)' }}>Abcd</p>
                                    <p className="text-xs text-ink-300 mt-1">Comic Neue (Gøyal)</p>
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-xl z-50 ${toastErr ? 'bg-red-500' : 'bg-green-600'}`}>
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Crop Modal */}
            <AnimatePresence>
                {croppingImage && (
                    <CropModal
                        image={croppingImage}
                        onClose={() => setCroppingImage(null)}
                        onCropComplete={handleCropComplete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
