export const CATEGORIES = [
    { id: 'school', label: '📚 Skole' },
    { id: 'politics', label: '🗳️ Politikk' },
    { id: 'mental_health', label: '🧠 Psykisk helse' },
    { id: 'society', label: '🌍 Samfunn' },
    { id: 'environment', label: '🌱 Miljø' },
    { id: 'technology', label: '💻 Teknologi' },
    { id: 'infrastructure', label: '🏗️ Infrastruktur' },
    { id: 'culture', label: '🎭 Kultur' },
    { id: 'economy', label: '💰 Økonomi' },
    { id: 'rights', label: '⚖️ Rettigheter' },
];

export const CATEGORY_LABEL: Record<string, string> = {
    school: 'Skole',
    politics: 'Politikk',
    mental_health: 'Psykisk helse',
    society: 'Samfunn',
    environment: 'Miljø',
    technology: 'Teknologi',
    infrastructure: 'Infrastruktur',
    culture: 'Kultur',
    economy: 'Økonomi',
    rights: 'Rettigheter',
};

export const CATEGORY_ICON: Record<string, string> = {
    school: '📚',
    politics: '🗳️',
    mental_health: '🧠',
    society: '🌍',
    environment: '🌱',
    technology: '💻',
    infrastructure: '🏗️',
    culture: '🎭',
    economy: '💰',
    rights: '⚖️',
};

export const CATEGORY_SLUG: Record<string, string> = {
    school: 'skole',
    politics: 'politikk',
    mental_health: 'psykisk-helse',
    society: 'samfunn',
    environment: 'miljo',
    technology: 'teknologi',
    infrastructure: 'infrastruktur',
    culture: 'kultur',
    economy: 'okonomi',
    rights: 'rettigheter',
};

export const SLUG_TO_DB_CATEGORY: Record<string, string> = {
    'skole': 'school',
    'politikk': 'politics',
    'psykisk-helse': 'mental_health',
    'samfunn': 'society',
    'miljo': 'environment',
    'teknologi': 'technology',
    'infrastruktur': 'infrastructure',
    'kultur': 'culture',
    'okonomi': 'economy',
    'rettigheter': 'rights',
    // English fallbacks
    'school': 'school',
    'politics': 'politics',
    'mental_health': 'mental_health',
    'society': 'society',
    'environment': 'environment',
    'technology': 'technology',
    'infrastructure': 'infrastructure',
    'culture': 'culture',
    'economy': 'economy',
    'rights': 'rights',
};

export const AUDIENCES = [
    { id: 'everyone', label: '👥 Alle' },
    { id: 'students', label: '🎓 Studenter & elever' },
    { id: 'parents', label: '👨‍👩‍👧 Foreldre' },
    { id: 'politicians', label: '🏛️ Politikere' },
    { id: 'professionals', label: '💼 Fagfolk' },
    { id: 'youth', label: '🌟 Ungdom 13–18' },
    { id: 'local', label: '📍 Lokalbefolkning' },
];

export const AUDIENCE_LABEL: Record<string, string> = {
    everyone: 'Alle',
    students: 'Studenter & elever',
    parents: 'Foreldre',
    politicians: 'Politikere',
    professionals: 'Fagfolk',
    youth: 'Ungdom 13–18',
    local: 'Lokalbefolkning',
};

export const PERSPECTIVES = [
    '🟢 For', '🔴 Mot', '⚖️ Nøytral analyse', '🔵 Personlig erfaring',
    '🟡 Kritisk', '🟣 Visjonær', '🟠 Løsningsorientert',
];

export const READING_LEVELS = [
    { id: 'simple', label: '☀️ Enkel – alle kan lese' },
    { id: 'medium', label: '📖 Middels – krever litt kunnskap' },
    { id: 'advanced', label: '🎓 Avansert – faglig dybde' },
];

export const READING_LEVEL_LABEL: Record<string, string> = {
    simple: 'Enkel',
    medium: 'Middels',
    advanced: 'Avansert',
};

export const ORGANIZATION_LEVELS = [
    { id: 'political_party', label: '🗳️ Politisk parti' },
    { id: 'union', label: '🤝 Fagforening' },
    { id: 'interest_group', label: '📣 Interesseorganisasjon' },
    { id: 'business', label: '💼 Næringsliv' },
    { id: 'ethnic_group', label: '🌍 Folkegruppe / Minoritet' },
    { id: 'media', label: '📰 Media' },
    { id: 'other', label: '📌 Annet' },
];

export const ORG_LEVEL_LABEL: Record<string, string> = {
    political_party: 'Politisk parti',
    union: 'Fagforening',
    interest_group: 'Interesseorganisasjon',
    business: 'Næringsliv',
    ethnic_group: 'Folkegruppe / Minoritet',
    media: 'Media',
    other: 'Annet',
};
