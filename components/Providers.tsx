'use client';

import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize Lenis smooth scroll only on client
        let lenis: any = null;
        let reqId: number;
        let destroyed = false;

        import('lenis').then(({ default: Lenis }) => {
            if (destroyed) return;
            lenis = new Lenis({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            function raf(time: number) {
                if (destroyed) return;
                lenis?.raf(time);
                reqId = requestAnimationFrame(raf);
            }
            reqId = requestAnimationFrame(raf);
        });

        return () => {
            destroyed = true;
            if (reqId) cancelAnimationFrame(reqId);
            lenis?.destroy();
        };
    }, []);

    return <>{children}</>;
}
