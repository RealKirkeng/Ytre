'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminActions({ postId }: { postId: string }) {
    const [loading, setLoading] = useState<'approve' | 'remove' | null>(null);
    const router = useRouter();

    const act = async (action: 'approve' | 'remove') => {
        setLoading(action);
        await fetch(`/api/admin/posts/${postId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action }),
        });
        setLoading(null);
        router.refresh();
    };

    return (
        <div className="flex items-center gap-2">
            <motion.button
                onClick={() => act('approve')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors disabled:opacity-50"
            >
                {loading === 'approve' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Godkjenn
            </motion.button>
            <motion.button
                onClick={() => act('remove')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-debate-red border border-red-500/25 hover:bg-red-500/25 transition-colors disabled:opacity-50"
            >
                {loading === 'remove' ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                Fjern
            </motion.button>
        </div>
    );
}
