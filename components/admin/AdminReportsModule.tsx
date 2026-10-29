'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    ExternalLink,
    Mail,
    User,
    MessageSquare,
    ChevronDown,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';

const ShieldAlertIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
);

const AlertCircleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
);

const CheckCircleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const XCircleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" x2="9" y1="9" y2="15" />
        <line x1="9" x2="15" y1="9" y2="15" />
    </svg>
);

const TrashIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

const ChevronUpIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="18 15 12 9 6 15" />
    </svg>
);

const SearchIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

export interface ReportItem {
    id: string;
    postId: string;
    postTitle: string;
    postSlug: string;
    postAuthorName?: string;
    category: string;
    categoryLabel: string;
    subCategory: string;
    details: string;
    reporterEmail?: string;
    reporterName?: string;
    reporterUserId?: string;
    status: 'pending' | 'investigating' | 'action_taken' | 'dismissed';
    adminNote?: string;
    createdAt: string;
    updatedAt?: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

interface AdminReportsModuleProps {
    reports: ReportItem[];
    onRefresh: () => void;
    showToast: (msg: string) => void;
}

export function AdminReportsModule({ reports, onRefresh, showToast }: AdminReportsModuleProps) {
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'investigating' | 'action_taken' | 'dismissed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
    const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

    const filtered = reports.filter((r) => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                r.postTitle.toLowerCase().includes(q) ||
                r.details.toLowerCase().includes(q) ||
                r.subCategory.toLowerCase().includes(q) ||
                r.categoryLabel.toLowerCase().includes(q) ||
                (r.reporterEmail && r.reporterEmail.toLowerCase().includes(q))
            );
        }
        return true;
    });

    const pendingCount = reports.filter((r) => r.status === 'pending').length;
    const investigatingCount = reports.filter((r) => r.status === 'investigating').length;
    const actionTakenCount = reports.filter((r) => r.status === 'action_taken').length;
    const dismissedCount = reports.filter((r) => r.status === 'dismissed').length;

    const handleUpdateStatus = async (
        id: string,
        status: ReportItem['status'],
        options?: { takeDownPost?: boolean; postId?: string }
    ) => {
        setUpdatingId(id);
        try {
            const currentNote = notesDraft[id] ?? reports.find((r) => r.id === id)?.adminNote ?? '';
            const res = await fetch('/api/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    status,
                    adminNote: currentNote,
                    takeDownPost: options?.takeDownPost,
                    postId: options?.postId,
                }),
            });

            if (res.ok) {
                if (options?.takeDownPost) {
                    showToast('🚨 Innlegget er avpublisert, og saken er merket som håndtert!');
                } else if (status === 'action_taken') {
                    showToast('✅ Saken er merket som håndtert.');
                } else if (status === 'dismissed') {
                    showToast('Avvist som ubegrunnet.');
                } else if (status === 'investigating') {
                    showToast('Saken er satt under undersøkelse.');
                } else {
                    showToast('Status oppdatert.');
                }
                onRefresh();
            } else {
                const data = await res.json();
                showToast(data.error || 'Kunne ikke oppdatere status.');
            }
        } catch {
            showToast('Nettverksfeil ved oppdatering.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSaveNote = async (id: string) => {
        setUpdatingId(id);
        try {
            const note = notesDraft[id] ?? '';
            const res = await fetch('/api/reports', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    adminNote: note,
                }),
            });

            if (res.ok) {
                showToast('📝 Admin-notat lagret.');
                onRefresh();
            } else {
                showToast('Kunne ikke lagre notat.');
            }
        } catch {
            showToast('Nettverksfeil ved lagring av notat.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (typeof window !== 'undefined' && !window.confirm('Er du sikker på at du vil slette dette varselet fra arkivet?')) return;
        setUpdatingId(id);
        try {
            const res = await fetch('/api/reports', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                showToast('Varsel slettet.');
                onRefresh();
            } else {
                showToast('Kunne ikke slette varselet.');
            }
        } catch {
            showToast('Feil ved sletting.');
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDateTime = (iso: string) => {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString('nb-NO', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header intro & Legal notice */}
            <div className="bg-white rounded-3xl border border-sand-dark/40 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                            <ShieldAlertIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-display text-xl font-bold text-ink">
                                Håndtering av varsler om ulovlig innhold
                            </h2>
                            <p className="text-xs text-ink-400 mt-1 max-w-[65ch] leading-relaxed">
                                I henhold til e-handelsloven § 18 forplikter Ytre seg til å handle uten ugrunnet opphold for å fjerne eller sperre tilgangen til innhold dersom det mottas varsel om ulovlige forhold (f.eks. Straffeloven § 185, trusler eller opphavsrettskrenkelser).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-sand-dark/20">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            statusFilter === 'all'
                                ? 'bg-ink text-white shadow-xs'
                                : 'bg-sand hover:bg-sand-dark/40 text-ink-500'
                        }`}
                    >
                        Alle ({reports.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            statusFilter === 'pending'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        Ubehandlet ({pendingCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('investigating')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            statusFilter === 'investigating'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
                        }`}
                    >
                        <AlertCircleIcon className="w-3.5 h-3.5" />
                        Under undersøkelse ({investigatingCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('action_taken')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            statusFilter === 'action_taken'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                        }`}
                    >
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        Tiltak utført / Fjernet ({actionTakenCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('dismissed')}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            statusFilter === 'dismissed'
                                ? 'bg-ink-400 text-white shadow-xs'
                                : 'bg-sand hover:bg-sand-dark/40 text-ink-400'
                        }`}
                    >
                        <XCircleIcon className="w-3.5 h-3.5" />
                        Avvist ({dismissedCount})
                    </button>
                </div>

                {/* Search query input */}
                <div className="mt-4 relative">
                    <SearchIcon className="w-4 h-4 text-ink-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Søk i varsler på tittel, begrunnelse eller e-post..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-dark/40 bg-sand/30 text-xs sm:text-sm text-ink placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-fjord/30 focus:border-fjord"
                    />
                </div>
            </div>

            {/* Reports List */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-sand-dark/40 p-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-sand mx-auto flex items-center justify-center text-ink-300 mb-3">
                        <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-ink">Ingen varsler i denne visningen</h3>
                    <p className="text-xs text-ink-400 mt-1">
                        {statusFilter === 'pending'
                            ? 'Det er for øyeblikket ingen ubehandlede varsler i køen. Alt er i orden!'
                            : 'Prøv å endre filter eller søkeord for å finne eldre varsler.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((report) => {
                        const isUpdating = updatingId === report.id;
                        const isExpanded = expandedNotes[report.id];
                        const noteText = notesDraft[report.id] ?? report.adminNote ?? '';

                        return (
                            <motion.div
                                key={report.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white rounded-3xl border p-5 sm:p-7 transition-all shadow-xs ${
                                    report.status === 'pending'
                                        ? 'border-amber-300/80 ring-1 ring-amber-200'
                                        : report.status === 'investigating'
                                        ? 'border-blue-300/80'
                                        : 'border-sand-dark/40'
                                }`}
                            >
                                {/* Top Bar: Badge, Status, Date */}
                                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-sand-dark/20">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sand/80 text-ink border border-sand-dark/30">
                                            {report.categoryLabel}
                                        </span>
                                        <span className="text-xs text-ink-400 font-medium bg-sand/40 px-2.5 py-1 rounded-full">
                                            {report.subCategory}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Status Pill */}
                                        {report.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                <Clock className="w-3.5 h-3.5" /> Ubehandlet
                                            </span>
                                        )}
                                        {report.status === 'investigating' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                <AlertCircleIcon className="w-3.5 h-3.5" /> Under undersøkelse
                                            </span>
                                        )}
                                        {report.status === 'action_taken' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <CheckCircleIcon className="w-3.5 h-3.5" /> Tiltak utført
                                            </span>
                                        )}
                                        {report.status === 'dismissed' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sand text-ink-400 border border-sand-dark/30">
                                                <XCircleIcon className="w-3.5 h-3.5" /> Avvist
                                            </span>
                                        )}

                                        <span className="text-[11px] text-ink-300">
                                            {formatDateTime(report.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Reported Post Details */}
                                <div className="mt-4 space-y-3">
                                    <div>
                                        <span className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">
                                            Gjelder innlegg
                                        </span>
                                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                            <h4 className="font-display font-bold text-base sm:text-lg text-ink">
                                                {report.postTitle}
                                            </h4>
                                            <Link
                                                href={`/posts/${report.postSlug}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 text-xs text-fjord hover:underline font-semibold bg-fjord/10 px-2 py-0.5 rounded-lg"
                                            >
                                                <span>Åpne artikkel</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                            <Link
                                                href={`/admin/posts/${report.postId}`}
                                                className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink font-semibold bg-sand px-2 py-0.5 rounded-lg hover:bg-sand-dark/40"
                                            >
                                                <span>Admin-visning</span>
                                            </Link>
                                        </div>
                                        <p className="text-xs text-ink-400 mt-0.5">
                                            Forfatter: <span className="font-semibold text-ink-500">{report.postAuthorName || 'Anonym'}</span>
                                        </p>
                                    </div>

                                    {/* Complainant's Submitted Explanation */}
                                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-ink-500 leading-relaxed">
                                        <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-sm">⚠️</span>
                                                Varslerens forklaring:
                                            </span>
                                            {report.reporterEmail ? (
                                                <a
                                                    href={`mailto:${report.reporterEmail}?subject=Vedrørende varsel om innlegget: ${encodeURIComponent(report.postTitle)}`}
                                                    className="inline-flex items-center gap-1 text-fjord hover:underline font-normal normal-case"
                                                >
                                                    <Mail className="w-3 h-3" />
                                                    <span>{report.reporterEmail}</span>
                                                </a>
                                            ) : (
                                                <span className="text-ink-300 font-normal normal-case">Anonym varsler</span>
                                            )}
                                        </div>
                                        <p className="italic whitespace-pre-line font-sans text-ink">
                                            «{report.details}»
                                        </p>
                                    </div>

                                    {/* Resolution Info if already handled */}
                                    {report.resolvedAt && (
                                        <div className="text-[11px] text-ink-300 flex flex-wrap gap-x-3 gap-y-1 bg-sand/30 p-2.5 rounded-xl border border-sand-dark/20">
                                            <span>Behandlet: {formatDateTime(report.resolvedAt)}</span>
                                            {report.resolvedBy && <span>av {report.resolvedBy}</span>}
                                        </div>
                                    )}

                                    {/* Admin Internal Notes section */}
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedNotes((prev) => ({ ...prev, [report.id]: !prev[report.id] }))}
                                            className="text-xs font-semibold text-ink-400 hover:text-ink flex items-center gap-1 transition-colors"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>Internt admin-notat / saksbegrunnelse</span>
                                            {report.adminNote && (
                                                <span className="w-2 h-2 rounded-full bg-fjord inline-block ml-0.5" />
                                            )}
                                            {isExpanded ? (
                                                <ChevronUpIcon className="w-3.5 h-3.5 ml-0.5" />
                                            ) : (
                                                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="mt-2 space-y-2 p-3 bg-sand/40 rounded-2xl border border-sand-dark/30">
                                                <textarea
                                                    value={noteText}
                                                    onChange={(e) =>
                                                        setNotesDraft((prev) => ({ ...prev, [report.id]: e.target.value }))
                                                    }
                                                    rows={2}
                                                    placeholder="Skriv inn notat om vurdering av saken (f.eks. hensyn til Straffeloven § 185 vs. § 100, eller dialog med skribent)..."
                                                    className="w-full text-xs p-2.5 rounded-xl border border-sand-dark/50 bg-white placeholder:text-ink-200 text-ink focus:outline-none focus:ring-2 focus:ring-fjord/30"
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveNote(report.id)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1.5 bg-ink text-white rounded-xl text-xs font-semibold hover:bg-ink-500 transition-colors disabled:opacity-50"
                                                    >
                                                        Lagre notat
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Toolbar */}
                                <div className="mt-5 pt-4 border-t border-sand-dark/20 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* High Priority Emergency Action: Take down post */}
                                        <button
                                            type="button"
                                            disabled={isUpdating}
                                            onClick={() =>
                                                handleUpdateStatus(report.id, 'action_taken', {
                                                    takeDownPost: true,
                                                    postId: report.postId,
                                                })
                                            }
                                            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                                            title="Fjerner innlegget umiddelbart fra forsiden og feeden"
                                        >
                                            <ShieldAlertIcon className="w-3.5 h-3.5" />
                                            <span>🚨 Avpubliser innlegg</span>
                                        </button>

                                        {/* Mark under investigation */}
                                        {report.status !== 'investigating' && (
                                            <button
                                                type="button"
                                                disabled={isUpdating}
                                                onClick={() => handleUpdateStatus(report.id, 'investigating')}
                                                className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                                🔍 Sett under undersøkelse
                                            </button>
                                        )}

                                        {/* Mark as resolved / action taken */}
                                        {report.status !== 'action_taken' && (
                                            <button
                                                type="button"
                                                disabled={isUpdating}
                                                onClick={() => handleUpdateStatus(report.id, 'action_taken')}
                                                className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                                ✅ Marker som håndtert
                                            </button>
                                        )}

                                        {/* Dismiss report */}
                                        {report.status !== 'dismissed' && (
                                            <button
                                                type="button"
                                                disabled={isUpdating}
                                                onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                                                className="px-3 py-2 rounded-xl bg-sand hover:bg-sand-dark/40 text-ink-500 text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                                ❌ Avvis klage (Lovlig)
                                            </button>
                                        )}
                                    </div>

                                    {/* Delete / Archive report */}
                                    <button
                                        type="button"
                                        disabled={isUpdating}
                                        onClick={() => handleDelete(report.id)}
                                        className="p-2 text-ink-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-auto"
                                        title="Slett varsel fra arkiv"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
