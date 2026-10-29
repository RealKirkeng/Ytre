'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NorwayMap, GeoFeature, GeoMode } from './NorwayMap';

export function HomepageMapPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRegion = searchParams.get('region') ?? '';

    const [geoMode, setGeoMode] = useState<GeoMode>('fylke');
    const [selected, setSelected] = useState<{ id: string; name: string } | null>(
        currentRegion ? { id: currentRegion, name: currentRegion } : null
    );

    const handleSelect = useCallback((feature: GeoFeature) => {
        if (selected?.id === feature.id) {
            setSelected(null);
            router.push('/');
        } else {
            setSelected({ id: feature.id, name: feature.name });
            router.push(`/?region=${feature.id}`);
        }
    }, [selected, router]);

    const clear = () => { setSelected(null); router.push('/'); };
    const selectedIds = selected ? [selected.id] : [];

    return (
        <div className="rounded-2xl border border-sand-dark/30 shadow-sm overflow-hidden"
            style={{ background: 'rgba(255,253,250,0.97)', backdropFilter: 'blur(12px)' }}>

            {/* Header */}
            <div className="px-4 py-3 border-b border-sand-dark/20"
                style={{ background: 'linear-gradient(135deg,rgba(91,137,168,0.08),rgba(168,123,142,0.06))' }}>
                <div className="flex items-center gap-2">
                    <span className="text-base">🗺️</span>
                    <div>
                        <p className="text-sm font-bold text-ink">Finn innhold etter sted</p>
                        <p className="text-xs text-ink-300">Klikk på et område i kartet</p>
                    </div>
                </div>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2 px-3 pt-3">
                {(['fylke', 'kommune'] as GeoMode[]).map(m => (
                    <button key={m} onClick={() => setGeoMode(m)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${geoMode === m ? 'text-white' : 'bg-sand text-ink-400 hover:text-ink'}`}
                        style={geoMode === m ? { background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' } : {}}>
                        {m === 'fylke' ? 'Fylke' : 'Kommune'}
                    </button>
                ))}
            </div>

            {/* Map */}
            <div className="px-3 py-2">
                <NorwayMap mode={geoMode} selected={selectedIds} onSelect={handleSelect} />
            </div>

            {/* Active region / empty state */}
            <div className="px-4 py-3 border-t border-sand-dark/20">
                {selected ? (
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 bg-fjord/10 text-fjord-dark text-xs font-semibold px-3 py-1.5 rounded-full">
                            📍 {selected.name}
                        </span>
                        <button onClick={clear}
                            className="text-xs text-ink-300 hover:text-red-400 transition-colors underline">
                            Vis alle
                        </button>
                    </div>
                ) : (
                    <p className="text-xs text-ink-300 text-center">Ingen stedsfilter aktivt</p>
                )}
            </div>
        </div>
    );
}
