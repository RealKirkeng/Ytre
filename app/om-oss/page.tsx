import type { Metadata } from 'next';
import { Check, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Om oss | Ytre',
    description: 'En lavterskel-plattform for unge stemmer. Les om visjonen og historien bak Ytre.',
};

export default function OmOssPage() {
    return (
        <main className="min-h-screen bg-sand pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-16 border border-sand-dark/40 shadow-xl overflow-hidden relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-fjord/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber/5 rounded-full -ml-24 -mb-24 blur-3xl animate-pulse" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber/10 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6">
                            <Check className="w-3 h-3" /> Våre kjøreregler
                        </div>

                        <h1 className="font-display text-3xl sm:text-6xl font-bold text-ink mb-6 sm:mb-8 leading-tight">
                            En lavterskel-plattform for <span className="text-fjord">unge stemmer</span>.
                        </h1>

                        <div className="space-y-6 text-base sm:text-lg text-ink-400 leading-relaxed">
                            <p>
                                Ytre ble skapt med én overordnet visjon: å gi ungdom og unge voksne en seriøs, men tilgjengelig arena for samfunnsdebatt. I et medielandskap som ofte føles lukket eller dominert av etablerte stemmer, ønsker vi å være den første døren som åpner seg.
                            </p>

                            <p>
                                Visjonen vår er forankret i Grunnlovens § 100 — paragrafen som sikrer ytringsfrihet i Norge. Vi mener at ytringsfrihet ikke bare handler om retten til å snakke, men om å ha et sted å bli hørt.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                            {[
                                {
                                    icon: Check,
                                    title: "Trygghet",
                                    desc: "Vi modererer innhold for å sikre en saklig debatt uten personangrep."
                                },
                                {
                                    icon: Check,
                                    title: "Mangfold",
                                    desc: "Alle perspektiver er velkomne, så lenge de holder seg innenfor våre regler."
                                },
                                {
                                    icon: BookOpen,
                                    title: "Fremtiden",
                                    desc: "Vi hjelper unge skribenter med å nå ut til et større publikum og etablerte medier."
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-sand/40 p-6 rounded-3xl border border-sand-dark/20">
                                    <item.icon className="w-8 h-8 text-fjord mb-4" />
                                    <h3 className="font-bold text-ink mb-2">{item.title}</h3>
                                    <p className="text-sm text-ink-300">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
