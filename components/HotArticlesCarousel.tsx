'use client';

import { Post } from './ArticleCard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export function HotArticlesCarousel({ posts }: { posts: Post[] }) {
    if (!posts || posts.length === 0) return null;

    // Take top 8 posts (if more, just limit it to keep the carousel tight)
    const hotPosts = posts.slice(0, 8);

    // We duplicate the array to create a seamless infinite scroll effect
    const carouselItems = [...hotPosts, ...hotPosts];

    return (
        <div className="w-full py-6 md:py-8 overflow-hidden relative group/carousel">


            <div className="relative z-10 flex items-center gap-3 mb-6 px-6 sm:px-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100/80 text-orange-600 shadow-sm border border-orange-200/50 backdrop-blur-sm">
                    <span className="text-xl">🔥</span>
                </div>
                <div>
                    <h2 className="font-display text-2xl font-black text-ink tracking-tight flex items-center gap-2">
                        I farta akkurat nå
                    </h2>
                    <p className="text-ink-400 font-medium mt-0.5 text-xs">Les hva alle andre engasjerer seg i</p>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative w-full flex overflow-hidden group">

                {/* 
                  Applying an inline style to drive the marquee animation.
                  We use pure CSS for smooth infinite scrolling.
                */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes rollercoasterMarquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-rollercoaster {
                        display: flex;
                        width: max-content;
                        animation: rollercoasterMarquee 40s linear infinite;
                    }
                    .group:hover .animate-rollercoaster {
                        animation-play-state: paused;
                    }
                    /* Creating the rollercoaster wave effect using nth-child */
                    .roller-item:nth-child(even) {
                        transform: translateY(16px) rotate(1deg);
                    }
                    .roller-item:nth-child(odd) {
                        transform: translateY(-8px) rotate(-1deg);
                    }
                    .roller-item:nth-child(3n) {
                        transform: translateY(8px) rotate(-0.5deg);
                    }
                    .roller-item:nth-child(4n) {
                        transform: translateY(-12px) rotate(1.5deg);
                    }
                `}} />

                <div className="animate-rollercoaster gap-6 px-4 py-6">
                    {carouselItems.map((post, index) => (
                        <Link
                            href={`/posts/${post.slug}`}
                            key={`${post.id}-${index}`}
                            className="roller-item w-72 sm:w-80 flex-shrink-0 transition-all duration-500 hover:!transform-none hover:scale-105 hover:z-20 relative group/card"
                        >
                            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-sand-dark/50 group-hover/card:shadow-lg group-hover/card:border-fjord/30 h-full flex flex-col justify-between overflow-hidden relative transition-all duration-300">

                                {/* Background Image with heavy overlay (to make it look distinct from standard cards) */}
                                {post.image_url ? (
                                    <>
                                        <img
                                            src={post.image_url}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover/card:scale-105 group-hover/card:opacity-40 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/40 z-0" />
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-b from-white to-sand/40 z-0" />
                                )}

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            {post.profiles?.avatar_url ? (
                                                <img
                                                    src={post.profiles.avatar_url}
                                                    alt={post.profiles.username}
                                                    width="28" height="28"
                                                    className="w-7 h-7 rounded-full bg-sand-dark object-cover"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-fjord/10 flex flex-shrink-0 items-center justify-center text-fjord font-bold text-xs ring-2 ring-white">
                                                    {post.profiles?.username[0].toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-xs font-semibold text-ink-300 truncate max-w-[120px]">
                                                {post.profiles?.username}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                                            <Eye className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-xs font-bold text-orange-600">{post.view_count}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-display font-bold text-lg text-ink leading-snug mb-3 group-hover/card:text-fjord transition-colors line-clamp-3">
                                        {post.title}
                                    </h3>

                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-sand-dark/50">
                                        <div className="flex items-center gap-1.5 text-ink-300">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span className="text-xs font-medium">{post.comment_count || 0}</span>
                                        </div>

                                        <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center group-hover/card:bg-fjord group-hover/card:text-white transition-colors duration-300 text-ink-300 font-bold">
                                            →
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Left/Right fading gradients to make emergence smooth, matching the white background */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    );
}
