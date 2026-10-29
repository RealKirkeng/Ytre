import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Shield,
    BookOpen,
    Check,
    AlertTriangle,
    Sparkles,
    ArrowLeft,
    Mail,
    Scale,
    FileText,
    ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Juridisk informasjon og ansvarsfraskrivelse | Ytre',
    description: 'Ytres juridiske rammeverk: Norsk lovgivning, ytringsfrihet etter Grunnloven § 100, ehandelsloven, åndsverkloven, forbehold om kunstig intelligens (KI) og tjenesteyterinformasjon.',
};

export default function JuridiskPage() {
    return (
        <main className="min-h-screen bg-sand pb-24 text-ink">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">

                {/* Back link */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-ink-400 hover:text-ink transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Tilbake til forsiden
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-14 border border-sand-dark/40 shadow-xl overflow-hidden relative">

                    {/* Decorative Background Orbs */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-fjord/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber/5 rounded-full -ml-36 -mb-36 blur-3xl pointer-events-none" />

                    <div className="relative z-10">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fjord/10 text-fjord text-xs font-bold uppercase tracking-wider mb-6 border border-fjord/20">
                            <Scale className="w-3.5 h-3.5" /> Norsk Lovverk · Rammebetingelser · KI-Transparens
                        </div>

                        {/* Title */}
                        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight">
                            Juridisk <span className="text-fjord">informasjon</span>
                        </h1>
                        <p className="text-base sm:text-lg text-ink-400 font-medium mb-10 max-w-2xl leading-relaxed">
                            Ytre er en uavhengig norsk debattplattform bygget for unge stemmer. Plattformen opererer i full overensstemmelse med norsk rett, herunder Grunnloven, ehandelsloven, medieansvarsloven, personopplysningsloven (GDPR) og åndsverkloven.
                        </p>

                        <div className="border-t border-sand-dark/30 my-8" />

                        {/* ── 1. Lovvalg, jurisdiksjon og Grunnloven § 100 ── */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-fjord/10 text-fjord flex items-center justify-center font-bold text-sm shrink-0">
                                    1
                                </div>
                                <h2 className="font-display text-2xl font-bold text-ink">
                                    Lovvalg, jurisdiksjon og Grunnlovens § 100
                                </h2>
                            </div>

                            <div className="space-y-4 text-sm sm:text-base text-ink-500 leading-relaxed pl-0 sm:pl-11">
                                <p>
                                    All virksomhet på og i tilknytning til Ytre (nettadressen ytre.no med tilhørende tjenester) er underlagt <strong>norsk lovgivning</strong>. Eventuelle rettstvister som måtte oppstå mellom brukere og plattformen skal søkes løst ved forhandlinger, og er underlagt ordinære norske domstoler med Oslo tingrett som rett verneting.
                                </p>
                                <p>
                                    Plattformens overordnede eksistensberettigelse er forankret i <strong>Grunnlovens § 100</strong>, som fastslår at <em>«Ytringsfrihet bør finne sted»</em>. Ytre ble skapt for å styrke samfunnsdebatten blant unge gjennom de tre grunnleggende formålene i Grunnloven:
                                </p>
                                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                                    <li className="bg-sand/30 p-3.5 rounded-xl border border-sand-dark/20 text-xs sm:text-sm">
                                        <strong className="block text-ink mb-1">🔍 Sannhetssøking</strong>
                                        Åpen konfrontasjon mellom motstridende synspunkter.
                                    </li>
                                    <li className="bg-sand/30 p-3.5 rounded-xl border border-sand-dark/20 text-xs sm:text-sm">
                                        <strong className="block text-ink mb-1">🏛️ Demokrati</strong>
                                        Aktiv deltakelse i offentlige samtaler og beslutninger.
                                    </li>
                                    <li className="bg-sand/30 p-3.5 rounded-xl border border-sand-dark/20 text-xs sm:text-sm">
                                        <strong className="block text-ink mb-1">🌱 Fri meningsdannelse</strong>
                                        Rom for å teste ut, utvikle og endre egne tanker.
                                    </li>
                                </ul>
                                <div className="p-4 rounded-2xl bg-amber/10 border border-amber/30 text-amber-900 text-xs sm:text-sm">
                                    <strong>Ufravikelige rettslige skranker:</strong> Ytringsfriheten etter norsk rett er ikke absolutt. Ytre tillater ikke ytringer som bryter norsk straffelov, herunder hatefulle ytringer (Straffeloven § 185), trusler (§§ 263/264), krenkelse av privatlivets fred (§ 267) eller oppfordring til straffbare handlinger.
                                </div>
                            </div>
                        </section>

                        {/* ── 2. Plattformansvar, vertstjenester & Notice-and-Takedown ── */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-fjord/10 text-fjord flex items-center justify-center font-bold text-sm shrink-0">
                                    2
                                </div>
                                <h2 className="font-display text-2xl font-bold text-ink">
                                    Plattformansvar, vertstjenester og Notice-and-Takedown
                                </h2>
                            </div>

                            <div className="space-y-4 text-sm sm:text-base text-ink-500 leading-relaxed pl-0 sm:pl-11">
                                <p>
                                    Ytre er en digital plattform for formidling og lagring av brukergenerert innhold i henhold til <strong>lov om elektronisk handel (ehandelsloven) § 18</strong> (vertstjenester / hosting) og <strong>medieansvarsloven § 17</strong>.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-sand-dark/30 shadow-sm">
                                        <Check className="w-5 h-5 text-fjord shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="text-ink block mb-0.5">Personlig forfatteransvar:</strong>
                                            Den enkelte bruker bærer selv det primære juridiske, erstatningsrettslige og strafferettslige ansvaret for innhold, innlegg, kommentarer, påstander og media de publiserer.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-sand-dark/30 shadow-sm">
                                        <Check className="w-5 h-5 text-fjord shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="text-ink block mb-0.5">Notice-and-Takedown prosedyre:</strong>
                                            I samsvar med ehandelsloven § 18 forplikter Ytre seg til å handle umiddelbart (uten ugrunnet opphold) for å fjerne eller sperre tilgangen til innhold dersom vi mottar varsel om, eller får faktisk kjennskap til, at innholdet er ulovlig.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-sand-dark/30 shadow-sm">
                                        <Check className="w-5 h-5 text-fjord shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="text-ink block mb-0.5">Forhåndssjekk av innlegg:</strong>
                                            Hovedinnlegg gjennomgår en lett forhåndsverifisering av våre debattverter mot reklame, hets og lovbrudd før visning, mens kommentarfelter ettermodereres.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── 3. Forbehold om Kunstig Intelligens (AI Disclaimer) ── */}
                        <section className="mb-12 bg-gradient-to-br from-sand/50 via-white to-fjord/5 p-6 sm:p-8 rounded-3xl border border-fjord/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-fjord text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    3
                                </div>
                                <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-fjord" />
                                    Bruk av Kunstig Intelligens (KI / AI) og Ansvarsfraskrivelse
                                </h2>
                            </div>

                            <div className="space-y-4 text-sm sm:text-base text-ink-500 leading-relaxed">
                                <p>
                                    I tråd med prinsippene for transparens etter EUs KI-forordning (<strong>EU AI Act</strong>) og norsk forbrukerlovgivning, opplyses følgende om plattformens utvikling og drift:
                                </p>
                                <div className="space-y-3.5">
                                    <div className="p-4 rounded-2xl bg-white border border-sand-dark/30">
                                        <strong className="text-ink block text-sm mb-1">🤖 1. AI-assistert utvikling og kodeskaping</strong>
                                        <p className="text-xs sm:text-sm text-ink-400">
                                            Ytres nettside, kildekode, arkitektur, grensesnitt og tekniske komponenter er helt eller delvis utviklet og forbedret ved hjelp av avanserte verktøy for kunstig intelligens (KI / store språkmodeller / agentiske kodeassistenter). 
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-sand-dark/30">
                                        <strong className="text-ink block text-sm mb-1">⚙️ 2. «Som den er»-forbehold (As-Is)</strong>
                                        <p className="text-xs sm:text-sm text-ink-400">
                                            Tekniske funksjoner, automatiserte estimater (som beregnet lesetid), søkeresultater og eventuelle fremtidige AI-assisterte verktøy på plattformen leveres «som de er» og «som tilgjengelig». Ytre gir ingen eksplisitte eller underforståtte garantier for at AI-assistert kode eller funksjonalitet til enhver tid er fri for uforutsette feil, driftsavbrudd eller unøyaktigheter.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-sand-dark/30">
                                        <strong className="text-ink block text-sm mb-1">⚖️ 3. Ingen erstatning for faglig eller juridisk rådgivning</strong>
                                        <p className="text-xs sm:text-sm text-ink-400">
                                            Verken artikler, kommentarer, AI-oppsummeringer eller annet innhold på Ytre skal under noen omstendighet tolkes som juridisk, medisinsk, finansiell eller annen profesjonell rådgivning. Brukere oppfordres alltid til å gjøre selvstendige undersøkelser og søke kvalifisert råd ved behov.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-sand-dark/30">
                                        <strong className="text-ink block text-sm mb-1">✍️ 4. Brukeres eventuelle bruk av AI ved tekstskriving</strong>
                                        <p className="text-xs sm:text-sm text-ink-400">
                                            Dersom en bruker anvender generative språkmodeller (som ChatGPT eller tilsvarende) som hjelpemiddel ved utforming av et innlegg, bærer forfatteren like fullt det fulle personlige ansvaret for tekstens innhold, korrekthet og kildeopphav.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-white border border-sand-dark/30">
                                        <strong className="text-ink block text-sm mb-1">🛡️ 5. Ansvarsbegrensning for følgetap</strong>
                                        <p className="text-xs sm:text-sm text-ink-400">
                                            I den grad ufravikelig norsk rett tillater det (jf. avtaleloven § 36), fraskriver Ytre og plattformens eiere seg ethvert ansvar for direkte eller indirekte tap, skader eller følgevirkninger som måtte oppstå som følge av bruk av nettsiden, nedetid eller tillit til AI-genererte eller AI-assisterte elementer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── 4. Opphavsrett og Åndsverkloven ── */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-fjord/10 text-fjord flex items-center justify-center font-bold text-sm shrink-0">
                                    4
                                </div>
                                <h2 className="font-display text-2xl font-bold text-ink">
                                    Opphavsrett og Åndsverkloven
                                </h2>
                            </div>

                            <div className="space-y-4 text-sm sm:text-base text-ink-500 leading-relaxed pl-0 sm:pl-11">
                                <p>
                                    Alt åndsverk som publiseres på Ytre er beskyttet i henhold til <strong>lov om opphavsrett til åndsverk mv. (åndsverkloven)</strong>:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                                    <li><strong>Forfatterens eierskap:</strong> Du beholder all opphavsrett til artikler og tekster du selv har forfattet. Ved innsending gir du Ytre en vederlagsfri, ikke-eksklusiv og global lisens til å tilgjengeliggjøre, vise og arkivere innholdet på plattformen.</li>
                                    <li><strong>Bilder og mediefiler:</strong> Innsender plikter å ha nødvendige rettigheter og tillatelser til alle fotografier, illustrasjoner eller videoer som lastes opp. Fotografens navn skal krediteres i tråd med god skikk (åndsverkloven § 23 og § 3). Uautorisert bruk av opphavsrettsbeskyttet bildemateriale medfører personlig erstatningsansvar for innsender.</li>
                                    <li><strong>Sitat- og refererett:</strong> Sitering fra artikler på Ytre er tillatt i samsvar med god skikk og i den utstrekning formålet betinger (åndsverkloven § 29), forutsatt at kilde og opprinnelig forfatter oppgis tydelig.</li>
                                </ul>
                            </div>
                        </section>

                        {/* ── 5. Markedsføringsloven og merking av sponsing ── */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-fjord/10 text-fjord flex items-center justify-center font-bold text-sm shrink-0">
                                    5
                                </div>
                                <h2 className="font-display text-2xl font-bold text-ink">
                                    Markedsføringsloven og forbud mot skjult reklame
                                </h2>
                            </div>

                            <div className="space-y-4 text-sm sm:text-base text-ink-500 leading-relaxed pl-0 sm:pl-11">
                                <p>
                                    I overensstemmelse med <strong>markedsføringsloven § 3</strong> skal all markedsføring utformes og presenteres slik at den tydelig fremstår som markedsføring:
                                </p>
                                <p>
                                    Ytre tillater ikke skjult reklame, affiliate-lenker eller betalte innlegg som fremstår som redaksjonelle meningsytringer. Eventuelle sponsorsamarbeid eller annonseflater på nettsiden merkes eksplisitt med «Sponset innhold» eller «Annonse».
                                </p>
                            </div>
                        </section>

                        {/* ── 6. Tjenesteyterinformasjon (Ehandelsloven § 8 / Impressum) ── */}
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-fjord/10 text-fjord flex items-center justify-center font-bold text-sm shrink-0">
                                    6
                                </div>
                                <h2 className="font-display text-2xl font-bold text-ink">
                                    Tjenesteyterinformasjon (Ehandelsloven § 8)
                                </h2>
                            </div>

                            <div className="pl-0 sm:pl-11">
                                <p className="text-sm sm:text-base text-ink-500 mb-4">
                                    I henhold til opplysningsplikten i ehandelsloven § 8 oppgis følgende offisielle informasjon om tjenesteyteren:
                                </p>
                                <div className="bg-sand/30 border border-sand-dark/30 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-xs font-semibold text-ink-300 uppercase block mb-1">Tjenestenavn</span>
                                        <span className="font-bold text-ink">Ytre (ytre.no)</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-ink-300 uppercase block mb-1">Jurisdiksjon og etablering</span>
                                        <span className="font-bold text-ink">Norge</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-ink-300 uppercase block mb-1">Generell kontakt</span>
                                        <span className="font-semibold text-fjord">kontakt@ytre.no</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-ink-300 uppercase block mb-1">Juridisk kontakt & varsling</span>
                                        <span className="font-semibold text-fjord">juridisk@ytre.no / varsle@ytre.no</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-ink-300 uppercase block mb-1">Organisasjonsform / registrering</span>
                                        <span className="text-ink font-medium">Registrert i Enhetsregisteret (under etablering)</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-ink-300 uppercase block mb-1">Geografisk adresse</span>
                                        <span className="text-ink font-medium">Oslo, Norge</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── 7. Varsling om ulovlig innhold (Notice-and-Takedown) ── */}
                        <section className="bg-sand/20 border border-sand-dark/40 rounded-3xl p-6 sm:p-8">
                            <div className="flex items-center gap-2.5 mb-3 text-fjord">
                                <Mail className="w-5 h-5" />
                                <h2 className="font-display text-xl font-bold text-ink">
                                    Slik varsler du om ulovlig eller krenkende innhold
                                </h2>
                            </div>
                            <p className="text-sm text-ink-500 leading-relaxed mb-4">
                                Dersom du oppdager innhold på Ytre som du mener krenker opphavsrett, privatlivets fred, inneholder hatefulle ytringer eller på annen måte strider mot norsk lov, ber vi deg sende en henvendelse umiddelbart til:
                            </p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <a
                                    href="mailto:varsle@ytre.no?subject=Varsel%20om%20ulovlig%20innhold%20p%C3%A5%20Ytre"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fjord text-white font-semibold text-sm hover:brightness-110 transition-all shadow-sm"
                                >
                                    <Mail className="w-4 h-4" /> Send varsel til varsle@ytre.no
                                </a>
                                <Link
                                    href="/kontakt"
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-sand-dark/50 text-ink text-sm font-medium hover:bg-white transition-all"
                                >
                                    Gå til kontaktskjema →
                                </Link>
                            </div>
                            <p className="text-xs text-ink-300 mt-4">
                                Oppgi gjerne lenke til innlegget, hva overtrampet består i, og eventuell dokumentasjon for raskest mulig behandling. Henvendelser behandles normalt innen 24 timer.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}
