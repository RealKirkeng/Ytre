'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PenLine, Megaphone, HeartHandshake, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

export function FluidHero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, 150]);
    const y3 = useTransform(scrollY, [0, 500], [0, 50]);

    const words = [
        "DEMOKRATI", "YTRINGSFRIHET", "NYHETER", "MENINGER", "SAMFUNN",
        "DEBATT", "RØST", "MANGFOLD", "ENGASJEMENT", "ÅPENHET",
        "RETTFERDIGHET", "KRONIKK", "FRITT ORD", "GRUNNLOVEN"
    ];

    // Create a really long string so it spans far beyond the viewport
    const marqueeText = [...words, ...words, ...words, ...words, ...words, ...words, ...words].join("  ·  ");

    return (
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full h-full flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-sand/20 pointer-events-none z-20" />

            {/* Scrolling Transparent Words Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-center gap-6 sm:gap-8 font-display font-black whitespace-nowrap z-0 select-none opacity-[0.04]">

                {/* Row 1: Left to Right */}
                <motion.div style={{ y: y1, animationDuration: '750s' }} className="flex w-max animate-marquee-right text-[4.5vw] leading-none text-ink">
                    <span className="pr-12">{marqueeText}  ·  </span>
                    <span className="pr-12">{marqueeText}  ·  </span>
                </motion.div>

                {/* Row 2: Right to Left */}
                <motion.div style={{ y: y2, animationDuration: '950s' }} className="flex w-max animate-marquee-left text-[6.5vw] leading-none text-fjord ml-[-20vw]">
                    <span className="pr-12">{marqueeText}  ·  </span>
                    <span className="pr-12">{marqueeText}  ·  </span>
                </motion.div>

                {/* Row 3: Left to Right */}
                <motion.div style={{ y: y3, animationDuration: '700s' }} className="flex w-max animate-marquee-right text-[4vw] leading-none text-ink opacity-80 ml-[-5vw]">
                    <span className="pr-12">{marqueeText}  ·  </span>
                    <span className="pr-12">{marqueeText}  ·  </span>
                </motion.div>

                {/* Row 4: Right to Left */}
                <motion.div style={{ y: y1, animationDuration: '850s' }} className="flex w-max animate-marquee-left text-[5.5vw] leading-none text-ink opacity-60 ml-[-30vw]">
                    <span className="pr-12">{marqueeText}  ·  </span>
                    <span className="pr-12">{marqueeText}  ·  </span>
                </motion.div>

                {/* Row 5: Left to Right */}
                <motion.div style={{ y: y2, animationDuration: '1050s' }} className="flex w-max animate-marquee-right text-[7vw] leading-none text-fjord opacity-50 ml-[-15vw]">
                    <span className="pr-12">{marqueeText}  ·  </span>
                    <span className="pr-12">{marqueeText}  ·  </span>
                </motion.div>
            </div>

            {/* Ambient floating particles */}
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="hero-particle"
                    style={{
                        left: `${8 + (i * 7.3) % 85}%`,
                        bottom: `${10 + (i * 13) % 50}%`,
                        animationDuration: `${4 + (i * 1.7) % 5}s`,
                        animationDelay: `${(i * 0.8) % 4}s`,
                        width: `${2 + (i % 2)}px`,
                        height: `${2 + (i % 2)}px`,
                        opacity: 0.4 + (i % 3) * 0.1,
                    }}
                />
            ))}

            {/* Static accent rings (more organic colors) */}
            <div aria-hidden
                className="pointer-events-none absolute top-12 left-16 w-64 h-64 rounded-full border-[0.5px] border-rose-300/20 animate-spin z-10"
                style={{ animationDuration: '35s' }} />
            <motion.div aria-hidden
                className="pointer-events-none absolute bottom-12 right-10 w-48 h-48 rounded-full border-[0.5px] border-amber-300/20 animate-spin z-10"
                style={{ animationDuration: '25s', animationDirection: 'reverse', y: y1 }} />

            <motion.div
                style={{ y: y1 }}
                className="relative text-center max-w-4xl mx-auto z-10 flex flex-col items-center"
            >
                {/* Live badge */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full px-5 py-2 text-xs text-fjord-dark font-semibold mb-8 shadow-sm hover:bg-white/80 transition-colors"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    Grunnlovens §100 — Fri ytring for alle
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="font-display font-black text-ink leading-[1.05] tracking-tight mb-8"
                    style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', textShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
                >
                    Din plass.<br />
                    <span className="relative">
                        <span className="relative z-10" style={{
                            background: 'linear-gradient(135deg, #1A1612 20%, #5B89A8 80%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Din stemme.
                        </span>
                        {/* Soft glow behind "Din stemme" */}
                        <div className="absolute -inset-x-6 -inset-y-4 bg-white/20 blur-2xl rounded-full z-0 pointer-events-none" />
                    </span>
                </motion.h1>

                {/* Value Props Row */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    className="flex flex-wrap justify-center gap-6 sm:gap-12 mb-10"
                >
                    <div className="flex items-center gap-2 text-ink-400">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">Trygt farvann</span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-400">
                        <Megaphone className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-medium">Null filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-400">
                        <HeartHandshake className="w-5 h-5 text-rose-400" />
                        <span className="text-sm font-medium">Ekte engasjement</span>
                    </div>
                </motion.div>

                {/* Single CTA */}
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.4 }}
                >
                    <MagneticButton strength={0.4}>
                        <Link href="/skriv"
                            className="group relative inline-flex items-center gap-3 px-6 py-5 rounded-3xl text-white font-bold text-base transition-all hover:scale-[1.03] active:scale-[0.97]"
                            style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))', boxShadow: '0 8px 32px rgba(168,123,142,0.25), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl mix-blend-overlay" style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }} />
                            <PenLine className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Bli hørt i dag</span>
                        </Link>
                    </MagneticButton>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 text-ink-300 text-sm font-medium animate-pulse hidden sm:block"
                >
                    Utforsk sakene under
                </motion.div>
            </motion.div>

            {/* Soft gradient fade at the bottom to blend with the card overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand/50 to-transparent z-10 pointer-events-none" />
        </section>
    );
}
