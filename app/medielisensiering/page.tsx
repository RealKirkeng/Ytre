import type { Metadata } from 'next';
import { Check, BookOpen, PenLine, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Medielisensiering | Ytre',
    description: 'Oppdag og videredistribuer unge stemmer og kronikker til etablerte mediehus.',
};

export default function LicensingPage() {
    return (
        <main className="min-h-screen bg-sand pb-24 text-ink">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-16 border border-sand-dark/40 shadow-xl overflow-hidden relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-fjord/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber/5 rounded-full -ml-36 -mb-36 blur-3xl" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fjord/10 text-fjord text-xs font-bold uppercase tracking-widest mb-6 border border-fjord/20">
                            <Check className="w-3.5 h-3.5" /> Konsept: Medielisensiering
                        </div>

                        <h1 className="font-display text-3xl sm:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                            Oppdag de neste store <span className="text-fjord">stemmene</span>.
                        </h1>

                        <p className="text-lg sm:text-xl text-ink-400 mb-10 sm:mb-12 max-w-2xl leading-relaxed">
                            Ytre er en rugekasse for unge talenter. Nå gjør vi det enklere for etablerte mediehus å hente friskt innhold og nye perspektiver direkte fra vår plattform.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
                            <div className="bg-sand/30 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-sand-dark/20 backdrop-blur-sm">
                                <PenLine className="w-10 h-10 text-fjord mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold mb-3">Førstemann til mølla</h3>
                                <p className="text-ink-400 leading-relaxed text-sm sm:text-base">
                                    Når en skribent huker av for lisensiering, kan eksterne mediehus søke om rettighetene til å publisere artikkelen på sine egne plattformer. Vi praktiserer et rettferdig prinsipp der det mediehuset som først inngår avtale, får eksklusivitet på videredistribusjon.
                                </p>
                            </div>
                            <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-sand-dark/40 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <BookOpen className="w-24 h-24" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-3">Slik fungerer det</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Se etter 'Lisensierbar'-merket på artikler",
                                        "Kontakt oss via knappen nedenfor",
                                        "Vi fasiliterer kontakt mellom mediehus og skribent",
                                        "Artikkelen forblir på Ytre"
                                    ].map((step, i) => (
                                        <li key={i} className="flex items-center gap-3 text-ink-400 font-medium text-sm sm:text-base">
                                            <div className="w-6 h-6 rounded-full bg-fjord/10 text-fjord flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-fjord text-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-14 text-center shadow-fjord/20 shadow-2xl">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Vil ditt mediehus ha tilgang?</h2>
                            <p className="text-base sm:text-lg opacity-90 mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
                                Vi er i en tidlig fase og ønsker kontakt med redaktører og journalister som ser verdien i å løfte frem unge stemmer.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="mailto:kontakt@ytre.no" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-fjord rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl">
                                    <Users className="w-5 h-5" /> Send oss en e-post
                                </a>
                                <Link href="/kontakt" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-md">
                                    Kontakt-skjema
                                </Link>
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <p className="text-xs text-ink-200 uppercase tracking-widest font-bold mb-8">Samarbeid med</p>
                            <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale items-center">
                                <span className="font-display font-black text-2xl italic">AVISEN</span>
                                <span className="font-bold text-xl tracking-tighter italic">MAGASINET</span>
                                <span className="text-2xl font-serif">Dagspressen</span>
                                <span className="font-black text-3xl tracking-widest">NYTT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
