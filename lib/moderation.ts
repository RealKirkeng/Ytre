/**
 * Content moderation utility for checking offensive language.
 * Focused on Norwegian slurs, hate speech, and harassment.
 */

const RESTRICTED_TERMS = [
    // Norwegian slurs and offensive terms (placeholders/examples)
    'neger', 'homo', 'fitte', 'kuk', 'faen', 'helvete', 'jævla',
    'pakkis', 'guling', 'mongo', 'retard', 'hore', 'slutt',
    'drep', 'selvmord', 'terror', 'bombe'
];

export interface ModerationResult {
    isClean: boolean;
    flaggedTerms: string[];
    riskScore: number; // 0-100
}

export function checkContent(title: string, content: string): ModerationResult {
    const text = `${title} ${content}`.toLowerCase();
    const flaggedTerms: string[] = [];

    RESTRICTED_TERMS.forEach(term => {
        // Use regex for word boundaries to avoid catching "faktum" as "fitte" etc.
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        if (regex.test(text)) {
            flaggedTerms.push(term);
        }
    });

    const riskScore = Math.min(100, flaggedTerms.length * 20);

    return {
        isClean: flaggedTerms.length === 0,
        flaggedTerms,
        riskScore
    };
}
