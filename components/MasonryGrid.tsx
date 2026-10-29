'use client';

import { FeaturedCard, StandardCard, AdCard } from './ArticleCard';
import type { Post } from './ArticleCard';

export function MasonryGrid({ posts }: { posts: Post[] }) {

    if (!posts.length) {
        return (
            <div className="text-center py-24">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-display text-xl font-bold text-ink mb-1">Ingen innlegg ennå</p>
                <p className="text-ink-300 text-sm">Bli den første til å publisere!</p>
            </div>
        );
    }

    // Build a flat list of items interspersed with ads. 
    // Organic distribution: first ad after 4 posts, then roughly every 7-9 posts.
    type Item = Post | 'ad';
    const items: Item[] = [];
    let nextAdIndex = 4;

    posts.forEach((p, i) => {
        if (i === nextAdIndex) {
            items.push('ad');
            // Deterministic pseudo-random pattern: 7, 8, or 9
            const step = 7 + (i % 3);
            nextAdIndex += step;
        }
        items.push(p);
    });

    // Three column rendering logic - only used when mounted to avoid hydration mismatch
    const col0: Item[] = [];
    const col1: Item[] = [];
    const col2: Item[] = [];

    items.forEach((item, i) => {
        const col = i % 3;
        if (col === 0) col0.push(item);
        else if (col === 1) col1.push(item);
        else col2.push(item);
    });

    function renderItem(item: Item, colIdx: number, posInCol: number) {
        if (item === 'ad') return <AdCard key={`ad-${colIdx}-${posInCol}`} />;
        const post = item as Post;
        const globalPos = posInCol * 3 + colIdx;
        if (colIdx === 0 && posInCol === 0) return <FeaturedCard key={post.id} post={post} index={globalPos} />;
        if (colIdx === 1 && posInCol === 0) return <FeaturedCard key={post.id} post={post} index={globalPos} />;
        return <StandardCard key={post.id} post={post} index={globalPos} />;
    }

    // The server can safely calculate modulo distribution since it's deterministic.
    // This prevents a layout shift ("jump") from 1 to 3 columns on mount.
    return (
        <>
            {/* Desktop multi-column masonry */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                <div className="flex flex-col gap-5">{col0.map((item, i) => renderItem(item, 0, i))}</div>
                <div className="flex flex-col gap-5">{col1.map((item, i) => renderItem(item, 1, i))}</div>
                <div className="flex flex-col gap-5">{col2.map((item, i) => renderItem(item, 2, i))}</div>
            </div>

            {/* Mobile single column - maintains natural chronological order */}
            <div className="flex sm:hidden flex-col gap-4">
                {items.map((item, i) => {
                    if (item === 'ad') return <AdCard key={`ad-mobile-${i}`} />;
                    const post = item as Post;
                    if (i === 0) return <FeaturedCard key={post.id} post={post} index={0} />;
                    return <StandardCard key={post.id} post={post} index={i} />;
                })}
            </div>
        </>
    );
}
