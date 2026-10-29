'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize Lenis smooth scroll only on client
        let lenis: any = null;

        import('lenis').then(({ default: Lenis }) => {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            function raf(time: number) {
                lenis!.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        });

        return () => {
            lenis?.destroy();
        };
    }, []);

    return <>{children}</>;
}
