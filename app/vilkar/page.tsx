import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Vilkår for bruk | Ytre',
    description: 'Brukervilkår og retningslinjer for Ytre. Les mer om våre regler for ytringsfrihet, debatt og publisering.',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-sand px-4 pt-20 sm:pt-24 pb-16">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-sand-dark/20 p-6 sm:p-16">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink transition-colors mb-8 sm:mb-12">
                    <ArrowLeft className="w-4 h-4" /> Tilbake til forsiden
                </Link>

                <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink mb-4 sm:mb-6">Vilkår for bruk</h1>
                <p className="text-base sm:text-lg text-ink-400 mb-8 sm:mb-12">Sist oppdatert: 1. mars 2026</p>

                <div className="prose prose-fjord max-w-none text-ink-500 space-y-8">
                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">1. Aksept av vilkår</h2>
                        <p>
                            Ved å opprette en brukerkonto, sende inn innhold, eller lese artikler på Ytre ("Tjenesten"), godtar du disse brukervilkårene i sin helhet. Ytre eies og drives i Norge og forholder seg til norsk lovgivning for medievirksomhet og ytringsfrihet, herunder Grunnlovens § 100 og ehandelsloven. Fullstendig oversikt over lovverk og ansvarsforbehold finner du på vår <Link href="/juridisk" className="text-fjord font-semibold underline hover:text-fjord-dark">juridiske side</Link>.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">2. Brukerkonto og ansvarsfraskrivelse</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Du forplikter deg til å oppgi korrekt navn ved opprettelse av konto. Pseudonymer eller falske identiteter er ikke tillatt ved innsending av hovedinnlegg.</li>
                            <li>Kontoer skal ikke deles med andre. Du er ansvarlig for alle handlinger som utføres under din brukerkonto.</li>
                            <li>Ytre forbeholder seg retten til å deaktivere eller slette kontoer som gjentatte ganger bryter våre retningslinjer.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">3. Innsending av innhold og opphavsrett</h2>
                        <p>Når du publiserer artikler, kommentarer eller opplaster bilder på Ytre, beholder du din opphavsrett til innholdet. Du gir imidlertid Ytre en ikke-eksklusiv, vederlagsfri, global rett til å vise og distribuere innholdet på vår plattform.</p>
                        <p className="mt-4">
                            <strong>Krav til innsender:</strong> Du er selv ansvarlig for at du har nødvendige rettigheter og tillatelser til alt du laster opp (inkludert bilder). Ytre fraskriver seg erstatningsansvar for brudd på åndsverkloven utført av våre brukere.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">4. Redaktøransvar og moderering</h2>
                        <p>
                            Ytre er et redaktørstyrt medie. Vi følger Vær Varsom-plakaten og Redaktørplakaten. Alle hovedinnlegg vurderes og godkjennes før publisering for å sikre høy faglig standard og hindre lovstridig innhold.
                        </p>
                        <p className="mt-4 text-fjord font-medium">Følgende innhold er strengt forbudt og vil medføre sletting:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Trusler, hatefulle ytringer eller innhold som bryter Straffelovens § 185 (Hatefulle ytringer).</li>
                            <li>Tekst som oppfordrer til vold eller ulovlige handlinger.</li>
                            <li>Pornografisk materiale eller groteske skildringer.</li>
                            <li>Innhold som krenker privatlivets fred (Straffeloven § 267).</li>
                            <li>Spam, skjult reklame, eller desinformasjon (fake news) skrevet i den hensikt å villede publikum.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">5. Kommentarfelt og debatt</h2>
                        <p>
                            Ytre ønsker takhøyde og sterke meninger. Kommentarfeltet postmodereres i all hovedsak, noe som betyr at kommentarer publiseres direkte. Hver enkelt bruker står juridisk ansvarlig for innholdet de publiserer i kommentarfeltet.
                        </p>
                        <p className="mt-4">
                            Vi forbeholder oss retten til å fjerne uønskede kommentarer og utestenge brukere som forsurer debattklimaet.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">6. Endring av vilkår</h2>
                        <p>
                            Ytre kan oppdatere disse vilkårene etter eget skjønn. Vesentlige endringer vil varsles på e-post eller tydelig på plattformen før de trer i kraft. Fortsatt bruk av tjenesten etter at endringene trer i kraft regnes som en aksept av de nye vilkårene.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">7. Konfliktløsning og verneting</h2>
                        <p>
                            Tvister som oppstår i forbindelse med disse vilkårene eller bruk av Ytre, skal søkes løst ved forhandlinger. Fører ikke slike forhandlinger frem, skal saken avgjøres av de ordinære domstoler i Norge, med Oslo tingrett som verneting.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
