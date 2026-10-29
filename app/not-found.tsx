'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const MegaphoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            {/* ── Illustration Layer ── */}
            <div className="relative mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <div className="text-[12rem] font-black text-sand-dark/20 select-none leading-none">
                        404
                    </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -left-8 p-4 bg-white rounded-2xl shadow-xl border border-sand-dark/30 text-fjord rotate-[-12deg]"
                >
                    <MegaphoneIcon className="w-8 h-8" />
                </motion.div>

                <motion.div
                    animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -bottom-2 -right-6 p-4 bg-white rounded-2xl shadow-xl border border-sand-dark/30 text-amber rotate-[15deg]"
                >
                    <AlertIcon className="w-8 h-8" />
                </motion.div>

                {/* Abstract Line Art */}
                <svg className="absolute inset-0 -z-10 w-full h-full opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M20,100 Q60,20 100,100 T180,100"
                        fill="none"
                        stroke="var(--fjord)"
                        strokeWidth="1"
                    />
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
                        d="M40,150 Q90,180 140,150"
                        fill="none"
                        stroke="var(--fjord)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                </svg>
            </div>

            {/* ── Content ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-md"
            >
                <h1 className="font-display font-black text-3xl sm:text-4xl text-ink mb-4">
                    Beklager, ytringsfriheten har ikke kommet til denne siden ennå.
                </h1>
                <p className="text-ink-400 mb-10 leading-relaxed text-lg">
                    Siden du leter etter er enten sensurert av internett-gudene,
                    eller så har vi bare rotet bort lenken i en het debatt.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="btn-primary flex items-center gap-2 group whitespace-nowrap"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Ta meg hjem
                    </Link>
                    <Link
                        href="/kontakt"
                        className="px-6 py-3 rounded-xl border border-sand-dark/40 text-ink-400 font-medium hover:bg-white transition-all whitespace-nowrap"
                    >
                        Si ifra til oss
                    </Link>
                </div>
            </motion.div>

            {/* ── Decorative Background ── */}
            <div className="fixed inset-0 bg-canvas -z-20 opacity-40 pointer-events-none" />
        </div>
    );
}
