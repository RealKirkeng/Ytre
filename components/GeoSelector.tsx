'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { NorwayMap, GeoFeature } from './NorwayMap';

export type GeoLevel = 'global' | 'national' | 'fylke' | 'kommune';

export interface GeoRegion {
    level: GeoLevel;
    id: string;
    name: string;
}

interface GeoSelectorProps {
    selected: GeoRegion[];
    onChange: (regions: GeoRegion[]) => void;
    onClose: () => void;
}

const LEVELS: { id: GeoLevel; icon: string; label: string; desc: string }[] = [
    { id: 'global', icon: '🌍', label: 'Globalt', desc: 'Relevant for hele verden' },
    { id: 'national', icon: '🇳🇴', label: 'Nasjonalt', desc: 'Relevant for hele Norge' },
    { id: 'fylke', icon: '🗺️', label: 'Fylke', desc: 'Velg ett eller flere fylker' },
    { id: 'kommune', icon: '📍', label: 'Kommune', desc: 'Velg én eller flere kommuner' },
];

const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.80)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
};

export function GeoSelector({ selected, onChange, onClose }: GeoSelectorProps) {
    const [level, setLevel] = useState<GeoLevel>(
        selected.length > 0 ? selected[0].level : 'fylke'
    );
    const [search, setSearch] = useState('');

    // For map-mode levels — which geo ids are selected
    const mapSelected = selected
        .filter(r => r.level === level)
        .map(r => r.id);

    const handleMapSelect = useCallback((feature: GeoFeature) => {
        const existing = selected.find(r => r.level === level && r.id === feature.id);
        if (existing) {
            // Deselect
            onChange(selected.filter(r => !(r.level === level && r.id === feature.id)));
        } else {
            // Add
            onChange([...selected.filter(r => r.level !== 'global' && r.level !== 'national'),
            { level, id: feature.id, name: feature.name }]);
        }
    }, [selected, onChange, level]);

    const handleSimpleLevel = (lvl: 'global' | 'national') => {
        // Global/national are mutually exclusive singletons
        onChange([{ level: lvl, id: lvl, name: lvl === 'global' ? 'Globalt' : 'Nasjonalt' }]);
        setLevel(lvl);
    };

    const removeRegion = (r: GeoRegion) => {
        onChange(selected.filter(x => !(x.level === r.level && x.id === r.id)));
    };

    const clearAll = () => onChange([]);

    const isMapLevel = level === 'fylke' || level === 'kommune';

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            >
                {/* Modal */}
                <motion.div
                    className="relative w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-3xl flex flex-col"
                    style={glass}
                    initial={{ y: 80, opacity: 0, scale: 0.97 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 80, opacity: 0, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-sand-dark/30 shrink-0">
                        <div>
                            <h2 className="font-display font-bold text-ink text-lg">📍 Geografisk rekkevidde</h2>
                            <p className="text-xs text-ink-400 mt-0.5">Hvor er innlegget ditt relevant?</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-sand/60 text-ink-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Level tabs */}
                    <div className="flex gap-2 px-6 pt-4 pb-3 shrink-0 overflow-x-auto scrollbar-none">
                        {LEVELS.map(l => (
                            <button
                                key={l.id}
                                onClick={() => {
                                    setLevel(l.id);
                                    if (l.id === 'global' || l.id === 'national') handleSimpleLevel(l.id);
                                }}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${level === l.id
                                    ? 'text-white border-transparent shadow'
                                    : 'bg-white border-sand-dark/50 text-ink-400 hover:text-ink'
                                    }`}
                                style={level === l.id ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}
                            >
                                <span>{l.icon}</span>{l.label}
                            </button>
                        ))}
                    </div>

                    {/* Body — scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 pb-4">

                        {/* Global / National — simple confirmation */}
                        {(level === 'global' || level === 'national') && (
                            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                                <div className="text-6xl">{level === 'global' ? '🌍' : '🇳🇴'}</div>
                                <p className="text-ink font-semibold text-base">
                                    {level === 'global' ? 'Globalt innlegg' : 'Nasjonalt innlegg'}
                                </p>
                                <p className="text-ink-400 text-sm max-w-xs">
                                    {LEVELS.find(l => l.id === level)?.desc}
                                </p>
                                {selected.some(r => r.level === level) && (
                                    <div className="flex items-center gap-2 bg-fjord/10 text-fjord-dark text-sm font-semibold px-4 py-2 rounded-full">
                                        <Check className="w-4 h-4" />Valgt
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Fylke / Kommune — map */}
                        {isMapLevel && (
                            <>
                                {/* Search */}
                                <div className="relative mb-3">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50">🔍</span>
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder={`Søk ${level === 'fylke' ? 'fylke' : 'kommune'}...`}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-sand/60 border border-sand-dark/40 text-sm text-ink placeholder-ink-300 outline-none focus:border-fjord/50 transition-colors"
                                    />
                                </div>

                                {/* Map */}
                                <div className="rounded-2xl overflow-hidden border border-sand-dark/30 bg-[#eef5fa]">
                                    <NorwayMap
                                        mode={level}
                                        selected={mapSelected}
                                        onSelect={handleMapSelect}
                                    />
                                </div>

                                <p className="text-xs text-ink-300 text-center mt-2">
                                    Klikk for å velge · Klikk igjen for å fjerne · Du kan velge flere
                                </p>
                            </>
                        )}
                    </div>

                    {/* Selected chips + confirm */}
                    <div className="shrink-0 border-t border-sand-dark/30 px-6 pt-4 pb-6">
                        {selected.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {selected.map(r => (
                                    <span key={`${r.level}-${r.id}`}
                                        className="inline-flex items-center gap-1 bg-fjord/10 text-fjord-dark text-xs font-semibold px-3 py-1.5 rounded-full">
                                        {r.name}
                                        <button onClick={() => removeRegion(r)} className="ml-0.5 hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                <button onClick={clearAll} className="text-xs text-ink-300 hover:text-ink-400 underline ml-1 self-center">
                                    Fjern alle
                                </button>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button onClick={onClose}
                                className="flex-1 py-3 rounded-2xl border border-sand-dark/50 text-sm text-ink-400 hover:text-ink transition-colors font-semibold">
                                Avbryt
                            </button>
                            <button onClick={onClose}
                                className="flex-1 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                                style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', boxShadow: '0 4px 16px rgba(91,137,168,0.3)' }}>
                                Bekreft {selected.length > 0 ? `(${selected.length})` : ''}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
