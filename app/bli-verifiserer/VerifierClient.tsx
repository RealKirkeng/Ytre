'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Check,
    X,
    Sparkles,
    Users,
    BookOpen,
    Clock,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Send,
    Loader2,
    HeartHandshake,
    ShieldCheck,
    FileText,
    Scale,
} from 'lucide-react';

const AwardIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
);
import { useAuth } from '@/hooks/useAuth';

export function VerifierClient() {
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [motivation, setMotivation] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            if (user.name && !name) setName(user.name);
            if (user.email && !email) setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Vennligst fyll inn navnet ditt.');
            return;
        }
        if (!email.includes('@')) {
            setError('Vennligst oppgi en gyldig e-postadresse.');
            return;
        }
        if (motivation.trim().length < 15) {
            setError('Fortell oss gjerne litt mer om hvorfor du vil bli debattvert (minst 15 tegn).');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/verifiers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, age, motivation }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Noe gikk galt under innsending.');
            } else {
                setSuccess(true);
            }
        } catch (err: any) {
            setError('Kunne ikke koble til serveren. Prøv igjen senere.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-sand pb-24 text-ink">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">

                {/* Back link */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-ink transition-colors"
                    >
                        ← Tilbake til forsiden
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-14 border border-sand-dark/40 shadow-xl overflow-hidden relative">

                    {/* Decorative Background Glows */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-fjord/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber/5 rounded-full -ml-36 -mb-36 blur-3xl pointer-events-none" />

                    <div className="relative z-10">

                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fjord/10 text-fjord text-xs font-bold uppercase tracking-wider mb-6 border border-fjord/20">
                            <Shield className="w-3.5 h-3.5" /> Ytres Førstelinje · Frivillig tillitsverv
                        </div>

                        {/* Hero Titles */}
                        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black mb-5 tracking-tight leading-tight">
                            Bli en <span className="text-fjord">debattvert</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-ink-400 font-medium mb-8 max-w-2xl leading-relaxed">
                            En verifiserer — eller <strong>debattvert</strong> — sørger for at rommet holdes rent for hets og spam, samtidig som vi åpner døren for Norges mest engasjerte og modige meninger.
                        </p>

                        {/* Concept Callout: Hvorfor debattvert? */}
                        <div className="bg-sand/40 border border-sand-dark/30 rounded-2xl p-5 sm:p-6 mb-12">
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-fjord/15 text-fjord flex items-center justify-center shrink-0 mt-0.5">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="text-sm leading-relaxed text-ink-500">
                                    <h2 className="font-bold text-ink text-base mb-1">
                                        Hvorfor kaller vi det debattvert i stedet for verifiserer?
                                    </h2>
                                    <p>
                                        Ordet «verifiserer» kan høres teknisk eller byråkratisk ut — som en robot eller en ID-sjekk.
                                        Som <strong>debattvert</strong> er du i stedet en vennlig vert for debattrommet: Du skal ikke sensurere eller rette grammatikk, men raskt ønske teksten velkommen og bekrefte at den overholder våre tre enkle kjøreregler før den går direkte ut til leserne.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: De 3 ufravikelige kjørereglene ── */}
                        <div className="mb-14">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                                    <X className="w-4 h-4" />
                                </div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                                    De 3 røde linjene: Dette skal du stoppe
                                </h2>
                            </div>
                            <p className="text-sm text-ink-400 mb-6 max-w-2xl">
                                Jobben er rask og konkret. Hvis et innlegg bryter én av disse tre, sendes det i retur eller avslås:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-5">
                                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs mb-3">
                                        1
                                    </div>
                                    <h3 className="font-bold text-red-950 text-base mb-2">Ingen direkte reklame</h3>
                                    <p className="text-xs sm:text-sm text-red-900/80 leading-relaxed">
                                        Innlegget skal være en mening eller refleksjon — ikke en salgspitch, SEO-lenking eller ren produktomtale.
                                    </p>
                                </div>

                                <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-5">
                                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs mb-3">
                                        2
                                    </div>
                                    <h3 className="font-bold text-red-950 text-base mb-2">Ingen personhets</h3>
                                    <p className="text-xs sm:text-sm text-red-900/80 leading-relaxed">
                                        Kritiser gjerne maktpersoner, ledere og ideologier knallhardt, men sjikane eller uthenging av privatpersoner aksepteres ikke.
                                    </p>
                                </div>

                                <div className="bg-red-50/60 border border-red-200/80 rounded-2xl p-5">
                                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs mb-3">
                                        3
                                    </div>
                                    <h3 className="font-bold text-red-950 text-base mb-2">Ingen hatytringer</h3>
                                    <p className="text-xs sm:text-sm text-red-900/80 leading-relaxed">
                                        Nulltoleranse for trusler, oppfordring til vold og ulovlige hatefulle ytringer i henhold til Straffelovens § 185.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Hva du IKKE skal stoppe (Takhøyde) ── */}
                        <div className="mb-14 bg-gradient-to-br from-green-50/60 to-fjord/10 border border-green-200/60 rounded-3xl p-6 sm:p-8">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                                    <Check className="w-4 h-4" />
                                </div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                                    Høyt under taket: Hva du IKKE skal stoppe
                                </h2>
                            </div>
                            <p className="text-sm text-ink-500 leading-relaxed mb-6 max-w-2xl">
                                Dette er kjernen i Ytres filosofi: Vi sensurerer aldri meninger bare fordi de er provoserende eller ubehagelige.
                            </p>

                            <div className="space-y-3.5 text-sm">
                                <div className="flex items-start gap-3 bg-white/80 p-3.5 rounded-xl border border-sand-dark/20">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                    <p className="text-ink-500">
                                        <strong className="text-ink">Uenighet er sunt:</strong> Du vil lese innlegg du er dypt uenig i politisk eller verdimessig. Så lenge teksten ikke bryter de 3 røde linjene, <strong>skal den godkjennes</strong>.
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 bg-white/80 p-3.5 rounded-xl border border-sand-dark/20">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                    <p className="text-ink-500">
                                        <strong className="text-ink">Ingen politisk sensur:</strong> Ytre er uavhengig. Venstre, høyre, radikalt eller tradisjonelt — alle unge stemmer har like stor rett til å bli hørt.
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 bg-white/80 p-3.5 rounded-xl border border-sand-dark/20">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                    <p className="text-ink-500">
                                        <strong className="text-ink">Rask sjekk på 1–2 minutter:</strong> Du skal ikke bruke tid på å rette kommafeil, grammatikk eller omskrive stilen til forfatteren. Skann kjapt og la forfatterens egen stemme skinne.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Hvordan verifisering fungerer (3:2-regelen & systemflagg) ── */}
                        <div className="mb-14 bg-white rounded-3xl border border-sand-dark/40 p-6 sm:p-8 shadow-xs">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-fjord/15 text-fjord flex items-center justify-center font-bold text-sm">
                                    <Scale className="w-4 h-4" />
                                </div>
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                                    Slik fungerer verifiseringen i praksis
                                </h2>
                            </div>
                            <p className="text-sm text-ink-400 mb-6 max-w-2xl leading-relaxed">
                                For at ingen enkeltperson skal kunne bestemme over debatten alene, bygger Ytre på demokratisk konsensus blant debattvertene kombinert med automatisk sikkerhetsskanning:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-sand/30 border border-sand-dark/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                                            3
                                        </span>
                                        <h3 className="font-bold text-ink text-sm sm:text-base">
                                            3 debattverter for publisering
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-ink-400 leading-relaxed">
                                        For at et ordinært innlegg skal gå direkte live for leserne, må <strong>3 uavhengige debattverter</strong> ha lest gjennom og godkjent at det overholder våre retningslinjer.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-sand/30 border border-sand-dark/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                                            2
                                        </span>
                                        <h3 className="font-bold text-ink text-sm sm:text-base">
                                            2 debattverter for avvisning
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-ink-400 leading-relaxed">
                                        Dersom <strong>2 debattverter</strong> vurderer at et innlegg bryter de røde linjene, blir innlegget forkastet og sendt i retur til forfatteren med begrunnelse.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-sand/30 border border-sand-dark/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-base">⚖️</span>
                                        <h3 className="font-bold text-ink text-sm sm:text-base">
                                            Uenighet går til redaksjonen
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-ink-400 leading-relaxed">
                                        Dersom det er sprikende vurderinger eller tvil mellom godkjenninger og avvisninger, rutes saken automatisk til <strong>øvrige i redaksjonen</strong>, som foretar en grundig helhetsvurdering.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-sand/30 border border-sand-dark/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-base">🛡️</span>
                                        <h3 className="font-bold text-ink text-sm sm:text-base">
                                            Automatisk risikoflagg (AI-filter)
                                        </h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-ink-400 leading-relaxed">
                                        Ytres interne systemer flagger automatisk spesifikke ord eller utsagn med forhøyet risiko. Slike innlegg krever <strong>skjerpet godkjenning fra flere debattverter</strong> og redaksjonen før de kan publiseres.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Praktiske eksempler ── */}
                        <div className="mb-14">
                            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-4">
                                Rask sjekk i praksis: Hva gjør du her?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-sand/30 border border-sand-dark/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold uppercase text-ink-300">Eksempel 1</span>
                                        <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                            ✓ Godkjenn
                                        </span>
                                    </div>
                                    <p className="text-xs text-ink-400 italic mb-2">
                                        "Karakterer i skolen bør avskaffes umiddelbart. Dagens politikere er fullstendig blinde for hvor mye stress dette påfører oss elever."
                                    </p>
                                    <p className="text-xs text-ink-500">
                                        → <strong>Godkjennes!</strong> Selv om det er en krisemakslende mening mot politikere, er det legitim samfunnskritikk uten personhets eller lovbrudd.
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-sand/30 border border-sand-dark/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold uppercase text-ink-300">Eksempel 2</span>
                                        <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                            ✕ Avvis
                                        </span>
                                    </div>
                                    <p className="text-xs text-ink-400 italic mb-2">
                                        "Rektor Jan Hansen ved min skole er en udugelig idiot og alle hater ham personlig. Kjøp forresten hettegenserne våre her: link.no"
                                    </p>
                                    <p className="text-xs text-ink-500">
                                        → <strong>Avvises!</strong> Både direkte sjikane av en enkeltperson og reklame/salg.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Fordeler ved å være debattvert ── */}
                        <div className="mb-14">
                            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink mb-6">
                                Hvorfor bli debattvert?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-5 rounded-2xl bg-white border border-sand-dark/40 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-fjord/10 text-fjord flex items-center justify-center mb-3">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-sm text-ink mb-1.5">Førsteleser</h3>
                                    <p className="text-xs text-ink-400 leading-relaxed">
                                        Du er den første som leser nye saker før de publiseres for hele landet.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-white border border-sand-dark/40 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-amber/15 text-amber-700 flex items-center justify-center mb-3">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-sm text-ink mb-1.5">Profil-merke</h3>
                                    <p className="text-xs text-ink-400 leading-relaxed">
                                        Få et eksklusivt verifisert debattvert-merke synlig på din profil.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-white border border-sand-dark/40 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3">
                                        <HeartHandshake className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-sm text-ink mb-1.5">Påvirk klimaet</h3>
                                    <p className="text-xs text-ink-400 leading-relaxed">
                                        Vær med å sikre at unge tør å delta i samfunnsdebatten uten frykt.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-white border border-sand-dark/40 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-sm text-ink mb-1.5">Attest for CV</h3>
                                    <p className="text-xs text-ink-400 leading-relaxed">
                                        Få offisiell attest fra Ytre for redaksjonelt samfunnsansvar og tillitsverv.
                                    </p>
                                </div>
                            </div>

                            {/* ── Section: Bevis på innsats og CV-attest ── */}
                            <div className="mt-6 bg-gradient-to-br from-indigo-50/70 to-sand/60 border border-indigo-200/60 rounded-3xl p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                            <AwardIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-bold text-lg text-ink">
                                                Verifisert bevis og dokumentasjon på din innsats
                                            </h3>
                                            <p className="text-xs text-ink-400">
                                                Full innsikt i ditt frivillige samfunnsengasjement
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 w-fit">
                                        <FileText className="w-3.5 h-3.5" /> Offisiell Ytre-attest
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-ink-500 leading-relaxed mb-6">
                                    Som debattvert hos Ytre utfører du et viktig samfunnsoppdrag. Derfor sørger vi for at din innsats blir nøyaktig registrert og dokumentert:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                    <div className="p-4 bg-white rounded-2xl border border-sand-dark/30 shadow-xs">
                                        <p className="text-[11px] font-bold text-ink-300 uppercase tracking-wider mb-1">
                                            Artikler håndtert
                                        </p>
                                        <p className="font-display text-2xl font-black text-fjord">
                                            Sanntidsstatistikk
                                        </p>
                                        <p className="text-xs text-ink-400 mt-1">
                                            Se nøyaktig hvor mange innlegg du har lest og vurdert i din profil.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-white rounded-2xl border border-sand-dark/30 shadow-xs">
                                        <p className="text-[11px] font-bold text-ink-300 uppercase tracking-wider mb-1">
                                            Aktiv periode
                                        </p>
                                        <p className="font-display text-2xl font-black text-ink">
                                            Tidsstempel
                                        </p>
                                        <p className="text-xs text-ink-400 mt-1">
                                            Oversikt over dato du startet og hvor lenge du har bidratt som debattvert.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-white rounded-2xl border border-sand-dark/30 shadow-xs">
                                        <p className="text-[11px] font-bold text-ink-300 uppercase tracking-wider mb-1">
                                            Attest for CV & studier
                                        </p>
                                        <p className="font-display text-2xl font-black text-indigo-700">
                                            Digitalt bevis
                                        </p>
                                        <p className="text-xs text-ink-400 mt-1">
                                            Få en formell attest signert av Ytres redaksjon som bekrefter ditt tillitsverv.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Section: Tillitskrav & Fratrekk av status ── */}
                        <div className="mb-14 bg-amber-50/70 border border-amber-300/80 rounded-3xl p-6 sm:p-8">
                            <div className="flex items-start gap-3.5 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-lg text-amber-950">
                                        Tillitskrav: Når kan debattvert-statusen fratrekkes?
                                    </h3>
                                    <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                                        Rollen som debattvert er et tillitsverv som krever objektivitet og ansvar. For å sikre at Ytre forblir en trygg og samtidig fri debattarena, gjelder følgende kvalitetskrav:
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
                                <div className="p-4 bg-white/80 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-amber-950">
                                    <p className="font-bold text-red-700 flex items-center gap-1.5 mb-1.5">
                                        <span>✕</span> Å slippe gjennom rødlinje-forhold
                                    </p>
                                    <p className="text-xs text-amber-900/80 leading-relaxed">
                                        Gjentatte ganger å godkjenne innlegg som åpenbart bryter de 3 røde linjene (hets, hatytringer etter Straffeloven § 185, ulovlig innhold eller ren reklame).
                                    </p>
                                </div>

                                <div className="p-4 bg-white/80 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-amber-950">
                                    <p className="font-bold text-red-700 flex items-center gap-1.5 mb-1.5">
                                        <span>✕</span> Gjentatt uberettiget avvisning
                                    </p>
                                    <p className="text-xs text-amber-900/80 leading-relaxed">
                                        Gjentatte ganger å avvise legitime innlegg og ytringer som overholder regelverket (f.eks. på grunn av personlig uenighet i forfatterens politiske synspunkt).
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 bg-amber-100/70 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                                <strong>Konsekvens:</strong> Ved gjentatte brudd på disse prinsippene vil tilliten opphøre, og ens status som debattvert vil <strong>fratrekkes umiddelbart</strong> av redaksjonen for å beskytte både ytringsfriheten og debattklimaet.
                            </div>
                        </div>

                        {/* ── Section: Søknadsskjema ── */}
                        <div id="sok" className="bg-sand/30 border border-sand-dark/40 rounded-3xl p-6 sm:p-10">
                            <div className="max-w-xl mx-auto">
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-fjord/15 text-fjord flex items-center justify-center mx-auto mb-3">
                                        <Send className="w-5 h-5" />
                                    </div>
                                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-2">
                                        Meld din interesse
                                    </h2>
                                    <p className="text-xs sm:text-sm text-ink-400">
                                        Det kreves ingen forkunnskaper — bare et ønske om å holde debatten åpen og hetsfri.
                                    </p>
                                </div>

                                {success ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center text-green-800"
                                    >
                                        <div className="text-4xl mb-2">🎉</div>
                                        <h3 className="font-bold text-lg mb-1">Tusen takk, {name}!</h3>
                                        <p className="text-xs sm:text-sm text-green-700 leading-relaxed mb-4">
                                            Vi har mottatt søknaden din om å bli debattvert. Redaksjonen tar kontakt med deg på <strong>{email}</strong> innen kort tid med mer informasjon.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setSuccess(false)}
                                            className="text-xs text-green-800 underline hover:no-underline font-medium"
                                        >
                                            Send en ny henvendelse
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {error && (
                                            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
                                                    Ditt navn *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    placeholder="F.eks. Kari Nordmann"
                                                    className="input-nordic w-full text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
                                                    Alder (valgfritt)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={age}
                                                    onChange={e => setAge(e.target.value)}
                                                    placeholder="F.eks. 19 år"
                                                    className="input-nordic w-full text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
                                                E-postadresse *
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="din@epost.no"
                                                className="input-nordic w-full text-sm"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
                                                Hvorfor vil du bli debattvert? *
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={motivation}
                                                onChange={e => setMotivation(e.target.value)}
                                                placeholder="Skriv 2–3 setninger om deg selv og hvorfor du ønsker å bidra..."
                                                className="input-nordic w-full text-sm resize-none"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-98 disabled:opacity-60 shadow-md cursor-pointer"
                                            style={{
                                                background: 'linear-gradient(135deg,#5B89A8,#A87B8E)',
                                                boxShadow: '0 4px 16px rgba(91, 137, 168, 0.25)',
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Sender inn...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-4 h-4" />
                                                    <span>Meld interesse som debattvert</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
