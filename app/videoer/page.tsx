import { getSettings, getVideos } from '@/lib/local-store.server';
import { redirect } from 'next/navigation';
import { VideoClientFeed } from './VideoClientFeed';
import Link from 'next/link';
import { PenLine } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function VideoerPage() {
    // If settings are local and we want to enforce beta flag strictly
    const settings = getSettings();
    if (!settings.isVideoFeatureEnabled) {
        redirect('/');
    }

    const videos = getVideos();

    return (
        <main className="min-h-screen bg-sand text-ink relative overflow-hidden">
            {/* Background Texture (similar to homepage) */}
            <div className="absolute inset-x-0 top-0 h-[80vh] bg-gradient-to-b from-fjord/10 via-amber/5 to-transparent pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">

                {/* Dedicated Video Hero Section */}
                <div className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-14 mb-12 shadow-sm border border-sand-dark/40 relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-indigo-50/60 to-transparent pointer-events-none" />

                    <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
                        <span className="text-5xl sm:text-6xl mb-6 block drop-shadow-sm">🎬</span>

                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-ink mb-4 tracking-tight">
                            Videosenter <span className="text-sm sm:text-base bg-indigo-100/80 text-indigo-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest align-middle ml-2 border border-indigo-200/50 backdrop-blur-sm shadow-sm inline-block -translate-y-2">Beta</span>
                        </h1>

                        <p className="text-ink-400 text-base sm:text-lg font-medium mb-10 max-w-lg leading-relaxed">
                            Utforsk korte debattinnlegg, reels og meningsytringer i videoformat. La din stemme bli sett og hørt!
                        </p>

                        <div className="inline-flex p-1.5 bg-sand-dark/30 rounded-2xl border border-sand-dark/10 mb-8 shadow-inner">
                            <Link href="/" className="px-6 py-2.5 rounded-xl text-sm font-bold text-ink-500 hover:text-ink transition-colors">
                                📝 Artikler
                            </Link>
                            <Link href="/videoer" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-ink shadow-sm pointer-events-none flex items-center">
                                🎬 Videoer
                            </Link>
                        </div>

                        <Link href="/send-video" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold tracking-wide shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
                            style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}
                        >
                            <PenLine className="w-5 h-5" />
                            Send inn din video
                        </Link>
                    </div>
                </div>

                {/* The client component that loads and displays the video feed */}
                <VideoClientFeed initialVideos={videos} />
            </div>
        </main>
    );
}
