'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { LocalVideo } from '@/lib/local-store.server';

function VideoCard({ video }: { video: LocalVideo }) {
    // Determine embed strategy.
    const url = video.videoUrl || '';
    const isMp4 = url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mov') || url.includes('/uploads/videos/');
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    const isTiktok = url.includes('tiktok.com');
    const isInstagram = url.includes('instagram.com');

    let embedUrl = url;
    if (isYoutube) {
        const match = url.match(/[?&]v=([^&]+)/);
        if (match && match[1]) {
            embedUrl = `https://www.youtube.com/embed/${match[1]}`;
        } else if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1]?.split('?')[0];
            if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
        }
    } else if (isTiktok) {
        const match = url.match(/\/video\/(\d+)/);
        if (match && match[1]) {
            embedUrl = `https://www.tiktok.com/embed/v2/${match[1]}`;
        }
    } else if (isInstagram) {
        // e.g., https://www.instagram.com/reel/Cxxxxxx/ -> https://www.instagram.com/reel/Cxxxxxx/embed
        const cleanUrl = url.split('?')[0].replace(/\/$/, "");
        embedUrl = `${cleanUrl}/embed/`;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white rounded-3xl overflow-hidden border border-sand-dark/40 shadow-sm flex flex-col"
        >
            {/* Video Player Area */}
            {/* Organic height for MP4s, fixed ratios for iframes to prevent zero-height bugs */}
            <div className={`relative w-full bg-ink flex items-center justify-center overflow-hidden shrink-0 group ${isMp4 ? '' : isYoutube ? 'aspect-video' : 'aspect-[9/16]'}`}>
                {isMp4 ? (
                    <video
                        src={embedUrl}
                        controls
                        playsInline
                        className="w-full h-auto block"
                        preload="metadata"
                    />
                ) : isYoutube || isTiktok || isInstagram ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        scrolling="no"
                    />
                ) : (
                    <div className="text-center p-8 aspect-video w-full flex flex-col justify-center items-center">
                        <span className="text-4xl text-white/20 mx-auto mb-3 block">▶️</span>
                        <a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-fjord text-sm hover:underline mt-2 inline-block">
                            Åpne video ↗
                        </a>
                    </div>
                )}
            </div>

            {/* Video Metadata */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-sand-dark flex flex-shrink-0 items-center justify-center text-ink text-xs font-bold">
                        {video.authorName[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-xs text-ink leading-none truncate">{video.authorName}</p>
                        <p className="text-[10px] text-ink-300 mt-0.5">{new Date(video.createdAt).toLocaleDateString('nb-NO')}</p>
                    </div>
                </div>

                <h3 className="font-display font-bold text-base text-ink mb-1.5 leading-snug break-words">{video.title}</h3>
                {video.description && <p className="text-xs text-ink-400 line-clamp-2">{video.description}</p>}
                <div className="flex-1" />
            </div>
        </motion.div>
    );
}

export function VideoClientFeed({ initialVideos = [] }: { initialVideos?: LocalVideo[] }) {
    const [videos, setVideos] = useState<LocalVideo[]>(initialVideos);
    const [loading, setLoading] = useState(initialVideos.length === 0);

    useEffect(() => {
        if (initialVideos.length > 0) return;
        fetch('/api/videos')
            .then(r => r.json())
            .then(data => {
                setVideos(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [initialVideos.length]);

    if (loading) {
        return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-ink-300" /></div>;
    }

    if (videos.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="font-display text-2xl font-bold text-ink mb-2">Ingen videoer enda</h2>
                <p className="text-ink-400">Vær den første til å sende inn en video!</p>
            </div>
        );
    }

    // Split videos into 2 or 3 columns for Masonry layout
    const col0: LocalVideo[] = [];
    const col1: LocalVideo[] = [];
    const col2: LocalVideo[] = [];

    videos.forEach((v, i) => {
        const col = i % 3;
        if (col === 0) col0.push(v);
        else if (col === 1) col1.push(v);
        else col2.push(v);
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start mt-4">
            <div className="flex flex-col gap-5">{col0.map(v => <VideoCard key={v.id} video={v} />)}</div>
            <div className="flex flex-col gap-5">{col1.map(v => <VideoCard key={v.id} video={v} />)}</div>
            <div className="flex flex-col gap-5">{col2.map(v => <VideoCard key={v.id} video={v} />)}</div>
        </div>
    );
}
