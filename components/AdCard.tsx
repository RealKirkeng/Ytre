'use client';

import { motion } from 'framer-motion';

interface AdCardProps {
    index?: number;
}

export function AdCard({ index = 0 }: AdCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="glass-card p-5 relative overflow-hidden cursor-pointer group">
                {/* Sponsored badge */}
                <span className="absolute top-3 right-3 text-[10px] font-semibold text-amber-400/70 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
                    Sponset
                </span>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/3 to-transparent pointer-events-none rounded-[inherit]" />

                <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/20 flex items-center justify-center">
                        <span className="text-lg">📢</span>
                    </div>

                    <div>
                        <h3 className="font-display font-semibold text-white/80 text-sm mb-1 group-hover:text-white transition-colors">
                            Annonsér på Debattnett
                        </h3>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Nå tusenvis av engasjerte unge lesere. Kontakt oss for annonseringsmuligheter.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-400/60 group-hover:text-amber-400 transition-colors mt-1">
                        <span>Les mer →</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Inline ad strip — for use inside article reading
export function InlineAd() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="my-10 mx-auto max-w-[70ch]"
        >
            <div className="glass rounded-xl px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/20 flex items-center justify-center shrink-0">
                        <span className="text-sm">📢</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-white/60 leading-snug truncate">
                            Annonsér på Debattnett — nå engasjerte unge lesere
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-amber-400/60 border border-amber-400/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                        Annonse
                    </span>
                    <button className="text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded">
                        Les mer →
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
