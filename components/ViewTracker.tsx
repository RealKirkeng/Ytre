'use client';

import { useEffect } from 'react';

/**
 * Fires a view increment request after the reader has spent
 * `delay` milliseconds on the article page.
 */
export function ViewTracker({ postId, delay = 5000 }: { postId: string; delay?: number }) {
    useEffect(() => {
        const t = setTimeout(() => {
            fetch('/api/posts/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: postId }),
            }).catch(() => {/* silently ignore */ });
        }, delay);
        return () => clearTimeout(t);
    }, [postId, delay]);

    return null; // renders nothing
}
