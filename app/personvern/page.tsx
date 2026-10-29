import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Personvernerklæring | Ytre',
    description: 'Slik håndterer og beskytter vi dine personopplysninger på Ytre. Les vår forpliktelse til ditt personvern.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-sand px-4 pt-20 sm:pt-24 pb-16">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-sand-dark/20 p-6 sm:p-16">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink transition-colors mb-8 sm:mb-12">
                    <ArrowLeft className="w-4 h-4" /> Tilbake til forsiden
                </Link>

                <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink mb-4 sm:mb-6">Personvernerklæring</h1>
                <p className="text-base sm:text-lg text-ink-400 mb-8 sm:mb-12">Sist oppdatert: 1. mars 2026</p>

                <div className="prose prose-fjord max-w-none text-ink-500 space-y-8">
                    <p className="lead text-lg sm:text-xl text-ink-400 pb-6 border-b border-sand-dark/20">
                        I Ytre tar vi ditt personvern på største alvor. Denne erklæringen forklarer hvordan vi samler inn, bruker og beskytter dine personopplysninger i henhold til Personopplysningsloven og EUs personvernforordning (GDPR).
                    </p>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">1. Hvem er behandlingsansvarlig?</h2>
                        <p>
                            Det er Ytre (org. nr. [Fylles inn]), representert ved daglig leder, som er behandlingsansvarlig for de persondata som lagres i forbindelse med bruk av vår tjeneste.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">2. Hvilke opplysninger samler vi inn?</h2>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Personalia:</strong> Fornavn, etternavn og e-postadresse registreres når du oppretter konto.</li>
                            <li><strong>Profilopplysninger:</strong> Profilbilde, valgt tema og skrifttype (kun for å tilpasse din brukeropplevelse).</li>
                            <li><strong>Innhold:</strong> Tekst, bilder, og filer du laster opp gjennom innlegg og kommentarer.</li>
                            <li><strong>Tekniske data:</strong> IP-adresser, nettlesertype, og operativsystem. Dette lagres i systemlogger for sikkerhetsformål og anonymisert analysebruk.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">3. Formålet med behandlingen</h2>
                        <p>Vi samler utelukkende inn opplysninger til formål knyttet til drift av debattplattformen:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>For å opprette din brukerkonto og verifisere avsender før publisering.</li>
                            <li>For å vise navnet ditt på publiserte innlegg (grunnpilaren i god debattkultur).</li>
                            <li>For å sikre stabil drift, oppdage sikkerhetsbrudd og håndtere spam.</li>
                        </ul>
                        <div className="bg-sand/50 p-4 rounded-xl mt-4 border border-sand-dark/30">
                            <strong>Obs:</strong> Vi vil <em>aldri</em> selge dine personopplysninger til tredjepartsannonsører eller andre eksterne selskaper. Det er ikke slik vi driver forretning.
                        </div>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">4. Informasjonskapsler (Cookies)</h2>
                        <p>
                            Vi bruker et minimalt antall informasjonskapsler. De brukes utelukkende for kritisk funksjonalitet (som å holde deg innlogget via en auth-token). Ytre benytter ikke sporingspiksler eller retargeting-cookies fra Facebook/Google.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">5. Hvor lenge lagrer vi data?</h2>
                        <p>
                            Dine opplysninger lagres så lenge du har en aktiv konto hos oss. Du kan når som helst be om å få kontoen din slettet. Publiserte kronikker og artikler er omfattet av medieansvarsloven, og vi forbeholder oss retten til å beholde publisert, historisk materiale i arkivet, uavhengig av kontostatus. Kommentarer og upubliserte kladder vil slettes.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">6. Dine rettigheter (GDPR)</h2>
                        <p>Som registrert bruker hos oss har du følgende rettigheter:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li><strong>Innsyn:</strong> Du har krav på å se all info vi har om deg.</li>
                            <li><strong>Retting og sletting:</strong> Du kan fjerne eller endre ukorrekte data.</li>
                            <li><strong>Dataportabilitet:</strong> Be om å få overlevert dine data i maskinlesbart format.</li>
                        </ul>
                        <p className="mt-4">
                            Ønsker du å benytte deg av disse rettighetene, kontakt oss på <code>personvern@ytre.no</code>. Du har også rett til å klage til Datatilsynet dersom du mener vi behandler dine opplysninger urettmessig.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-ink mb-4">7. Datasikkerhet</h2>
                        <p>
                            Vi benytter utprøvde teknologier (blant annet bcrypt for passordhashing og https/SSL for kryptert datatransfer) for å forhindre uautorisert innsyn, endring eller ødeleggelse av opplysningene vi lagrer om deg. Kun personell med eksplisitt og nødvendig behov har tilgang til systemenes bakside.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
