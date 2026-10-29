'use client';

import { useEffect, useState } from 'react';

/**
 * A thin gradient bar at the top of the screen that fills as the user scrolls.
 * Color adapts to the active CSS theme via a custom property.
 */
export function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
            aria-hidden="true"
        >
            <div
                style={{ width: `${progress}%`, background: 'var(--fjord, #5B89A8)' }}
                className="h-full transition-[width] duration-75 ease-out"
            />
        </div>
    );
}
