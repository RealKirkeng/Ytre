'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check, Users, Tag, BookOpen, Link2, MapPin, X } from 'lucide-react';
import { AUDIENCES, PERSPECTIVES, READING_LEVELS, ORGANIZATION_LEVELS } from '@/lib/constants';
import dynamic from 'next/dynamic';
import type { GeoFeature, GeoMode } from '@/components/NorwayMap';

const NorwayMap = dynamic(
    () => import('@/components/NorwayMap').then(mod => mod.NorwayMap),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-sand/10 rounded-xl">
                <div className="w-5 h-5 border-2 border-fjord border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
);

export function DiscoveryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [geoMode, setGeoMode] = useState<GeoMode>('fylke');

    const audience = searchParams.get('audience') || '';
    const angle = searchParams.get('angle') || '';
    const level = searchParams.get('level') || '';
    const hasSources = searchParams.get('sources') === 'true';
    const region = searchParams.get('region') || '';
    const orgLevel = searchParams.get('orgLevel') || '';

    // Count active filters (excluding category, query, sort)
    let activeCount = 0;
    if (audience) activeCount++;
    if (angle) activeCount++;
    if (level) activeCount++;
    if (hasSources) activeCount++;
    if (region) activeCount++;
    if (orgLevel) activeCount++;

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`/?${params.toString()}`);
    };

    const handleSelectRegion = useCallback((feature: GeoFeature) => {
        if (region === feature.id) {
            updateFilter('region', null);
        } else {
            updateFilter('region', feature.id);
        }
    }, [region, updateFilter]);

    const toggleSources = () => updateFilter('sources', hasSources ? null : 'true');

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${open || activeCount > 0
                    ? 'border-fjord/50 bg-fjord/8 text-fjord-dark shadow-sm'
                    : 'bg-white border-sand-dark/50 text-ink-400 hover:text-ink hover:border-fjord/30'
                    }`}
            >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filtrer</span>
                {activeCount > 0 && (
                    <span className="bg-fjord text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center leading-none font-bold">
                        {activeCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-x-3 top-24 sm:absolute sm:inset-x-auto sm:top-full sm:left-0 mt-2 z-50 w-auto sm:w-[600px] lg:w-[700px] max-h-[80vh] overflow-y-auto rounded-3xl border border-sand-dark/30 shadow-2xl p-4 sm:p-5 flex flex-col gap-6"
                        style={{ background: 'rgba(255,253,250,0.98)', backdropFilter: 'blur(20px)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-sand-dark/20">
                            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-fjord" />
                                Avanserte filtre
                            </h3>
                            <div className="flex items-center gap-3">
                                {activeCount > 0 && (
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.delete('audience');
                                            params.delete('angle');
                                            params.delete('level');
                                            params.delete('sources');
                                            params.delete('region');
                                            params.delete('orgLevel');
                                            router.push(`/?${params.toString()}`);
                                        }}
                                        className="text-xs font-semibold text-fjord hover:underline"
                                    >
                                        Fjern alle
                                    </button>
                                )}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1 rounded-full text-ink-300 hover:text-ink hover:bg-sand/60 transition-colors"
                                    title="Lukk filtre"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Filter Sections Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Region / Map (takes up 1 column but longer) */}
                            <div className="sm:row-span-2 lg:col-span-1 rounded-2xl bg-sand/30 p-2 border border-sand-dark/20 flex flex-col">
                                <h4 className="flex items-center justify-between gap-1.5 text-xs font-semibold text-ink-400 mb-2 px-2 pt-1 uppercase tracking-wide">
                                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Område</div>
                                    {region && <button onClick={() => updateFilter('region', null)} className="text-[10px] text-fjord lowercase hover:underline">fjern</button>}
                                </h4>
                                <div className="flex gap-1 mb-2 px-2">
                                    {(['fylke', 'kommune'] as GeoMode[]).map(m => (
                                        <button key={m} onClick={() => setGeoMode(m)}
                                            className={`flex-1 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${geoMode === m ? 'bg-fjord/10 text-fjord-dark shadow-sm' : 'bg-white text-ink-400 hover:text-ink hover:bg-white/60'}`}>
                                            {m}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 min-h-[160px] relative rounded-xl overflow-hidden bg-white/40 border border-white/60 p-1">
                                    <NorwayMap mode={geoMode} selected={region ? [region] : []} onSelect={handleSelectRegion} />
                                </div>
                            </div>
                            {/* Audience */}
                            <div>
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
                                    <Users className="w-3.5 h-3.5" /> Målgruppe
                                </h4>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => updateFilter('audience', null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${!audience ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                        Alle målgrupper
                                    </button>
                                    {AUDIENCES.map(a => (
                                        <button key={a.id} onClick={() => updateFilter('audience', a.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${audience === a.id ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                            {a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Angle */}
                            <div>
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
                                    <Tag className="w-3.5 h-3.5" /> Vinkel
                                </h4>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => updateFilter('angle', null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${!angle ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                        Alle vinkler
                                    </button>
                                    {PERSPECTIVES.map(p => (
                                        <button key={p} onClick={() => updateFilter('angle', p)}
                                            className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${angle === p ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Level */}
                            <div>
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
                                    <BookOpen className="w-3.5 h-3.5" /> Lese Nivå
                                </h4>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => updateFilter('level', null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${!level ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                        Alle nivåer
                                    </button>
                                    {READING_LEVELS.map(r => (
                                        <button key={r.id} onClick={() => updateFilter('level', r.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${level === r.id ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Organization Level */}
                            <div>
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
                                    <span className="text-[14px] leading-none">🏢</span> Organisasjon
                                </h4>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => updateFilter('orgLevel', null)}
                                        className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${!orgLevel ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                        Alle avsendere
                                    </button>
                                    {ORGANIZATION_LEVELS.map(o => (
                                        <button key={o.id} onClick={() => updateFilter('orgLevel', o.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${orgLevel === o.id ? 'bg-fjord/10 text-fjord-dark font-medium' : 'text-ink-400 hover:bg-sand'}`}>
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Flags */}
                            <div>
                                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-ink-400 mb-2 uppercase tracking-wide">
                                    <Link2 className="w-3.5 h-3.5" /> Kvalitetskrav
                                </h4>
                                <button
                                    onClick={toggleSources}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${hasSources
                                        ? 'border-fjord/50 bg-fjord/5 text-fjord-dark'
                                        : 'border-sand-dark/40 text-ink-400 hover:bg-sand hover:text-ink'
                                        }`}
                                >
                                    <span>Artikkel med kilder</span>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${hasSources ? 'bg-fjord border-fjord text-white' : 'border-sand-dark bg-white'}`}>
                                        {hasSources && <Check className="w-3 h-3" />}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
