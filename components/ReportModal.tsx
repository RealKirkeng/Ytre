'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { REPORT_CATEGORIES, ReportCategory } from '@/lib/report-categories';
import { useAuth } from '@/hooks/useAuth';

const ShieldAlertIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
);

const CheckCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const AlertTriangleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
);

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        id: string;
        title: string;
        slug: string;
        authorName?: string;
    };
}

export function ReportModal({ isOpen, onClose, post }: ReportModalProps) {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [reporterEmail, setReporterEmail] = useState<string>(user?.email || '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ reportId: string; message: string } | null>(null);

    const resetForm = () => {
        setSelectedCategory(null);
        setSelectedSubCategory('');
        setDetails('');
        setError(null);
        setSuccessData(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedCategory) {
            setError('Vennligst velg en kategori for varselet.');
            return;
        }

        if (!selectedSubCategory) {
            setError('Vennligst velg en dypere begrunnelse innenfor den valgte kategorien.');
            return;
        }

        if (!details.trim() || details.trim().length < 8) {
            setError('Vennligst utdyp hva i innholdet som du mener er ulovlig (minst 8 tegn).');
            return;
        }

        if (reporterEmail && !reporterEmail.includes('@')) {
            setError('Vennligst oppgi en gyldig e-postadresse dersom du fyller ut feltet.');
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId: post.id,
                    postTitle: post.title,
                    postSlug: post.slug,
                    postAuthorName: post.authorName,
                    category: selectedCategory.id,
                    categoryLabel: `${selectedCategory.icon} ${selectedCategory.label}`,
                    subCategory: selectedSubCategory,
                    details: details.trim(),
                    reporterEmail: reporterEmail.trim() || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Noe gikk galt under innsending.');
            }

            setSuccessData({
                reportId: data.reportId,
                message: data.message,
            });
        } catch (err: any) {
            setError(err.message || 'Kunne ikke sende varselet. Prøv igjen senere.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sand-dark/40 overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-sand-dark/20 flex items-center justify-between bg-sand/30">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-xs shrink-0">
                                <ShieldAlertIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-lg text-ink leading-tight">
                                    Varsle om ulovlig innhold
                                </h3>
                                <p className="text-xs text-ink-300">
                                    Notice & Takedown i henhold til e-handelsloven § 18
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-full bg-sand hover:bg-sand-dark/40 flex items-center justify-center text-ink-400 hover:text-ink transition-colors"
                            aria-label="Lukk"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Scrollable */}
                    <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                        {successData ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6 sm:py-8 space-y-4"
                            >
                                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-xs">
                                    <CheckCircleIcon className="w-8 h-8" />
                                </div>
                                <h4 className="font-display text-xl font-bold text-ink">
                                    Varselet er mottatt
                                </h4>
                                <p className="text-sm text-ink-400 max-w-md mx-auto leading-relaxed">
                                    Takk for at du bidrar til et trygt og lovlig debattklima. Varselet er registrert med saksnummer <span className="font-mono font-semibold text-fjord">{successData.reportId}</span> og sendt direkte til moderasjonsteamet for manuell vurdering.
                                </p>
                                <div className="p-4 bg-sand/60 rounded-2xl text-xs text-ink-400 text-left border border-sand-dark/20 max-w-md mx-auto space-y-1">
                                    <p className="font-semibold text-ink">Hva skjer videre?</p>
                                    <p>• Innholdet vurderes i henhold til norsk lov og Ytres publiseringsregler.</p>
                                    <p>• Ved konstatert lovbrudd avpubliseres innlegget uten ugrunnet opphold.</p>
                                    {reporterEmail && <p>• Tilbakemelding sendes til {reporterEmail} ved behov.</p>}
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2.5 rounded-2xl bg-fjord text-white font-semibold text-sm hover:bg-fjord-dark transition-all shadow-sm"
                                    >
                                        Lukk vindu
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Reported article card */}
                                <div className="p-3.5 bg-sand/50 rounded-2xl border border-sand-dark/30 flex items-start gap-3">
                                    <div className="text-lg">📄</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-semibold text-ink-300 uppercase tracking-wider">
                                            Innlegg som varsles
                                        </p>
                                        <p className="text-sm font-bold text-ink truncate mt-0.5">
                                            {post.title}
                                        </p>
                                        <p className="text-xs text-ink-400">
                                            av {post.authorName || 'Anonym forfatter'}
                                        </p>
                                    </div>
                                </div>

                                {/* Step 1: Main Category Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">
                                        1. Velg hovedkategori for varselet
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {REPORT_CATEGORIES.map((cat) => {
                                            const isSelected = selectedCategory?.id === cat.id;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setSelectedSubCategory('');
                                                    }}
                                                    className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                                                        isSelected
                                                            ? 'border-fjord bg-fjord/5 shadow-xs ring-1 ring-fjord'
                                                            : 'border-sand-dark/40 bg-white hover:bg-sand/30 hover:border-sand-dark/80'
                                                    }`}
                                                >
                                                    <span className="text-xl leading-none shrink-0 mt-0.5">{cat.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-fjord' : 'text-ink'}`}>
                                                            {cat.label}
                                                        </p>
                                                        <p className="text-[11px] text-ink-400 mt-1 line-clamp-2 leading-snug">
                                                            {cat.description}
                                                        </p>
                                                        {cat.legalRef && (
                                                            <span className="inline-block mt-1 text-[10px] font-semibold text-fjord bg-fjord/10 px-1.5 py-0.5 rounded">
                                                                {cat.legalRef}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Step 2: Deeper Justification (Sub-category) */}
                                {selectedCategory && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-2 p-4 bg-sand/30 rounded-2xl border border-sand-dark/30"
                                    >
                                        <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider">
                                            2. Velg dypere begrunnelse for {selectedCategory.label}
                                        </label>
                                        <div className="space-y-1.5 mt-2">
                                            {selectedCategory.subCategories.map((sub) => {
                                                const isSubSelected = selectedSubCategory === sub.label;
                                                return (
                                                    <label
                                                        key={sub.id}
                                                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                                            isSubSelected
                                                                ? 'bg-white border-fjord text-fjord shadow-xs ring-1 ring-fjord/30 font-semibold'
                                                                : 'bg-white/60 border-sand-dark/30 text-ink hover:bg-white'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="subCategory"
                                                            checked={isSubSelected}
                                                            onChange={() => setSelectedSubCategory(sub.label)}
                                                            className="text-fjord focus:ring-fjord w-4 h-4"
                                                        />
                                                        <span className="text-xs leading-snug">{sub.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Textarea for Details */}
                                <div>
                                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">
                                        3. Hva mener du er ulovlig? (Utdypende forklaring)
                                    </label>
                                    <textarea
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        rows={4}
                                        placeholder="Pek gjerne på konkrete avsnitt, sitater eller forklaring på hvorfor dette er ulovlig eller i strid med retningslinjene..."
                                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-sand-dark/60 bg-white placeholder:text-ink-200 text-ink focus:outline-none focus:ring-2 focus:ring-fjord/30 focus:border-fjord transition-all"
                                    />
                                    <div className="flex justify-between items-center text-[11px] text-ink-300 mt-1">
                                        <span>Vær så konkret som mulig for raskere saksbehandling.</span>
                                        <span>{details.length} tegn</span>
                                    </div>
                                </div>

                                {/* Step 4: Optional Contact Information */}
                                <div>
                                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">
                                        4. E-postadresse for tilbakemelding (valgfritt)
                                    </label>
                                    <input
                                        type="email"
                                        value={reporterEmail}
                                        onChange={(e) => setReporterEmail(e.target.value)}
                                        placeholder="din.epost@eksempel.no"
                                        className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-sand-dark/60 bg-white placeholder:text-ink-200 text-ink focus:outline-none focus:ring-2 focus:ring-fjord/30 focus:border-fjord transition-all"
                                    />
                                    <p className="text-[11px] text-ink-300 mt-1">
                                        Vi kontakter deg kun dersom vi har oppfølgingsspørsmål om saken.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 flex items-center gap-2">
                                        <AlertTriangleIcon className="w-4 h-4 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Footer submit */}
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-sand-dark/20">
                                    <p className="text-[11px] text-ink-300 text-center sm:text-left">
                                        Ytre verner om ytringsfriheten innenfor rammene av norsk lov.
                                    </p>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="w-1/2 sm:w-auto px-4 py-2.5 rounded-2xl border border-sand-dark/60 text-xs font-semibold text-ink-400 hover:text-ink hover:bg-sand/50 transition-colors"
                                        >
                                            Avbryt
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-1/2 sm:w-auto px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    Sender...
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldAlertIcon className="w-3.5 h-3.5" />
                                                    Send inn varsel
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
