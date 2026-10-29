import type { Metadata } from 'next';
import { Inter, Outfit, Open_Sans, Atkinson_Hyperlegible, Comic_Neue } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { Suspense } from 'react';
import { getSession } from '@/lib/local-auth.server';
import { PageTransition } from '@/components/PageTransition';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-opensans', display: 'swap' });
const atkinson = Atkinson_Hyperlegible({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-atkinson', display: 'swap' });
const comicNeue = Comic_Neue({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-comic', display: 'swap' });

export const metadata: Metadata = {
    metadataBase: new URL('https://paragraf100.no'),
    title: {
        template: '%s | Paragraf100',
        default: 'Paragraf100 — Din stemme, din debatt',
    },
    description: 'Norges nye plattform for unge stemmer under 30. Publiser kronikker, delta i samfunnsdebatten og del dine perspektiver trygt og fritt.',
    keywords: ['debatt', 'ytringsfrihet', 'unge meninger', 'Norge', 'kronikk', 'samfunnsdebatt', 'politikk', 'meninger', 'Paragraf100'],
    openGraph: {
        type: 'website',
        locale: 'nb_NO',
        url: 'https://paragraf100.no',
        siteName: 'Paragraf100',
        title: 'Paragraf100 — Din stemme, din debatt',
        description: 'Norges nye debattplattform for unge stemmer. Les, skriv, engasjer deg.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Paragraf100 — Din stemme, din debatt',
        description: 'Bli med i Norges nye debattplattform for unge.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    const themeClass = session?.theme ? `theme-${session.theme}` : 'theme-original';

    let fontClass = 'font-sans-active'; // default
    if (session?.font === 'serif') fontClass = 'font-serif-active';
    else if (session?.font === 'opensans') fontClass = 'font-opensans-active';
    else if (session?.font === 'hyperlegible') fontClass = 'font-hyperlegible-active';
    else if (session?.font === 'comic') fontClass = 'font-comic-active';

    return (
        <html lang="nb" className={`${inter.variable} ${outfit.variable} ${openSans.variable} ${atkinson.variable} ${comicNeue.variable} ${themeClass} ${fontClass}`}>
            <body>
                {/* Animated background orbs — fixed behind everything */}
                <div className="bg-canvas" aria-hidden="true">
                    <div className="orb3" />
                </div>

                <Providers>
                    <div className="page-content">
                        <Suspense>
                            <Navbar />
                        </Suspense>
                        <main><PageTransition key={Date.now().toString()}>{children}</PageTransition></main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
