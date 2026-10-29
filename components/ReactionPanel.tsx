'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, MessageSquare, Hand, Heart } from 'lucide-react';

type ReactionType = 'veldig_bra' | 'viktig' | 'uenig' | 'støttes';

interface ReactionPanelProps {
    targetId: string;
    isComment?: boolean;
    initialReactions?: Record<string, string[]>;
}

const REACTION_CONFIG: Record<ReactionType, { icon: any; label: string; color: string; bg: string }> = {
    veldig_bra: { icon: Heart, label: 'Veldig bra', color: 'text-rose-500', bg: 'bg-rose-50' },
    viktig: { icon: Sparkles, label: 'Viktig poeng', color: 'text-amber-500', bg: 'bg-amber-50' },
    uenig: { icon: Hand, label: 'Uenig', color: 'text-fjord', bg: 'bg-fjord/10' },
    støttes: { icon: MessageSquare, label: 'Støttes', color: 'text-green-600', bg: 'bg-green-50' },
};

export default function ReactionPanel({ targetId, isComment = false, initialReactions = {} }: ReactionPanelProps) {
    const { user } = useAuth();
    const [reactions, setReactions] = useState(initialReactions);
    const [loading, setLoading] = useState<ReactionType | null>(null);

    const handleReact = async (type: ReactionType) => {
        if (!user) {
            // TODO: Vise login modal (krever løft av state, dropper inntil videre)
            alert('Du må logge inn for å reagere.');
            return;
        }

        setLoading(type);

        // Optimistic update
        const typeUsers = reactions[type] || [];
        const hasReacted = typeUsers.includes(user.id);
        const newTypeUsers = hasReacted ? typeUsers.filter(id => id !== user.id) : [...typeUsers, user.id];

        setReactions(prev => ({ ...prev, [type]: newTypeUsers }));

        const endpoint = isComment ? '/api/comments/react' : '/api/posts/react';
        const body = isComment ? { commentId: targetId, type } : { slug: targetId, type };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            // Revert if failed
            if (!res.ok) {
                setReactions(initialReactions);
            } else {
                setReactions(data.reactions);
            }
        } catch {
            setReactions(initialReactions);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((type) => {
                const config = REACTION_CONFIG[type];
                const Icon = config.icon;
                const typeUsers = reactions[type] || [];
                const count = typeUsers.length;
                const hasReacted = user ? typeUsers.includes(user.id) : false;

                if (count === 0 && !hasReacted && isComment) return null; // Skjul tomme på kommentarer for å spare plass

                return (
                    <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReact(type)}
                        disabled={loading === type}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm border
                            ${hasReacted ? `${config.bg} ${config.color} border-transparent inner-glow` : 'bg-white text-ink-300 border-sand-dark/40 hover:text-ink hover:border-sand-dark'}
                            ${loading === type ? 'opacity-50' : 'opacity-100'}
                        `}
                    >
                        <Icon className={`w-3.5 h-3.5 ${hasReacted ? 'fill-current' : ''}`} />
                        <span className={hasReacted ? '' : 'hidden sm:inline'}>{config.label}</span>
                        {count > 0 && (
                            <span className={`ml-0.5 px-1.5 rounded-full ${hasReacted ? 'bg-white/50' : 'bg-sand-dark/20'}`}>
                                {count}
                            </span>
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
