'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, X, Check, Loader2, ArrowLeft, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AdminReportsModule, ReportItem } from '@/components/admin/AdminReportsModule';

const CATEGORY_LABEL: Record<string, string> = {
    school: '📚 Skole', politics: '🗳️ Politikk', mental_health: '🧠 Psykisk helse',
    society: '🌍 Samfunn', environment: '🌱 Miljø', technology: '💻 Teknologi',
    infrastructure: '🏗️ Infrastruktur', culture: '🎭 Kultur', economy: '💰 Økonomi', rights: '⚖️ Rettigheter',
};

interface Post {
    id: string; title: string; subtitle?: string; content: string;
    category: string; authorName: string; createdAt: string;
    view_count: number; status: string;
}

type Tab = 'pending' | 'published' | 'rejected' | 'reports' | 'settings';

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const [contentType, setContentType] = useState<'articles' | 'videos'>('articles');
    const [tab, setTab] = useState<Tab>('pending');
    const [posts, setPosts] = useState<Post[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [settings, setSettings] = useState<{ isVideoFeatureEnabled: boolean } | null>(null);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ title: '', subtitle: '', content: '', category: '' });
    const [saving, setSaving] = useState(false);
    const [confirm, setConfirm] = useState<string | null>(null);
    const [toast, setToast] = useState('');
    const [approving, setApproving] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchPosts = async () => {
        setLoading(true);
        const [postsRes, settingsRes, videosRes, reportsRes] = await Promise.all([
            fetch('/api/posts/admin', { cache: 'no-store' }),
            fetch('/api/settings', { cache: 'no-store' }),
            fetch('/api/videos/admin', { cache: 'no-store' }),
            fetch('/api/reports', { cache: 'no-store' }),
        ]);
        if (postsRes.ok) { const data = await postsRes.json(); setPosts(Array.isArray(data) ? data : []); }
        if (settingsRes.ok) { const data = await settingsRes.json(); setSettings(data); }
        if (videosRes.ok) { const data = await videosRes.json(); setVideos(Array.isArray(data) ? data : []); }
        if (reportsRes.ok) { const data = await reportsRes.json(); setReports(Array.isArray(data) ? data : []); }
        setLoading(false);
    };

    useEffect(() => { if (user?.isAdmin) fetchPosts(); }, [user]);

    const toggleVideoFeature = async () => {
        if (!settings) return;
        const nextVal = !settings.isVideoFeatureEnabled;
        setSettings(s => s ? { ...s, isVideoFeatureEnabled: nextVal } : null);
        const res = await fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isVideoFeatureEnabled: nextVal })
        });
        if (res.ok) {
            showToast(nextVal ? 'Video Beta er aktivert!' : 'Video Beta er deaktivert.');
        } else {
            showToast('Kunne ikke oppdatere innstillinger.');
            setSettings(s => s ? { ...s, isVideoFeatureEnabled: !nextVal } : null); // Revert
        }
    };

    const handleApprove = async (id: string, status: 'published' | 'rejected' | 'pending') => {
        setApproving(`${contentType}-${id}`);
        const endpoint = contentType === 'articles' ? '/api/posts' : '/api/videos';
        const res = await fetch(endpoint, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        setApproving(null);
        if (res.ok) { showToast(status === 'published' ? '✅ Godkjent og publisert!' : status === 'rejected' ? '❌ Avvist.' : 'Gjenopprettet til vurdering.'); fetchPosts(); }
        else showToast('Feil ved oppdatering.');
    };

    const handleDelete = async (id: string) => {
        const endpoint = contentType === 'articles' ? '/api/posts' : '/api/videos';
        const res = await fetch(endpoint, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        if (res.ok) { showToast('Slettet.'); setConfirm(null); fetchPosts(); }
        else showToast('Feil ved sletting.');
    };

    const startEdit = (p: Post) => {
        setEditId(p.id);
        setEditData({ title: p.title, subtitle: p.subtitle || '', content: p.content, category: p.category });
    };

    const saveEdit = async () => {
        if (!editId) return;
        setSaving(true);
        const res = await fetch('/api/posts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editId, ...editData }) });
        setSaving(false);
        if (res.ok) { showToast('Lagret!'); setEditId(null); fetchPosts(); }
        else showToast('Feil ved lagring.');
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-ink-300" /></div>;

    if (!user?.isAdmin) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center px-4">
            <X className="w-5 h-5" />
            <h1 className="font-display text-2xl font-bold text-ink">Ingen tilgang</h1>
            <p className="text-ink-400 text-sm">Kun administratorer kan se denne siden.</p>
            <Link href="/" className="mt-2 text-fjord text-sm hover:underline">← Tilbake til forsiden</Link>
        </div>
    );

    const currentItems = contentType === 'articles' ? posts : videos;
    const pending = currentItems.filter(p => p.status === 'pending');
    const published = currentItems.filter(p => p.status === 'published');
    const rejected = currentItems.filter(p => p.status === 'rejected');
    const pendingReports = reports.filter(r => r.status === 'pending');
    const shown = tab === 'pending' ? pending : tab === 'published' ? published : rejected;

    return (
        <div className="min-h-screen bg-sand px-4 sm:px-8 py-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-ink mb-3 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Forsiden
                        </Link>
                        <h1 className="font-display text-3xl font-bold text-ink flex items-center gap-2">
                            Admin panel
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-sans font-semibold">ADMIN</span>
                        </h1>
                    </div>
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                        {user.name[0].toUpperCase()}
                    </div>
                </div>

                {/* Content Type Toggle */}
                {settings?.isVideoFeatureEnabled && (
                    <div className="flex gap-2 mb-6 p-1 bg-sand-dark/20 rounded-2xl w-fit border border-sand-dark/10">
                        <button onClick={() => setContentType('articles')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'articles' ? 'bg-white text-ink shadow-sm' : 'text-ink-500 hover:text-ink'}`}>📝 Artikler</button>
                        <button onClick={() => setContentType('videos')} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'videos' ? 'bg-indigo-600 text-white shadow-sm' : 'text-ink-500 hover:text-ink'}`}>🎬 Videoer</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => setTab('pending')}
                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'pending' ? 'text-white shadow-sm' : 'bg-white border border-sand-dark/40 text-ink-400 hover:text-ink'}`}
                        style={tab === 'pending' ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                        <PenLine className="w-3.5 h-3.5" />
                        Til godkjenning
                        {pending.length > 0 && (
                            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none ${tab === 'pending' ? 'bg-white/25 text-white' : 'bg-red-500 text-white'}`}>{pending.length}</span>
                        )}
                    </button>
                    <button onClick={() => setTab('published')}
                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'published' ? 'text-white shadow-sm' : 'bg-white border border-sand-dark/40 text-ink-400 hover:text-ink'}`}
                        style={tab === 'published' ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                        <Check className="w-5 h-5" />
                        Publiserte
                        <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none ${tab === 'published' ? 'bg-white/25 text-white' : 'bg-sand-dark/60 text-ink-400'}`}>{published.length}</span>
                    </button>
                    <button onClick={() => setTab('rejected')}
                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'rejected' ? 'text-white shadow-sm' : 'bg-white border border-sand-dark/40 text-ink-400 hover:text-ink'}`}
                        style={tab === 'rejected' ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                        <X className="w-5 h-5" />
                        Avviste
                        <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none ${tab === 'rejected' ? 'bg-white/25 text-white' : 'bg-red-500/20 text-red-600'}`}>{rejected.length}</span>
                    </button>
                    <button onClick={() => setTab('reports')}
                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'reports' ? 'text-white shadow-sm' : 'bg-white border border-sand-dark/40 text-ink-400 hover:text-ink'}`}
                        style={tab === 'reports' ? { background: 'linear-gradient(135deg,#DC2626,#991B1B)' } : {}}>
                        <span className="text-base leading-none">🚩</span>
                        Varsler & Klager
                        {pendingReports.length > 0 && (
                            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none ${tab === 'reports' ? 'bg-white/25 text-white' : 'bg-red-600 text-white animate-pulse'}`}>{pendingReports.length}</span>
                        )}
                    </button>
                    <button onClick={() => setTab('settings')}
                        className={`ml-auto flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'settings' ? 'text-white shadow-sm' : 'bg-white border border-sand-dark/40 text-ink-400 hover:text-ink'}`}
                        style={tab === 'settings' ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                        <span className="text-base leading-none">⚙️</span>
                        Innstillinger
                    </button>
                </div>

                {/* Pending notice */}
                {tab === 'pending' && pending.length > 0 && (
                    <div className="mb-4 px-4 py-3 rounded-2xl border border-amber-200 bg-amber-50 text-sm text-amber-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Disse innleggene venter på din godkjenning før de publiseres.</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-ink-300" /></div>
                ) : tab === 'settings' ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-sand-dark/40 p-8" style={{ boxShadow: '0 4px 24px rgba(26,22,18,0.04)' }}>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                    <span className="text-2xl leading-none">🎬</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-display font-bold text-lg text-ink">Video & Reels</h3>
                                    <p className="text-sm text-ink-400 mt-1 max-w-[60ch]">
                                        Aktiver den nye videofunksjonen som lar brukere sende inn og se korte debatt-videoer. Dette oppretter en ny fil-struktur og et eget "/videoer" feed-område for hele plattformen.
                                    </p>
                                </div>
                                <div className="shrink-0 pt-1 flex items-center gap-3">
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200 uppercase tracking-widest">Beta</span>
                                    <button
                                        onClick={toggleVideoFeature}
                                        className={`relative w-14 h-8 rounded-full transition-colors flex items-center px-1 ${settings?.isVideoFeatureEnabled ? 'bg-indigo-500' : 'bg-sand-dark/50'}`}
                                    >
                                        <motion.div
                                            initial={false}
                                            animate={{ x: settings?.isVideoFeatureEnabled ? 24 : 0 }}
                                            className="w-6 h-6 bg-white rounded-full shadow-sm"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : tab === 'reports' ? (
                    <AdminReportsModule reports={reports} onRefresh={fetchPosts} showToast={showToast} />
                ) : shown.length === 0 ? (
                    <div className="text-center py-20 text-ink-300">
                        <p className="text-4xl mb-3">{tab === 'pending' ? '✅' : tab === 'published' ? '📭' : '🗑️'}</p>
                        <p className="text-sm">{tab === 'pending' ? 'Ingen innlegg venter på godkjenning.' : tab === 'published' ? 'Ingen publiserte innlegg.' : 'Ingen avviste innlegg.'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shown.map(p => (
                            <motion.div key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-sand-dark/40 overflow-hidden"
                                style={{ boxShadow: '0 2px 12px rgba(26,22,18,0.06)' }}>

                                {editId === p.id && contentType === 'articles' ? (
                                    <div className="p-5 space-y-3">
                                        <input value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                                            className="input-nordic w-full text-sm font-semibold" placeholder="Tittel" />
                                        <input value={editData.subtitle} onChange={e => setEditData(d => ({ ...d, subtitle: e.target.value }))}
                                            className="input-nordic w-full text-sm" placeholder="Ingress" />
                                        <select value={editData.category} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
                                            className="input-nordic w-full text-sm">
                                            {Object.entries(CATEGORY_LABEL).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                                        </select>
                                        <textarea value={editData.content} onChange={e => setEditData(d => ({ ...d, content: e.target.value }))}
                                            rows={8} className="input-nordic w-full text-sm resize-none" />
                                        <div className="flex gap-2 pt-1">
                                            <button onClick={saveEdit} disabled={saving}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                                                style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Lagre
                                            </button>
                                            <button onClick={() => setEditId(null)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand-dark/60 text-sm text-ink-400 hover:text-ink">
                                                <X className="w-3.5 h-3.5" /> Avbryt
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-5">
                                        <div className="flex items-start gap-4">
                                            {contentType === 'videos' && (
                                                <div className="w-16 h-24 sm:w-24 sm:h-32 bg-ink rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm border border-sand-dark/30">
                                                    <span className="text-2xl opacity-50 absolute">🎬</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    {contentType === 'articles' && (
                                                        <>
                                                            <span className="text-xs font-medium text-ink-300">{CATEGORY_LABEL[p.category]}</span>
                                                            <span className="text-xs text-ink-200">·</span>
                                                        </>
                                                    )}
                                                    <span className="text-xs font-semibold text-fjord-dark">{p.authorName}</span>
                                                    <span className="text-xs text-ink-200">·</span>
                                                    <span className="text-xs text-ink-300">{new Date(p.createdAt).toLocaleDateString('nb-NO')}</span>
                                                    {p.status === 'published' && <span className="ml-auto text-xs text-ink-300">{p.view_count} 👁</span>}
                                                </div>
                                                <h3 className="font-display font-bold text-ink text-base leading-snug">
                                                    {contentType === 'videos' ? (
                                                        <a href={p.videoUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                                                            {p.title} ↗
                                                        </a>
                                                    ) : p.title}
                                                </h3>
                                                {contentType === 'articles' && p.subtitle && <p className="text-xs text-ink-400 mt-0.5">{p.subtitle}</p>}
                                                <p className="text-xs text-ink-300 mt-2 line-clamp-2">
                                                    {contentType === 'articles' ? p.content.slice(0, 160) + '…' : p.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-1 shrink-0 items-end">
                                                {contentType === 'articles' && (
                                                    <button onClick={() => startEdit(p)}
                                                        className="p-2 rounded-xl text-ink-300 hover:text-fjord hover:bg-fjord/5 border border-transparent hover:border-fjord/20 transition-colors">
                                                        <PenLine className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => setConfirm(p.id)}
                                                    className="p-2 rounded-xl text-ink-300 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Approve/Reject actions for pending */}
                                        {p.status === 'pending' && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-sand-dark/20 flex-wrap">
                                                {contentType === 'articles' ? (
                                                    <Link href={`/admin/posts/${p.id}`}
                                                        className="flex-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-fjord text-white text-sm font-semibold transition-all hover:brightness-110">
                                                        <Eye className="w-4 h-4" /> Les og Vurder
                                                    </Link>
                                                ) : (
                                                    <a href={p.videoUrl} target="_blank" rel="noreferrer"
                                                        className="flex-auto flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold transition-all hover:brightness-110">
                                                        <Eye className="w-4 h-4" /> Se Video Url (Ny fane)
                                                    </a>
                                                )}
                                                <button onClick={() => handleApprove(p.id, 'published')} disabled={approving === `${contentType}-${p.id}`}
                                                    className="flex-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-green-200 text-green-600 text-sm font-semibold hover:bg-green-50 transition-all disabled:opacity-60"
                                                >
                                                    {approving === `${contentType}-${p.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    Godkjenn
                                                </button>
                                                <button onClick={() => handleApprove(p.id, 'rejected')} disabled={approving === `${contentType}-${p.id}`}
                                                    className="flex-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-60">
                                                    <X className="w-4 h-4" /> Avvis
                                                </button>
                                            </div>
                                        )}

                                        {/* Restore actions for rejected */}
                                        {p.status === 'rejected' && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-sand-dark/20 flex-wrap">
                                                <button onClick={() => handleApprove(p.id, 'pending')} disabled={approving === `${contentType}-${p.id}`}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-fjord text-white text-sm font-semibold transition-all hover:brightness-110">
                                                    {approving === `${contentType}-${p.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                                                    Gjenopprett til vurdering
                                                </button>
                                                <button onClick={() => handleApprove(p.id, 'published')} disabled={approving === `${contentType}-${p.id}`}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-green-200 text-green-600 text-sm font-semibold hover:bg-green-50 transition-all disabled:opacity-60"
                                                >
                                                    {approving === `${contentType}-${p.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    Godkjenn og publiser
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <AnimatePresence>
                                    {confirm === p.id && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-red-100 bg-red-50 px-5 py-3 flex items-center justify-between">
                                            <p className="text-sm text-red-700 font-medium">Slett dette innlegget permanent?</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600">Slett</button>
                                                <button onClick={() => setConfirm(null)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs hover:bg-red-100">Avbryt</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl bg-ink text-white text-sm font-medium shadow-xl">
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
