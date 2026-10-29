export interface ReportSubCategory {
    id: string;
    label: string;
    hint?: string;
}

export interface ReportCategory {
    id: string;
    icon: string;
    label: string;
    description: string;
    legalRef?: string;
    subCategories: ReportSubCategory[];
}

export const REPORT_CATEGORIES: ReportCategory[] = [
    {
        id: 'hate_speech',
        icon: '⚖️',
        label: 'Hatefulle ytringer / Diskriminering',
        description: 'Ytringer som forhåner, truer eller fremmer hat mot en gruppe eller person.',
        legalRef: 'Straffeloven § 185',
        subCategories: [
            { id: 'ethnicity', label: 'Etnisitet, nasjonal opprinnelse eller hudfarge' },
            { id: 'religion', label: 'Religion eller livssyn' },
            { id: 'orientation', label: 'Seksuell orientering, kjønnsidentitet eller kjønnsuttrykk' },
            { id: 'disability', label: 'Nedsatt funksjonsevne' },
            { id: 'severe_abuse', label: 'Grov hets eller dehumaniserende omtale' },
        ],
    },
    {
        id: 'harassment',
        icon: '🚫',
        label: 'Trakassering, trusler eller personangrep',
        description: 'Voldstrusler, hets eller uakseptabelt personangrep mot privatpersoner.',
        legalRef: 'Straffeloven § 263 / § 266',
        subCategories: [
            { id: 'threats', label: 'Direkte eller indirekte trusler om vold eller fysisk skade' },
            { id: 'harassment', label: 'Gjentatt eller hensynsløs plaging / personforfølgelse' },
            { id: 'personal_attack', label: 'Uakseptabelt personangrep mot privatperson' },
            { id: 'doxxing', label: 'Uthegning eller spredning av private personopplysninger (doxxing)' },
        ],
    },
    {
        id: 'illegal',
        icon: '⚠️',
        label: 'Ulovlig innhold / Grovt lovbrudd',
        description: 'Oppfordring til vold, straffbare handlinger eller fare for liv og helse.',
        legalRef: 'Straffeloven',
        subCategories: [
            { id: 'violence_incitement', label: 'Oppfordring til eller glorifisering av vold' },
            { id: 'criminal_act', label: 'Oppfordring eller veiledning til straffbare handlinger' },
            { id: 'self_harm', label: 'Oppfordring til eller veiledning i selvskading eller selvmord' },
            { id: 'harmful_material', label: 'Deling av ulovlig eller grovt skadelig materiale' },
        ],
    },
    {
        id: 'copyright',
        icon: '📄',
        label: 'Opphavsrettsbrudd, plagiat eller uautorisert bilde',
        description: 'Bruk av andres tekst, fotografier eller verk uten samtykke eller kreditering.',
        legalRef: 'Åndsverkloven',
        subCategories: [
            { id: 'plagiarism', label: 'Teksten er kopiert fra annen avis, forfatter eller kilde (plagiat)' },
            { id: 'unauthorized_image', label: 'Bilde / fotografi brukt uten tillatelse eller rettigheter' },
            { id: 'missing_credit', label: 'Manglende eller feilaktig fotograf- / kildekreditering' },
            { id: 'license_breach', label: 'Brudd på lisensvilkår eller opphavsrett' },
        ],
    },
    {
        id: 'privacy',
        icon: '🔒',
        label: 'Krenkelse av privatlivets fred / Personvern',
        description: 'Publisering av sensitive private bilder eller opplysninger uten samtykke.',
        legalRef: 'Straffeloven § 267 / GDPR',
        subCategories: [
            { id: 'private_image', label: 'Bilder av personer publisert uten gyldig samtykke' },
            { id: 'health_sensitive', label: 'Sensitive personopplysninger eller helseopplysninger' },
            { id: 'privacy_infringement', label: 'Krenkelse av privatlivets fred eller hemmeligheter' },
        ],
    },
    {
        id: 'spam',
        icon: '📢',
        label: 'Ren reklame, spam eller svindelforsøk',
        description: 'Kommersiell markedsføring, phishing eller uønsket masseutsendelse.',
        legalRef: 'Markedsføringsloven / Ytres retningslinjer',
        subCategories: [
            { id: 'commercial_ad', label: 'Ren reklame, produktpromotering eller affiliate-lenker' },
            { id: 'fraud', label: 'Svindelforsøk, phishing eller mistenkelige lenker' },
            { id: 'junk_spam', label: 'Spam eller gjentatt søppeltekst' },
        ],
    },
    {
        id: 'other',
        icon: '❓',
        label: 'Annet alvorlig regelbrudd',
        description: 'Brudd på Ytres retningslinjer som ikke faller inn under kategoriene over.',
        legalRef: 'Ytres publiseringsregler',
        subCategories: [
            { id: 'fake_identity', label: 'Falsk identitet eller utgir seg for å være en annen person' },
            { id: 'falsified_sources', label: 'Misvisende kildeangivelser eller alvorlig faktaforfalskning' },
            { id: 'general_guideline_breach', label: 'Annet brudd på Ytres retningslinjer' },
        ],
    },
];
