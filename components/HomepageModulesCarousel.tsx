'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HotArticlesCarousel } from './HotArticlesCarousel';
import { Post } from './ArticleCard';
import { BookOpen, Megaphone } from 'lucide-react';
import Link from 'next/link';

function Paragraf100Module() {
    return (
        <div className="w-full py-6 sm:py-8 md:py-10 px-4 sm:px-10 md:px-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10 h-full">
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-fjord/10 text-fjord shadow-sm border border-fjord/20 backdrop-blur-sm shrink-0">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h2 className="font-display text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
                            Grunnloven § 100
                        </h2>
                        <p className="text-ink-400 font-medium mt-0.5 text-xs">Fundamentet for plattformen vår</p>
                    </div>
                </div>

                <blockquote className="text-base sm:text-2xl font-serif text-ink leading-relaxed border-l-4 border-fjord/40 pl-4 sm:pl-6 my-3 sm:my-4 italic">
                    "Ytringsfrihet bør finne sted. Ingen kan holdes rettslig ansvarlig for å ha meddelt eller mottatt opplysninger, ideer og budskap..."
                </blockquote>

                <p className="text-ink-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                    Demokratiet vårt krever åpne rom hvor ideer kan brytes. Ytre ble bygget for å sikre at unge stemmer har en ufiltrert, trygg plattform for å dele sine perspektiver på morgendagens samfunn.
                </p>

                <div className="mt-5 sm:mt-6 md:mt-8">
                    <Link href="/om-oss" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-sand hover:bg-sand-dark text-ink text-xs sm:text-sm font-bold transition-colors">
                        Les mer om visjonen vår →
                    </Link>
                </div>
            </div>

            <div className="w-full md:w-1/3 flex justify-center items-center py-4 md:py-0 hidden sm:flex">
                <div className="relative w-40 h-56 sm:w-48 sm:h-64 bg-gradient-to-br from-sand to-sand-dark rounded-2xl shadow-md border border-sand-dark/50 flex items-center justify-center transform rotate-3 hover:rotate-6 transition-all duration-500">
                    <div className="absolute inset-2 border-2 border-dashed border-ink/10 rounded-xl" />
                    <div className="text-center">
                        <span className="text-5xl sm:text-6xl text-fjord/80 font-serif">§</span>
                        <div className="text-xl sm:text-2xl font-black text-ink mt-2">100</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BliHortModule() {
    return (
        <div className="w-full py-6 sm:py-8 md:py-10 px-4 sm:px-10 md:px-12 flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10 h-full">
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-green-100/80 text-green-600 shadow-sm border border-green-200/50 backdrop-blur-sm shrink-0">
                        <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h2 className="font-display text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
                            Har du noe på hjertet?
                        </h2>
                        <p className="text-ink-400 font-medium mt-0.5 text-xs">Din stemme er viktigere enn du tror</p>
                    </div>
                </div>

                <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-ink mb-3 sm:mb-6 tracking-tight leading-tight">
                    Samfunnet styres av de som tør å <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">heve stemmen.</span>
                </h3>

                <p className="text-ink-400 text-xs sm:text-base leading-relaxed max-w-xl mb-5 sm:mb-8">
                    Om det gjelder fraværsgrensa på skolen, en kjip nyhetssak, eller global klimapolitikk – din mening er med på å definere fremtiden. Våg å dele den i dag.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
                    <Link href="/skriv" className="inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-ink text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-all">
                        Skriv et innlegg ✍️
                    </Link>
                    <Link href="/send-video" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-sand hover:bg-sand-dark text-ink text-xs sm:text-sm font-bold transition-all">
                        Send inn video 🎬
                    </Link>
                </div>
            </div>

            <div className="w-full md:w-1/3 justify-center items-center py-4 md:py-0 hidden sm:flex">
                <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full bg-gradient-to-tr from-green-100 to-teal-50 border-4 border-white shadow-[0_10px_30px_rgba(20,184,166,0.15)] flex items-center justify-center relative overflow-hidden group">
                    <span className="text-6xl sm:text-8xl lg:text-9xl drop-shadow-md relative z-10 group-hover:scale-110 transition-transform duration-500">💡</span>
                </div>
            </div>
        </div>
    );
}

export function HomepageModulesCarousel({ posts }: { posts: Post[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const modules = [
        {
            id: 'trending',
            content: <HotArticlesCarousel posts={posts} />
        },
        {
            id: 'paragraf100',
            content: <Paragraf100Module />
        },
        {
            id: 'bli-hort',
            content: <BliHortModule />
        }
    ];

    const nextModule = () => setActiveIndex((prev) => (prev + 1) % modules.length);
    const prevModule = () => setActiveIndex((prev) => (prev - 1 + modules.length) % modules.length);

    // Optional Auto-play logic
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         nextModule();
    //     }, 10000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className="relative w-full mb-8 group/modules">

            {/* Main Carousel Boundary Box */}
            <div className="relative w-full overflow-hidden bg-white rounded-[2rem] sm:rounded-[3rem] border border-sand-dark/20 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[350px] flex items-center">

                {/* Shared Subtle Flame/Warm Background */}
                <div className="absolute inset-0 z-0 pointer-events-none rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes flameBreath {
                            0%, 100% { opacity: 0.05; transform: scale(1) translateY(0); }
                            50% { opacity: 0.15; transform: scale(1.05) translateY(-5px); }
                        }
                        .animate-flame {
                            animation: flameBreath 6s ease-in-out infinite;
                        }
                    `}} />
                    <div className="w-full h-full relative">
                        {/* The animated flame glow inside the box */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-full rounded-[100%] bg-gradient-to-t from-orange-500/20 to-orange-200/5 blur-[80px] animate-flame"></div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="relative z-10 w-full h-full"
                    >
                        {modules[activeIndex].content}
                    </motion.div>
                </AnimatePresence>

                {/* Left/Right controls */}
                <button
                    onClick={prevModule}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur shadow-md border border-sand-dark/30 flex items-center justify-center text-ink-400 hover:text-ink hover:scale-105 transition-all z-20 opacity-80 sm:opacity-0 sm:group-hover/modules:opacity-100 focus:opacity-100 disabled:opacity-0"
                    aria-label="Tidligere modul"
                >
                    <span className="text-base sm:text-lg leading-none font-bold mr-[2px]">←</span>
                </button>
                <button
                    onClick={nextModule}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur shadow-md border border-sand-dark/30 flex items-center justify-center text-ink-400 hover:text-ink hover:scale-105 transition-all z-20 opacity-80 sm:opacity-0 sm:group-hover/modules:opacity-100 focus:opacity-100 disabled:opacity-0"
                    aria-label="Neste modul"
                >
                    <span className="text-base sm:text-lg leading-none font-bold ml-[2px]">→</span>
                </button>
            </div>

            {/* Pagination Dots beneath */}
            <div className="flex items-center justify-center gap-2.5 mt-4">
                {modules.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-6 bg-fjord pointer-events-none' : 'w-2 bg-sand-dark/60 hover:bg-fjord/50 hover:scale-125'}`}
                        aria-label={`Gå til modul ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
