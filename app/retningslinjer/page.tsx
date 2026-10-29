'use client';

import { motion } from 'framer-motion';
import { Check, X, BookOpen } from 'lucide-react';

export default function RetningslinjerPage() {
    return (
        <main className="min-h-screen bg-sand pb-24 text-ink">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-8 sm:p-16 border border-sand-dark/40 shadow-xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/10 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6">
                        <Check className="w-3 h-3" /> Våre kjøreregler
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl font-bold mb-8">
                        Retningslinjer og <span className="text-fjord">publiseringsregler</span>
                    </h1>

                    <div className="prose prose-nordic max-w-none">
                        <p className="text-xl text-ink-400 mb-12">
                            For at Paragraf100 skal være et godt sted for alle, har vi noen enkle men viktige regler for hva som kan publiseres.
                        </p>

                        <div className="space-y-12">
                            <section>
                                <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
                                    <Check className="w-6 h-6 text-green-500" /> Hva vi oppfordrer til
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "Saklig argumentasjon",
                                        "Egne erfaringer og refleksjoner",
                                        "Kritisk tenkning og nye perspektiver",
                                        "God kildebruk og ærlighet",
                                        "Respektfull tone, selv i dyp uenighet"
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 text-ink-400 bg-sand/30 p-4 rounded-2xl border border-sand-dark/10">
                                            <span className="text-fjord font-bold">●</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h2 className="flex items-center gap-3 text-2xl font-bold mb-4 text-red-600">
                                    <X className="w-6 h-6" /> Dette godtar vi ikke
                                </h2>
                                <div className="bg-red-50 border border-red-100 rounded-3xl p-6 space-y-4">
                                    {[
                                        "Personangrep eller trakassering",
                                        "Hatefulle ytringer basert på etnisitet, religion, legning etc.",
                                        "Ulovlig innhold eller oppfordringer til lovbrudd",
                                        "Plagiat (å stjele andres tekst)",
                                        "Ren reklame eller spam"
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 text-red-800 font-medium">
                                            <span className="text-red-400">✕</span> {item}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-fjord/5 rounded-3xl p-8 border border-fjord/10">
                                <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
                                    <BookOpen className="w-6 h-6 text-fjord" /> Redaksjonell kontroll
                                </h2>
                                <p className="text-ink-400 leading-relaxed">
                                    Alle artikler som sendes inn til Paragraf100 vurderes manuelt av vår redaksjon før publisering. Vi forbeholder oss retten til å gjøre mindre språklige rettinger for å øke lesbarheten, men vil aldri endre ditt budskap uten dialog. Artikler som bryter med våre retningslinjer vil bli avvist med en kort begrunnelse.
                                </p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
