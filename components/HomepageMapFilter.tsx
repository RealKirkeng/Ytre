'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { NorwayMap, type GeoFeature, type GeoMode } from '@/components/NorwayMap';

export function HomepageMapFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRegion = searchParams.get('region') ?? '';

    const [open, setOpen] = useState(false);
    const [geoMode, setGeoMode] = useState<GeoMode>('fylke');
    const [selected, setSelected] = useState<{ id: string; name: string } | null>(
        currentRegion ? { id: currentRegion, name: currentRegion } : null
    );
    const ref = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleSelect = useCallback((feature: GeoFeature) => {
        if (selected?.id === feature.id) {
            setSelected(null);
            router.push('/');
        } else {
            setSelected({ id: feature.id, name: feature.name });
            router.push(`/?region=${feature.id}`);
        }
        setOpen(false);
    }, [selected, router]);

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected(null);
        router.push('/');
    };

    const isActive = !!selected;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${isActive
                    ? 'text-white border-transparent'
                    : 'bg-white border-sand-dark/50 text-ink-400 hover:text-ink hover:border-fjord/30'}`}
                style={isActive ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                <MapPin className="w-3.5 h-3.5" />
                {isActive ? selected!.name : 'Kart'}
                {isActive
                    ? <span onClick={clear} className="ml-0.5 hover:opacity-70 transition-opacity"><X className="w-3 h-3" /></span>
                    : <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
                }
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-2 z-50 w-[90vw] sm:w-[440px] max-h-[85vh] flex flex-col rounded-3xl border border-sand-dark/30 shadow-2xl overflow-hidden"
                    style={{ background: 'rgba(255,253,250,0.98)', backdropFilter: 'blur(16px)' }}>
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-sand-dark/20 flex items-center justify-between"
                        style={{ background: 'linear-gradient(135deg,rgba(91,137,168,0.07),rgba(168,123,142,0.05))' }}>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">🗺️</span>
                            <p className="text-xs font-bold text-ink">Filtrer etter sted</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-ink-300 hover:text-ink">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Mode tabs */}
                    <div className="flex gap-1.5 px-3 pt-3">
                        {(['fylke', 'kommune'] as GeoMode[]).map(m => (
                            <button key={m} onClick={() => setGeoMode(m)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${geoMode === m ? 'text-white' : 'bg-sand text-ink-400 hover:text-ink'}`}
                                style={geoMode === m ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                                {m === 'fylke' ? 'Fylke' : 'Kommune'}
                            </button>
                        ))}
                    </div>

                    {/* Map */}
                    <div className="px-2 py-2">
                        <NorwayMap mode={geoMode} selected={selected ? [selected.id] : []} onSelect={handleSelect} />
                    </div>

                    {/* Footer */}
                    {selected && (
                        <div className="px-4 py-2 border-t border-sand-dark/20 flex items-center justify-between">
                            <span className="text-xs text-ink-400">📍 {selected.name}</span>
                            <button onClick={clear} className="text-xs text-fjord hover:underline">Fjern filter</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
