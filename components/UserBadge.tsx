'use client';

interface BadgeInfo {
    icon: string;
    label: string;
    color: string;
    glow: string;
}

function computeBadge(postCount: number, totalViews: number): BadgeInfo {
    if (totalViews >= 2000 || postCount >= 20) {
        return { icon: '⭐', label: 'Toppskribent', color: 'text-amber-700', glow: 'bg-amber-100 border-amber-300' };
    }
    if (totalViews >= 500 || postCount >= 5) {
        return { icon: '🔥', label: 'Ildsjel', color: 'text-orange-700', glow: 'bg-orange-50 border-orange-200' };
    }
    if (postCount >= 2 || totalViews >= 100) {
        return { icon: '💬', label: 'Debattant', color: 'text-fjord', glow: 'bg-fjord/10 border-fjord/20' };
    }
    return { icon: '🌱', label: 'Ny stemme', color: 'text-green-700', glow: 'bg-green-50 border-green-200' };
}

interface Props {
    postCount?: number;
    totalViews?: number;
    size?: 'sm' | 'md';
}

export function UserBadge({ postCount = 0, totalViews = 0, size = 'sm' }: Props) {
    const badge = computeBadge(postCount, totalViews);

    if (size === 'sm') {
        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.glow} ${badge.color}`}
                title={badge.label}
            >
                <span>{badge.icon}</span>
                <span className="hidden sm:inline">{badge.label}</span>
            </span>
        );
    }

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${badge.glow} ${badge.color}`}>
            <span className="text-xl">{badge.icon}</span>
            <span>{badge.label}</span>
        </div>
    );
}
