'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FlagButtonProps {
    postId: string;
    initialFlagCount?: number;
}

export function FlagButton({ postId, initialFlagCount = 0 }: FlagButtonProps) {
    const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error' | 'auth'>('idle');
    const router = useRouter();
    const supabase = createClient();

    const handleFlag = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setState('auth');
            return;
        }

        setState('loading');
        try {
            const res = await fetch('/api/flag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_type: 'post', target_id: postId, reason: 'user_flag' }),
            });
            if (res.ok) {
                setState('done');
            } else {
                setState('error');
            }
        } catch {
            setState('error');
        }

        setTimeout(() => setState('idle'), 3000);
    };

    return (
        <div className="relative">
            <motion.button
                onClick={handleFlag}
                disabled={state === 'loading' || state === 'done'}
                whileHover={{ scale: state === 'done' ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${state === 'done'
                    ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                    : state === 'error'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                        : 'glass text-white/40 hover:text-debate-red hover:border-debate-red/30 hover:bg-debate-red/10'
                    }`}
            >
                {state === 'done' ? (
                    <><Check className="w-3 h-3" />Rapportert</>
                ) : state === 'error' ? (
                    <><X className="w-3 h-3" />Feil</>
                ) : (
                    <>Rapporter</>
                )}
            </motion.button>

            {state === 'auth' && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 right-0 glass rounded-xl p-3 text-xs text-white/70 whitespace-nowrap z-10 border border-white/10"
                >
                    <Link href="/auth/login" className="text-accent-light hover:underline">
                        Logg inn
                    </Link>{' '}
                    for å rapportere
                </motion.div>
            )}
        </div>
    );
}
