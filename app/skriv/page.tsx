'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Eye, ArrowLeft, Loader2, ImagePlus, X, Bold, Italic, Heading2, Quote, ChevronDown, Map, Users, Tag, BookOpen, Link2, Clock, Check, UserPlus, AlignLeft, AlignCenter, AlignRight, Maximize2, ImageIcon } from 'lucide-react';
import { NorwayMap, GeoFeature, GeoMode } from '@/components/NorwayMap';
import { ArticleInlineImage } from '@/components/ArticleInlineImage';
import { useAuth } from '@/hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GeoRegion { level: GeoMode; id: string; name: string; }

const CATEGORIES = [
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

const AUDIENCES = [
    { id: 'everyone', label: '👥 Alle' },
    { id: 'students', label: '🎓 Studenter & elever' },
    { id: 'parents', label: '👨‍👩‍👧 Foreldre' },
    { id: 'politicians', label: '🏛️ Politikere' },
    { id: 'professionals', label: '💼 Fagfolk' },
    { id: 'youth', label: '🌟 Ungdom 13–18' },
    { id: 'local', label: '📍 Lokalbefolkning' },
];

const PERSPECTIVES = [
    '🟢 For', '🔴 Mot', '⚖️ Nøytral analyse', '🔵 Personlig erfaring',
    '🟡 Kritisk', '🟣 Visjonær', '🟠 Løsningsorientert',
];

const READING_LEVELS = [
    { id: 'simple', label: '☀️ Enkel – alle kan lese' },
    { id: 'medium', label: '📖 Middels – krever litt kunnskap' },
    { id: 'advanced', label: '🎓 Avansert – faglig dybde' },
];

const ORGANIZATION_LEVELS = [
    { id: 'political_party', label: '🗳️ Politisk parti' },
    { id: 'union', label: '🤝 Fagforening' },
    { id: 'interest_group', label: '📣 Interesseorganisasjon' },
    { id: 'business', label: '💼 Næringsliv' },
    { id: 'ethnic_group', label: '🌍 Folkegruppe / Minoritet' },
    { id: 'media', label: '📰 Media' },
    { id: 'other', label: '📌 Annet' },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error';
function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${type === 'success' ? 'bg-green-600' : 'bg-red-500'} text-white`}
        >
            {type === 'success' ? '✅' : '❌'} {message}
            <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-1"><X className="w-4 h-4" /></button>
        </motion.div>
    );
}

// ─── Dropdown Panel ────────────────────────────────────────────────────────────
function DropdownPanel({
    icon: Icon, label, badge, color = 'fjord', children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badge?: string | number;
    color?: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${open || badge
                    ? 'border-fjord/50 bg-fjord/8 text-fjord-dark'
                    : 'border-sand-dark/50 text-ink-400 hover:text-ink hover:border-fjord/30 bg-white'
                    }`}
            >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                {badge ? (
                    <span className="bg-fjord text-white text-xs rounded-full px-1.5 py-0.5 leading-none font-bold">{badge}</span>
                ) : (
                    <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
                )}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-full mt-1.5 left-0 z-50 min-w-[260px] xs:min-w-[280px] max-w-[calc(100vw-2rem)] rounded-2xl border border-sand-dark/30 shadow-2xl overflow-hidden"
                        style={{ background: 'rgba(255,253,250,0.98)', backdropFilter: 'blur(20px)' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Map Dropdown ──────────────────────────────────────────────────────────────
function MapDropdown({ regions, setRegions }: {
    regions: GeoRegion[];
    setRegions: React.Dispatch<React.SetStateAction<GeoRegion[]>>;
}) {
    const [geoMode, setGeoMode] = useState<GeoMode>('fylke');
    const selectedIds = regions.filter(r => r.level === geoMode).map(r => r.id);

    const handleSelect = useCallback((f: GeoFeature) => {
        setRegions(prev => {
            const exists = prev.find(r => r.level === geoMode && r.id === f.id);
            return exists
                ? prev.filter(r => !(r.level === geoMode && r.id === f.id))
                : [...prev, { level: geoMode, id: f.id, name: f.name }];
        });
    }, [geoMode, setRegions]);

    return (
        <DropdownPanel icon={Map} label="Sted" badge={regions.length || undefined}>
            <div className="p-3 border-b border-sand-dark/20">
                <p className="text-xs font-semibold text-ink mb-2">📍 Geografisk rekkevidde</p>
                <p className="text-xs text-ink-300">Klikk på kartet for å velge område</p>
            </div>
            {/* Tabs */}
            <div className="flex gap-2 px-3 pt-2.5">
                {(['fylke', 'kommune'] as GeoMode[]).map(m => (
                    <button key={m} onClick={() => setGeoMode(m)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${geoMode === m ? 'text-white' : 'bg-sand text-ink-400 hover:text-ink'}`}
                        style={geoMode === m ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                        {m === 'fylke' ? 'Fylke' : 'Kommune'}
                    </button>
                ))}
            </div>
            {/* Map */}
            <div className="px-3 pb-1 pt-2 max-h-80 overflow-auto">
                <NorwayMap mode={geoMode} selected={selectedIds} onSelect={handleSelect} />
            </div>
            {/* Selected chips */}
            {regions.length > 0 && (
                <div className="px-3 py-2 border-t border-sand-dark/20 flex flex-wrap gap-1.5">
                    {regions.map(r => (
                        <span key={`${r.level}-${r.id}`}
                            className="inline-flex items-center gap-1 bg-fjord/10 text-fjord-dark text-xs font-medium px-2.5 py-1 rounded-full">
                            {r.name}
                            <button onClick={() => setRegions(p => p.filter(x => !(x.level === r.level && x.id === r.id)))}
                                className="hover:text-red-400 transition-colors"><X className="w-2.5 h-2.5" /></button>
                        </span>
                    ))}
                    <button onClick={() => setRegions([])} className="text-xs text-ink-300 hover:text-red-400 underline transition-colors ml-auto">Fjern alle</button>
                </div>
            )}
        </DropdownPanel>
    );
}

// ─── Audience Dropdown ────────────────────────────────────────────────────────
function AudienceDropdown({ audience, setAudience }: { audience: string[]; setAudience: (v: string[]) => void }) {
    const toggle = (id: string) =>
        setAudience(audience.includes(id) ? audience.filter(a => a !== id) : [...audience, id]);
    return (
        <DropdownPanel icon={Users} label="Målgruppe" badge={audience.length || undefined}>
            <div className="p-3 border-b border-sand-dark/20">
                <p className="text-xs font-semibold text-ink">👥 Hvem skriver du for?</p>
                <p className="text-xs text-ink-300 mt-0.5">Velg én eller flere målgrupper</p>
            </div>
            <div className="p-2 flex flex-col gap-0.5">
                {AUDIENCES.map(a => (
                    <button key={a.id} onClick={() => toggle(a.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-all ${audience.includes(a.id) ? 'bg-fjord/10 text-fjord-dark font-semibold' : 'text-ink-500 hover:bg-sand'
                            }`}>
                        <span className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${audience.includes(a.id) ? 'bg-fjord border-fjord' : 'border-sand-dark/60'
                            }`}>
                            {audience.includes(a.id) && <span className="text-white text-[8px] font-bold">✓</span>}
                        </span>
                        {a.label}
                    </button>
                ))}
            </div>
        </DropdownPanel>
    );
}

// ─── Angle Dropdown ───────────────────────────────────────────────────────────
function AngleDropdown({ angle, setAngle }: { angle: string; setAngle: (v: string) => void }) {
    return (
        <DropdownPanel icon={Tag} label={angle || 'Vinkel'} badge={angle ? '1' : undefined}>
            <div className="p-3 border-b border-sand-dark/20">
                <p className="text-xs font-semibold text-ink">🎯 Artikkelvinkel</p>
                <p className="text-xs text-ink-300 mt-0.5">Hva er din tilnærming til temaet?</p>
            </div>
            <div className="p-2 flex flex-col gap-0.5">
                {PERSPECTIVES.map(p => (
                    <button key={p} onClick={() => setAngle(angle === p ? '' : p)}
                        className={`px-3 py-2 rounded-xl text-sm text-left transition-all ${angle === p ? 'bg-fjord/10 text-fjord-dark font-semibold' : 'text-ink-500 hover:bg-sand'
                            }`}>{p}</button>
                ))}
            </div>
        </DropdownPanel>
    );
}

// ─── Reading Level Dropdown ───────────────────────────────────────────────────
function ReadingLevelDropdown({ level, setLevel }: { level: string; setLevel: (v: string) => void }) {
    return (
        <DropdownPanel icon={BookOpen} label={READING_LEVELS.find(r => r.id === level)?.label || 'Nivå'} badge={level ? '✓' : undefined}>
            <div className="p-3 border-b border-sand-dark/20">
                <p className="text-xs font-semibold text-ink">📖 Lesernivå</p>
                <p className="text-xs text-ink-300 mt-0.5">Tilpass teksten din til målgruppen</p>
            </div>
            <div className="p-2 flex flex-col gap-0.5">
                {READING_LEVELS.map(r => (
                    <button key={r.id} onClick={() => setLevel(level === r.id ? '' : r.id)}
                        className={`px-3 py-2 rounded-xl text-sm text-left transition-all ${level === r.id ? 'bg-fjord/10 text-fjord-dark font-semibold' : 'text-ink-500 hover:bg-sand'
                            }`}>{r.label}</button>
                ))}
            </div>
        </DropdownPanel>
    );
}

// ─── Sources Dropdown ─────────────────────────────────────────────────────────
function SourcesDropdown({ sources, setSources }: { sources: string[]; setSources: (v: string[]) => void }) {
    const [input, setInput] = useState('');
    const add = () => {
        const v = input.trim();
        if (!v || sources.includes(v)) return;
        setSources([...sources, v]);
        setInput('');
    };
    return (
        <DropdownPanel icon={Link2} label="Kilder" badge={sources.length || undefined}>
            <div className="p-3 border-b border-sand-dark/20">
                <p className="text-xs font-semibold text-ink">🔗 Kilder & referanser</p>
                <p className="text-xs text-ink-300 mt-0.5">Legg til lenker eller navnene på kildene dine</p>
            </div>
            <div className="p-3 flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && add()}
                        placeholder="URL eller kildenavn…"
                        className="flex-1 text-xs px-3 py-2 rounded-lg bg-sand border border-sand-dark/40 outline-none focus:border-fjord/50 text-ink"
                    />
                    <button onClick={add}
                        className="px-3 py-2 rounded-lg text-white text-xs font-semibold"
                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                        + Legg til
                    </button>
                </div>
                {sources.length > 0 && (
                    <div className="flex flex-col gap-1 max-h-32 overflow-auto">
                        {sources.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-ink-400 bg-sand px-2.5 py-1.5 rounded-lg">
                                <span className="flex-1 truncate">{s}</span>
                                <button onClick={() => setSources(sources.filter((_, j) => j !== i))}
                                    className="hover:text-red-400 transition-colors flex-shrink-0"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DropdownPanel>
    );
}

// ─── Organization Dropdown ───────────────────────────────────────────────────
function OrganizationDropdown({ organization, setOrganization, position, setPosition, orgLevel, setOrgLevel }: {
    organization: string; setOrganization: (v: string) => void;
    position: string; setPosition: (v: string) => void;
    orgLevel: string; setOrgLevel: (v: string) => void;
}) {
    return (
        <DropdownPanel icon={Users} label={organization || 'Organisasjon'} badge={organization ? '✓' : undefined}>
            <div className="p-3 border-b border-sand-dark/20 text-ink">
                <p className="text-xs font-semibold">🏢 Organisasjonstilknytning</p>
                <p className="text-xs text-ink-300 mt-0.5">Skriver du på vegne av en organisasjon?</p>
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1.5">Organisasjon</label>
                    <input
                        type="text"
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder="f.eks. Unge Høyre, LO Elev…"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-sand border border-sand-dark/40 outline-none focus:border-fjord/50 text-ink"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1.5">Din stilling / rolle</label>
                    <input
                        type="text"
                        value={position}
                        onChange={e => setPosition(e.target.value)}
                        placeholder="f.eks. Nestleder, Medlem…"
                        className="w-full text-xs px-3 py-2 rounded-lg bg-sand border border-sand-dark/40 outline-none focus:border-fjord/50 text-ink"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1.5">Type Organisasjon</label>
                    <select
                        value={orgLevel}
                        onChange={e => setOrgLevel(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg bg-sand border border-sand-dark/40 outline-none focus:border-fjord/50 text-ink appearance-none cursor-pointer"
                    >
                        <option value="">Ingen valgt (eller privatperson)</option>
                        {ORGANIZATION_LEVELS.map(ol => (
                            <option key={ol.id} value={ol.id}>{ol.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </DropdownPanel>
    );
}

// ─── Co-Authors Dropdown ───────────────────────────────────────────────────────
function CoAuthorsDropdown({ coAuthors, setCoAuthors }: { coAuthors: string[]; setCoAuthors: React.Dispatch<React.SetStateAction<string[]>> }) {
    const [name, setName] = useState('');
    const add = () => {
        const v = name.trim();
        if (!v || coAuthors.includes(v)) return;
        setCoAuthors(prev => [...prev, v]);
        setName('');
    };
    return (
        <DropdownPanel icon={UserPlus} label="Samarbeidspartnere" badge={coAuthors.length || undefined}>
            <div className="p-3 border-b border-sand-dark/20 text-ink">
                <p className="text-xs font-semibold">🤝 Samarbeidspartnere</p>
                <p className="text-xs text-ink-300 mt-0.5">Legg til medforfattere på innlegget</p>
            </div>
            <div className="p-3 space-y-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
                        placeholder="Navn på medforfatter…"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-sand-dark/50 text-xs bg-white text-ink placeholder-ink-300 outline-none focus:border-fjord"
                    />
                    <button
                        type="button"
                        onClick={add}
                        className="px-3 py-1.5 rounded-xl bg-fjord text-white text-xs font-semibold hover:bg-fjord-dark transition-colors"
                    >
                        Legg til
                    </button>
                </div>

                {coAuthors.length > 0 && (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {coAuthors.map((author, i) => (
                            <div key={i} className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-sand/60 border border-sand-dark/30 text-xs text-ink">
                                <span className="font-medium truncate">{author}</span>
                                <button
                                    type="button"
                                    onClick={() => setCoAuthors(prev => prev.filter((_, idx) => idx !== i))}
                                    className="text-ink-300 hover:text-red-500 transition-colors p-0.5"
                                    title="Fjern medforfatter"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-[11px] text-ink-400 italic">
                    {coAuthors.length > 0
                        ? `Vises som «Ditt Navn +${coAuthors.length}» i feeden, og «Av Ditt Navn og ${coAuthors.join(', ')}» i artikkelen.`
                        : 'Medforfattere krediteres i feeden og øverst i artikkelen.'}
                </p>
            </div>
        </DropdownPanel>
    );
}

// ─── Inline Image Insertion Modal ─────────────────────────────────────────────
function InlineImageModal({
    open,
    onClose,
    onInsert,
}: {
    open: boolean;
    onClose: () => void;
    onInsert: (data: { src: string; align: 'full' | 'left' | 'center' | 'right'; size: 'small' | 'medium' | 'large'; caption?: string; alt?: string }) => void;
}) {
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState('');
    const [align, setAlign] = useState<'full' | 'left' | 'center' | 'right'>('center');
    const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [caption, setCaption] = useState('');
    const [alt, setAlt] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const activeSrc = filePreview || urlInput.trim();

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            setFilePreview(ev.target?.result as string);
            setUrlInput('');
        };
        reader.readAsDataURL(file);
    };

    const handleInsert = () => {
        if (!activeSrc) return;
        onInsert({
            src: activeSrc,
            align,
            size,
            caption: caption.trim() || undefined,
            alt: alt.trim() || undefined,
        });
        setFilePreview(null);
        setUrlInput('');
        setCaption('');
        setAlt('');
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative bg-white rounded-3xl border border-sand-dark/40 shadow-2xl p-5 sm:p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 space-y-5"
            >
                <div className="flex items-center justify-between border-b border-sand-dark/20 pb-3">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-fjord" />
                        <h3 className="font-display text-lg font-bold text-ink">Sett inn bilde i artikkelen</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-sand text-ink-300 hover:text-ink">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Upload or URL */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider">Velg bilde</label>
                    {activeSrc ? (
                        <div className="relative rounded-2xl overflow-hidden border border-sand-dark/40 max-h-48 bg-sand/30 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={activeSrc} alt="Forhåndsvisning" className="w-full h-auto max-h-48 object-cover rounded-2xl" />
                            <button
                                type="button"
                                onClick={() => { setFilePreview(null); setUrlInput(''); if (fileRef.current) fileRef.current.value = ''; }}
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm text-ink transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="w-full py-6 rounded-2xl border-2 border-dashed border-sand-dark/60 flex flex-col items-center justify-center gap-1.5 text-ink-400 hover:text-fjord hover:border-fjord/40 hover:bg-sand/30 transition-all"
                            >
                                <ImagePlus className="w-6 h-6 text-fjord" />
                                <span className="text-sm font-semibold text-ink">Last opp bilde fra enheten</span>
                                <span className="text-xs text-ink-300">JPG, PNG, WebP — maks 5 MB</span>
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

                            <div className="relative text-center my-2">
                                <span className="text-[11px] uppercase tracking-widest text-ink-300 bg-white px-2">eller bilde-lenke</span>
                            </div>

                            <input
                                type="url"
                                value={urlInput}
                                onChange={e => { setUrlInput(e.target.value); setFilePreview(null); }}
                                placeholder="Lim inn bilde-URL (https://...)"
                                className="w-full px-3.5 py-2 rounded-xl border border-sand-dark/50 text-xs text-ink bg-sand/30 outline-none focus:border-fjord"
                            />
                        </div>
                    )}
                </div>

                {/* Justering */}
                <div>
                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Posisjonering</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                            { id: 'full' as const, label: 'Kant-til-kant', icon: Maximize2 },
                            { id: 'left' as const, label: 'Venstre', icon: AlignLeft },
                            { id: 'center' as const, label: 'Midtstilt', icon: AlignCenter },
                            { id: 'right' as const, label: 'Høyre', icon: AlignRight },
                        ].map(item => {
                            const Icon = item.icon;
                            const isSel = align === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setAlign(item.id)}
                                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-medium transition-all ${isSel
                                        ? 'bg-fjord/10 border-fjord text-fjord-dark font-bold shadow-2xs'
                                        : 'border-sand-dark/40 text-ink-400 hover:text-ink hover:bg-sand/40'}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Størrelse */}
                <div>
                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Størrelse</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'small' as const, label: 'Liten (ca 260px)' },
                            { id: 'medium' as const, label: 'Medium (ca 480px)' },
                            { id: 'large' as const, label: 'Stor (Full bredde)' },
                        ].map(item => {
                            const isSel = size === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSize(item.id)}
                                    className={`py-2 px-2 rounded-xl border text-xs font-medium text-center transition-all ${isSel
                                        ? 'bg-fjord/10 border-fjord text-fjord-dark font-bold shadow-2xs'
                                        : 'border-sand-dark/40 text-ink-400 hover:text-ink hover:bg-sand/40'}`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bildetekst */}
                <div>
                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Bildetekst (valgfritt)</label>
                    <input
                        type="text"
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="Liten tekst som vises under bildet…"
                        className="w-full px-3.5 py-2 rounded-xl border border-sand-dark/50 text-xs text-ink bg-white outline-none focus:border-fjord"
                    />
                </div>

                {/* Alt-tekst */}
                <div>
                    <label className="block text-xs font-bold text-ink-400 uppercase tracking-wider mb-1.5">Alt-tekst hvis bildet ikke laster (frivillig)</label>
                    <input
                        type="text"
                        value={alt}
                        onChange={e => setAlt(e.target.value)}
                        placeholder="Kort beskrivelse for tilgjengelighet…"
                        className="w-full px-3.5 py-2 rounded-xl border border-sand-dark/50 text-xs text-ink bg-white outline-none focus:border-fjord"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand-dark/20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-400 hover:text-ink border border-sand-dark/40 hover:bg-sand/50 transition-colors"
                    >
                        Avbryt
                    </button>
                    <button
                        type="button"
                        disabled={!activeSrc}
                        onClick={handleInsert}
                        className="px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}
                    >
                        Sett inn bilde
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function formatAuthors(author: string, coAuthors?: string[]): string {
    if (!coAuthors || coAuthors.length === 0) return author;
    const all = [author, ...coAuthors.filter(Boolean)];
    if (all.length === 1) return all[0];
    if (all.length === 2) return `Av ${all[0]} og ${all[1]}`;
    return `Av ${all.slice(0, -1).join(', ')} og ${all[all.length - 1]}`;
}

function renderInlineImageHtml(data: { src: string; align: string; size: string; caption?: string; alt?: string }) {
    let sizeStyle = 'max-width: 520px;';
    if (data.size === 'small') sizeStyle = 'max-width: 280px;';
    else if (data.size === 'large' || data.align === 'full') sizeStyle = 'max-width: 100%; width: 100%;';

    let alignStyle = 'margin: 1.5rem auto; display: block; clear: both;';
    if (data.align === 'left') alignStyle = 'float: left; margin: 0.5rem 1.5rem 1rem 0; clear: left;';
    else if (data.align === 'right') alignStyle = 'float: right; margin: 0.5rem 0 1rem 1.5rem; clear: right;';
    else if (data.align === 'full') alignStyle = 'width: 100%; margin: 1.5rem 0; clear: both;';

    const json = JSON.stringify(data).replace(/'/g, '&apos;');
    return `<figure data-image='${json}' contenteditable="false" style="${alignStyle} ${sizeStyle}" class="inline-image-widget not-prose select-none my-4">
        <div class="rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-sand-dark/40 bg-sand/40">
            <img src="${data.src}" alt="${data.alt || data.caption || 'Artikkelbilde'}" style="width: 100%; height: auto; max-height: 480px; object-fit: cover; display: block; border-radius: 1rem;" />
        </div>
        ${data.caption ? `<figcaption style="font-size: 0.75rem; color: #7A7269; text-align: center; font-style: italic; margin-top: 0.5rem; padding: 0 0.5rem;">${data.caption}</figcaption>` : ''}
    </figure><p><br/></p>`;
}

function contentToHtml(content: string): string {
    if (!content) return '';
    return content.split('\n\n').filter(Boolean).map(para => {
        if (para.startsWith(':::image:')) {
            try {
                const data = JSON.parse(para.slice(9, -3));
                return renderInlineImageHtml(data);
            } catch {
                return `<p>${para}</p>`;
            }
        }
        if (para.startsWith('## ')) {
            return `<h2>${para.slice(3)}</h2>`;
        }
        if (para.startsWith('### ')) {
            return `<h3>${para.slice(4)}</h3>`;
        }
        if (para.startsWith('> ')) {
            return `<blockquote>${para.slice(2)}</blockquote>`;
        }
        const formatted = para
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');
        return `<p>${formatted}</p>`;
    }).join('');
}

function htmlToContent(container: HTMLElement): string {
    const blocks: string[] = [];

    container.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const tag = el.tagName.toLowerCase();

            if (el.hasAttribute('data-image')) {
                const json = el.getAttribute('data-image');
                if (json) blocks.push(`:::image:${json}:::`);
                return;
            }

            const figures = el.querySelectorAll('figure[data-image]');
            figures.forEach(fig => {
                const json = fig.getAttribute('data-image');
                if (json) blocks.push(`:::image:${json}:::`);
                fig.remove();
            });

            if (tag === 'h2') {
                const text = el.textContent?.trim();
                if (text) blocks.push(`## ${text}`);
                return;
            }
            if (tag === 'h3') {
                const text = el.textContent?.trim();
                if (text) blocks.push(`### ${text}`);
                return;
            }
            if (tag === 'blockquote') {
                const text = el.textContent?.trim();
                if (text) blocks.push(`> ${text}`);
                return;
            }

            let html = el.innerHTML;
            let text = html
                .replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
                .replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**')
                .replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*')
                .replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .trim();

            if (text) blocks.push(text);
        } else if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) blocks.push(text);
        }
    });

    return blocks.join('\n\n');
}

// ─── Reading Time Display ─────────────────────────────────────────────────────
function ReadingTimeBadge({ wordCount }: { wordCount: number }) {
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return (
        <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm text-ink-300 border border-sand-dark/30 bg-white">
            <Clock className="w-3.5 h-3.5" />
            <span>{wordCount} ord · ~{minutes} min</span>
        </div>
    );
}

// ─── Preview renderer ─────────────────────────────────────────────────────────
function renderBody(text: string) {
    if (!text) return null;
    return text.split('\n\n').filter(Boolean).map((para, i) => {
        if (para.startsWith(':::image:')) {
            try {
                const data = JSON.parse(para.slice(9, -3));
                return <ArticleInlineImage key={i} {...data} />;
            } catch {
                return null;
            }
        }
        if (para.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-ink mt-8 mb-3">{para.slice(3)}</h2>;
        if (para.startsWith('### ')) return <h3 key={i} className="font-display text-xl font-semibold text-ink mt-6 mb-2">{para.slice(4)}</h3>;
        if (para.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-fjord/40 pl-4 italic text-ink-400 my-4">{para.slice(2)}</blockquote>;
        const parts = para.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((chunk, j) => {
            if (chunk.startsWith('**') && chunk.endsWith('**')) return <strong key={j}>{chunk.slice(2, -2)}</strong>;
            if (chunk.startsWith('*') && chunk.endsWith('*')) return <em key={j}>{chunk.slice(1, -1)}</em>;
            return chunk;
        });
        return <p key={i} className="text-ink-500 leading-[1.85] mb-5 text-[1.08rem]">{parts}</p>;
    });
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SkrivPage() {
    const router = useRouter();
    const { user } = useAuth();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [regions, setRegions] = useState<GeoRegion[]>([]);
    const [audience, setAudience] = useState<string[]>([]);
    const [angle, setAngle] = useState('');
    const [readingLevel, setReadingLevel] = useState('');
    const [sources, setSources] = useState<string[]>([]);
    const [organization, setOrganization] = useState('');
    const [position, setPosition] = useState('');
    const [orgLevel, setOrgLevel] = useState('');
    const [coAuthors, setCoAuthors] = useState<string[]>([]);
    const [editorMode, setEditorMode] = useState<'visual' | 'raw'>('visual');
    const [inlineImageModalOpen, setInlineImageModalOpen] = useState(false);
    const [preview, setPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageCaption, setImageCaption] = useState('');
    const [photographer, setPhotographer] = useState('');
    const [imageAgreed, setImageAgreed] = useState(false);
    const [showImageRightsError, setShowImageRightsError] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [allowLicensing, setAllowLicensing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const showToast = (msg: string, type: ToastType) => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Synchronize HTML into visual editor when entering visual mode
    useEffect(() => {
        if (editorMode === 'visual' && editorRef.current) {
            editorRef.current.innerHTML = contentToHtml(content);
        }
    }, [editorMode]);

    const handleVisualInput = () => {
        if (!editorRef.current) return;
        const md = htmlToContent(editorRef.current);
        setContent(md);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { showToast('Bildet må være under 5 MB', 'error'); return; }
        const reader = new FileReader();
        reader.onload = ev => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const insertFormat = useCallback((before: string, after: string, placeholder: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const s = ta.selectionStart, e = ta.selectionEnd;
        const sel = content.slice(s, e) || placeholder;
        const next = content.slice(0, s) + before + sel + after + content.slice(e);
        setContent(next);
        setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length); }, 0);
    }, [content]);

    const applyFormat = (type: 'bold' | 'italic' | 'heading' | 'quote') => {
        if (editorMode === 'visual') {
            if (type === 'bold') {
                document.execCommand('bold', false);
            } else if (type === 'italic') {
                document.execCommand('italic', false);
            } else if (type === 'heading') {
                document.execCommand('formatBlock', false, '<h2>');
            } else if (type === 'quote') {
                document.execCommand('formatBlock', false, '<blockquote>');
            }
            if (editorRef.current) {
                setContent(htmlToContent(editorRef.current));
            }
        } else {
            if (type === 'bold') insertFormat('**', '**', 'fet tekst');
            else if (type === 'italic') insertFormat('*', '*', 'kursiv');
            else if (type === 'heading') insertFormat('\n## ', '', 'Overskrift');
            else if (type === 'quote') insertFormat('\n> ', '', 'Sitat');
        }
    };

    const handleInsertInlineImage = (data: { src: string; align: 'full' | 'left' | 'center' | 'right'; size: 'small' | 'medium' | 'large'; caption?: string; alt?: string }) => {
        const shortcode = `\n\n:::image:${JSON.stringify(data)}:::\n\n`;
        if (editorMode === 'visual' && editorRef.current) {
            const imageHtml = renderInlineImageHtml(data);
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.anchorNode)) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = imageHtml;
                const frag = document.createDocumentFragment();
                let node: ChildNode | null;
                while ((node = tempDiv.firstChild)) {
                    frag.appendChild(node);
                }
                range.insertNode(frag);
            } else {
                editorRef.current.innerHTML += imageHtml;
            }
            setContent(htmlToContent(editorRef.current));
        } else {
            const ta = textareaRef.current;
            if (ta) {
                const s = ta.selectionStart, e = ta.selectionEnd;
                const next = content.slice(0, s) + shortcode + content.slice(e);
                setContent(next);
            } else {
                setContent(prev => prev + shortcode);
            }
        }
        showToast('Bilde satt inn i teksten', 'success');
    };

    const toolbar = [
        { icon: Bold, label: 'Fet', action: () => applyFormat('bold') },
        { icon: Italic, label: 'Kursiv', action: () => applyFormat('italic') },
        { icon: Heading2, label: 'Overskrift', action: () => applyFormat('heading') },
        { icon: Quote, label: 'Sitat', action: () => applyFormat('quote') },
    ];

    const handleSubmit = async () => {
        if (!title.trim()) { showToast('Legg til en tittel', 'error'); return; }
        if (content.length < 50) { showToast('Artikkelen er for kort (min. 50 tegn)', 'error'); return; }
        if (imagePreview && !imageAgreed) {
            setShowImageRightsError(true);
            showToast('Du må bekrefte bruksrett til bildet', 'error');
            return;
        }
        if (!category) { showToast('Velg en kategori', 'error'); return; }

        setShowModal(true);
    };

    const handleFinalSubmit = async () => {
        if (!agreed) return;
        setLoading(true);
        setShowModal(false);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(), subtitle: subtitle.trim(),
                    content: content.trim(), category,
                    image_url: imagePreview || undefined,
                    imageCaption: imageCaption.trim() || undefined,
                    photographer: photographer.trim() || undefined,
                    regions: regions.length ? regions : undefined,
                    audience: audience.length ? audience : undefined,
                    angle: angle || undefined,
                    readingLevel: readingLevel || undefined,
                    sources: sources.length ? sources : undefined,
                    organization: organization.trim() || undefined,
                    position: position.trim() || undefined,
                    orgLevel: orgLevel || undefined,
                    coAuthors: coAuthors.length ? coAuthors : undefined,
                    allowLicensing: allowLicensing,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Noe gikk galt');
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            showToast(err.message || 'Noe gikk galt', 'error');
        } finally {
            setLoading(false);
        }
    };

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-sand">
            {/* ── Sticky top bar ── */}
            <div className="sticky top-[68px] z-40 border-b border-sand-dark/40 px-4 sm:px-8 py-3"
                style={{ background: 'rgba(248,245,240,0.92)', backdropFilter: 'blur(16px)' }}>
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Tilbake
                    </button>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPreview(!preview)}
                            className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border transition-all ${preview ? 'bg-sand-dark/40 border-sand-dark/60 text-ink' : 'border-sand-dark/40 text-ink-400 hover:text-ink'}`}>
                            <Eye className="w-3.5 h-3.5" /> {preview ? 'Skriv' : 'Forhåndsvis'}
                        </button>
                        <button onClick={handleSubmit} disabled={loading}
                            className="flex items-center gap-1.5 text-sm px-5 py-2 rounded-xl text-white font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
                            Publiser
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
                {submitted ? (
                    <SuccessScreen />
                ) : !preview ? (
                    <div className="space-y-6">
                        {/* Image upload */}
                        <div className="space-y-4">
                            {imagePreview ? (
                                <div className="space-y-4">
                                    <div className="relative w-full h-52 rounded-2xl overflow-hidden group">
                                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                                        <button onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-ink hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">Bildetekst</label>
                                            <input type="text" value={imageCaption} onChange={e => setImageCaption(e.target.value)}
                                                placeholder="Beskriv bildet…" className="input-nordic w-full text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">Fotograf</label>
                                            <input type="text" value={photographer} onChange={e => setPhotographer(e.target.value)}
                                                placeholder="Hvem tok bildet?" className="input-nordic w-full text-sm" />
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-2xl border transition-all ${showImageRightsError && !imageAgreed ? 'bg-red-50 border-red-200' : 'bg-white border-sand-dark/40'}`}>
                                        <label className="flex gap-3 cursor-pointer group">
                                            <input type="checkbox" checked={imageAgreed} onChange={e => { setImageAgreed(e.target.checked); setShowImageRightsError(false); }} className="hidden" />
                                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${imageAgreed ? 'bg-fjord border-fjord' : 'border-sand-dark/60 bg-white group-hover:border-fjord/40'}`}>
                                                {imageAgreed && <Check className="w-3 h-3 text-white font-bold" />}
                                            </div>
                                            <div className="text-xs text-ink-400 leading-relaxed select-none">
                                                Jeg bekrefter at jeg har bruksrettigheter til bildet. Ved ulovlig bruk tar jeg fullt ansvar for konsekvensene av dette.
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => fileRef.current?.click()}
                                    className="w-full h-32 rounded-2xl border-2 border-dashed border-sand-dark/60 flex flex-col items-center justify-center gap-2 text-ink-300 hover:text-ink-400 hover:border-fjord/40 transition-all group">
                                    <ImagePlus className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">Legg til forsidebilde</span>
                                    <span className="text-xs">JPG, PNG — maks 5 MB</span>
                                </button>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>

                        {/* Title */}
                        <textarea value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Tittel på artikkelen din…"
                            rows={2} maxLength={120}
                            className="w-full font-display text-2xl sm:text-4xl font-bold text-ink placeholder-ink-200 bg-transparent border-none outline-none resize-none leading-tight" />

                        {/* Subtitle */}
                        <textarea value={subtitle} onChange={e => setSubtitle(e.target.value)}
                            placeholder="Ingress — kort oppsummering (valgfritt)"
                            rows={2} maxLength={200}
                            className="w-full text-base sm:text-lg text-ink-400 placeholder-ink-200 bg-transparent border-none outline-none resize-none leading-snug" />

                        {/* ── Category pills ── */}
                        <div>
                            <p className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2">Kategori</p>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button key={cat.id} onClick={() => setCategory(cat.id === category ? '' : cat.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${category === cat.id
                                            ? 'bg-fjord text-white border-fjord shadow-sm'
                                            : 'border-sand-dark/60 text-ink-400 hover:text-ink hover:border-fjord/40 bg-white'}`}>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Metadata dropdowns toolbar ── */}
                        <div className="border border-sand-dark/30 rounded-2xl bg-white/60 p-3">
                            <p className="text-xs font-semibold text-ink-300 uppercase tracking-wider mb-2.5 px-1">Artikkeldetaljer</p>
                            <div className="flex flex-wrap gap-2">
                                <MapDropdown regions={regions} setRegions={setRegions} />
                                <AudienceDropdown audience={audience} setAudience={setAudience} />
                                <AngleDropdown angle={angle} setAngle={setAngle} />
                                <ReadingLevelDropdown level={readingLevel} setLevel={setReadingLevel} />
                                <OrganizationDropdown
                                    organization={organization} setOrganization={setOrganization}
                                    position={position} setPosition={setPosition}
                                    orgLevel={orgLevel} setOrgLevel={setOrgLevel}
                                />
                                <CoAuthorsDropdown coAuthors={coAuthors} setCoAuthors={setCoAuthors} />
                                <SourcesDropdown sources={sources} setSources={setSources} />
                                <ReadingTimeBadge wordCount={wordCount} />
                            </div>
                        </div>

                        <div className="border-t border-sand-dark/40" />

                        {/* Formatting toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                            <div className="flex items-center gap-1">
                                {toolbar.map(({ icon: Icon, label, action }) => (
                                    <button key={label} type="button" onClick={action} title={label}
                                        className="p-2 rounded-lg text-ink-400 hover:text-ink hover:bg-white border border-transparent hover:border-sand-dark/40 transition-all">
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setInlineImageModalOpen(true)}
                                    title="Sett inn bilde i artikkelen"
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-fjord hover:text-fjord-dark hover:bg-white border border-sand-dark/40 transition-all shadow-2xs"
                                >
                                    <ImageIcon className="w-4 h-4 text-fjord" />
                                    <span className="hidden sm:inline">Bilde i artikkel</span>
                                </button>
                            </div>

                            {/* Formatert / Råtekst toggle */}
                            <div className="flex items-center bg-sand-dark/20 p-0.5 rounded-xl text-xs font-medium">
                                <button
                                    type="button"
                                    onClick={() => setEditorMode('visual')}
                                    className={`px-3 py-1 rounded-lg transition-all ${editorMode === 'visual' ? 'bg-white text-ink shadow-xs font-bold' : 'text-ink-400 hover:text-ink'}`}
                                >
                                    Formatert (visuell)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditorMode('raw')}
                                    className={`px-3 py-1 rounded-lg transition-all ${editorMode === 'raw' ? 'bg-white text-ink shadow-xs font-bold' : 'text-ink-400 hover:text-ink'}`}
                                >
                                    Råtekst (Markdown)
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {editorMode === 'visual' ? (
                            <div
                                ref={editorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={handleVisualInput}
                                data-placeholder="Begynn å skrive her… Del din mening, din analyse eller din historie. Bruk verktøylinjen for å sette inn overskrift, fet skrift, kursiv eller bilder rett i teksten."
                                className="writer-canvas w-full placeholder-ink-200 bg-transparent border-none outline-none font-sans"
                            />
                        ) : (
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Begynn å skrive her… Del din mening, din analyse eller din historie."
                                rows={22}
                                className="w-full text-ink-500 text-[1.08rem] leading-[1.85] placeholder-ink-200 bg-transparent border-none outline-none resize-none font-sans"
                            />
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-sand-dark/40 p-5 sm:p-8 md:p-12">
                        {imagePreview && (
                            <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-8">
                                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        {category && (
                            <div className="flex items-center gap-2 mb-4">
                                <span
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none bg-white/80 text-ink border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-md"
                                    style={{
                                        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                                        backdropFilter: 'blur(16px) saturate(180%)',
                                    }}
                                >
                                    <span className="leading-none">{CATEGORIES.find(c => c.id === category)?.label}</span>
                                </span>
                                {organization && (
                                    <span className="text-xs font-bold text-fjord italic">
                                        · {position && `${position}, `}{organization}
                                    </span>
                                )}
                            </div>
                        )}
                        {angle && <span className="ml-2 text-xs bg-sand px-3 py-1 rounded-full text-ink-400">{angle}</span>}
                        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight mb-3 mt-2">
                            {title || 'Din tittel vil vises her…'}
                        </h1>
                        {subtitle && <p className="text-lg text-ink-400 mb-3">{subtitle}</p>}
                        <p className="text-xs text-ink-400 font-semibold mb-6 flex items-center gap-1.5">
                            <span>✍️ {formatAuthors(user?.name || 'Deg', coAuthors)}</span>
                        </p>
                        {regions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-6">
                                {regions.map(r => (
                                    <span key={`${r.level}-${r.id}`} className="text-xs bg-fjord/10 text-fjord-dark px-2.5 py-1 rounded-full font-medium">📍 {r.name}</span>
                                ))}
                            </div>
                        )}
                        <div className="mt-6">{renderBody(content || 'Innholdet ditt vil vises her…')}</div>
                        {sources.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-sand-dark/30">
                                <p className="text-sm font-semibold text-ink mb-2">🔗 Kilder</p>
                                {sources.map((s, i) => <p key={i} className="text-xs text-ink-400">{s}</p>)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-sand-dark/30"
                        >
                            <div className="p-8 sm:p-10 text-center">
                                <div className="w-16 h-16 bg-fjord/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <PenLine className="w-8 h-8 text-fjord" />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-ink mb-4">Er du sikker på at du vil sende inn til redaksjonen?</h3>

                                <div className="text-left bg-sand/50 p-5 rounded-2xl border border-sand-dark/40 mb-8 space-y-4">
                                    <p className="text-xs text-ink-400 flex gap-2">
                                        <Check className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                                        <span>Du bekrefter at du publiserer under ditt eget navn, og ikke et falskt navn eller imiterer andre.</span>
                                    </p>
                                    <label className="flex gap-4 cursor-pointer group pb-4 border-b border-sand-dark/20 mb-4">
                                        <input
                                            type="checkbox"
                                            checked={allowLicensing}
                                            onChange={e => setAllowLicensing(e.target.checked)}
                                            className="hidden"
                                        />
                                        <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${allowLicensing ? 'bg-amber border-amber' : 'border-sand-dark/60 bg-white group-hover:border-amber/40'}`}>
                                            {allowLicensing && <Check className="w-4 h-4 text-white font-bold" />}
                                        </div>
                                        <div className="text-sm text-ink-400 leading-relaxed select-none">
                                            <span className="font-bold text-ink">Tillat medielisensiering (Valgfritt)</span><br />
                                            Jeg gir Ytre tillatelse til å formidle min artikkel til andre mediehus for videresending. Jeg beholder mine rettigheter, men åpner for større spredning.
                                        </div>
                                    </label>

                                    <label className="flex gap-4 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={agreed}
                                            onChange={e => setAgreed(e.target.checked)}
                                            className="hidden"
                                        />
                                        <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? 'bg-fjord border-fjord' : 'border-sand-dark/60 bg-white group-hover:border-fjord/40'}`}>
                                            {agreed && <Check className="w-4 h-4 text-white font-bold" />}
                                        </div>
                                        <div className="text-sm text-ink-400 leading-relaxed select-none">
                                            Jeg godkjenner at dette er mitt eget arbeid, og samtykker til at redaksjonen mottar artikkelen. Jeg er innforstått med at vi går gjennom alle artikler for ulovlig innhold, hatefulle ytringer eller personangrep.
                                        </div>
                                    </label>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3.5 rounded-2xl bg-white border border-sand-dark/60 text-ink font-semibold hover:bg-sand transition-all"
                                    >
                                        Avbryt
                                    </button>
                                    <button
                                        onClick={handleFinalSubmit}
                                        disabled={!agreed}
                                        className="flex-1 px-6 py-3.5 rounded-2xl text-white font-bold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}
                                    >
                                        Send inn artikkel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <InlineImageModal
                open={inlineImageModalOpen}
                onClose={() => setInlineImageModalOpen(false)}
                onInsert={handleInsertInlineImage}
            />
        </div>
    );
}

function SuccessScreen() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-sand-dark/40 p-10 sm:p-16 text-center shadow-xl"
        >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-display text-4xl font-bold text-ink mb-4">Takk for ditt bidrag!</h1>
            <p className="text-xl text-ink-400 mb-8 max-w-md mx-auto leading-relaxed">
                Innlegget ditt er nå sendt til redaksjonen for godkjenning. Du får beskjed så snart det er publisert.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/profil"
                    className="px-8 py-3.5 rounded-2xl bg-white border border-sand-dark/60 text-ink font-semibold hover:bg-sand transition-all">
                    Se mine innlegg
                </Link>
                <Link href="/"
                    className="px-8 py-3.5 rounded-2xl text-white font-bold transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}>
                    Tilbake til forsiden
                </Link>
            </div>
        </motion.div>
    );
}

