'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface GeoFeature {
    id: string;
    name: string;
}

export type GeoMode = 'fylke' | 'kommune';

interface PathEntry { id: string; name: string; d: string; }
interface PathData { W: number; H: number; features: PathEntry[]; }

interface NorwayMapProps {
    mode: GeoMode;
    selected: string[];
    onSelect: (f: GeoFeature) => void;
}

const CACHE: Record<string, PathData> = {};

async function loadPaths(mode: GeoMode): Promise<PathData> {
    const url = mode === 'fylke' ? '/norway-fylker-paths.json' : '/norway-kommuner-paths.json';
    if (CACHE[url]) return CACHE[url];
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data: PathData = await r.json();
    CACHE[url] = data;
    return data;
}

export function NorwayMap({ mode, selected, onSelect }: NorwayMapProps) {
    const [data, setData] = useState<PathData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // ─── Zoom & Pan Logic ─────────────────────────────────────────────────────
    const [view, setView] = useState({ x: 0, y: 0, k: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(false);
        loadPaths(mode)
            .then(d => {
                if (active) {
                    setData(d);
                    setLoading(false);

                    // Auto-fit Logic: Norway is narrow, let's zoom it in more by default
                    // Use dynamic dimensions from data
                    const initialK = 1.35; // Start with 35% more zoom
                    setView({
                        k: initialK,
                        x: (d.W * (1 - initialK)) / 2, // Center horizontally
                        y: (d.H * (1 - initialK)) / 2  // Center vertically
                    });
                }
            })
            .catch(() => { if (active) { setError(true); setLoading(false); } });
        return () => { active = false; };
    }, [mode]);

    const onEnter = useCallback((e: React.MouseEvent<SVGPathElement>, entry: PathEntry) => {
        setHovered(entry.id);
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, name: entry.name });
    }, []);

    const onMove = useCallback((e: React.MouseEvent<SVGPathElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) setTooltip(t => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
    }, []);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        // Touchpad pinch is handled via ctrlKey in many browsers
        // Standard wheel delta is often +/- 100 or higher
        // We want a scale factor around 0.95 or 1.05 per "notch"
        const delta = -e.deltaY;
        const factor = e.ctrlKey ? 0.005 : 0.002; // More sensitive for wheel, less for pinch? 
        // Actually browsers vary wildly. Let's use a simpler exponential approach.

        const zoomStep = Math.exp(delta * factor);
        const newK = Math.min(Math.max(view.k * zoomStep, 0.5), 15);

        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomX = (mouseX - view.x) / view.k;
        const zoomY = (mouseY - view.y) / view.k;

        setView({
            k: newK,
            x: mouseX - zoomX * newK,
            y: mouseY - zoomY * newK
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(false); // Reset on start
        lastPos.current = { x: e.clientX, y: e.clientY };

        // Use a window-level listeners for smoother dragging outside SVG
        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - lastPos.current.x;
            const dy = moveEvent.clientY - lastPos.current.y;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                setIsDragging(true);
            }

            setView(v => ({ ...v, x: v.x + dx, y: v.y + dy }));
            lastPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // Remove the old simple handlers from component scope since we use window listeners now
    const handleMouseMove = () => { };
    const handleMouseUp = () => { };

    if (loading) return (
        <div className="flex items-center justify-center py-16 text-ink-300 text-sm gap-2">
            <span className="animate-spin text-lg">🗺️</span> Laster kart…
        </div>
    );

    if (error || !data) return (
        <div className="flex items-center justify-center py-16 text-red-400 text-sm">Kunne ikke laste kartet.</div>
    );

    const { W, H, features } = data;

    return (
        <div className="relative w-full overflow-hidden select-none bg-sand/20 rounded-2xl border border-sand-dark/20 h-[700px]">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full block"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { handleMouseUp(); setHovered(null); setTooltip(null); }}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <defs>
                    <linearGradient id="nmSel" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#5B89A8" />
                        <stop offset="100%" stopColor="#A87B8E" />
                    </linearGradient>
                    <filter id="nmGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="2" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                <g transform={`translate(${view.x}, ${view.y}) scale(${view.k})`}>
                    {features.map(f => {
                        const isSel = selected.includes(f.id);
                        const isHov = hovered === f.id && !isSel;
                        return (
                            <path
                                key={f.id}
                                d={f.d}
                                fill={isSel ? 'url(#nmSel)' : isHov ? '#9ec8de' : '#cce3ef'}
                                stroke={isSel ? '#4a7a99' : '#a8d0e4'}
                                strokeWidth={(mode === 'kommune' ? 0.2 : 0.4) / view.k}
                                style={{ cursor: 'pointer', transition: 'fill 0.1s', filter: isSel ? 'url(#nmGlow)' : 'none' }}
                                onMouseEnter={e => onEnter(e, f)}
                                onMouseMove={onMove}
                                onClick={() => !isDragging && onSelect({ id: f.id, name: f.name })}
                            />
                        );
                    })}
                </g>
            </svg>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
                <button
                    onClick={() => setView(v => ({ ...v, k: Math.min(v.k * 1.5, 10) }))}
                    className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-ink hover:bg-sand transition-colors border border-sand-dark/20 text-xl font-bold">+</button>
                <button
                    onClick={() => setView(v => ({ ...v, k: Math.max(v.k / 1.5, 0.5) }))}
                    className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-ink hover:bg-sand transition-colors border border-sand-dark/20 text-xl font-bold">−</button>
                <button
                    onClick={() => setView({ x: 0, y: 0, k: 1 })}
                    className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-xs font-semibold text-ink hover:bg-sand transition-colors border border-sand-dark/20">Nullstill</button>
            </div>

            {tooltip && (
                <div
                    className="absolute pointer-events-none text-white text-xs px-2.5 py-1 rounded-full whitespace-nowrap z-20 shadow-lg"
                    style={{ left: tooltip.x, top: tooltip.y - 36, transform: 'translateX(-50%)', background: 'rgba(20,30,40,0.88)', backdropFilter: 'blur(6px)' }}
                >
                    {tooltip.name}
                </div>
            )}
        </div>
    );
}
