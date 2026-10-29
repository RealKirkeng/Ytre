'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp, Eye, Check } from 'lucide-react';
import Image from 'next/image';
import {
    CATEGORY_LABEL,
    CATEGORY_SLUG,
    CATEGORY_ICON,
} from '@/lib/constants';

export { CATEGORY_LABEL, CATEGORY_SLUG, CATEGORY_ICON };

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    created_at: string;
    flag_count: number;
    view_count: number;
    is_featured: boolean;
    comment_count?: number;
    image_url?: string;
    profiles?: { username: string; avatar_seed?: string; avatar_url?: string };
    regions?: { level: string; id: string; name: string }[];
    audience?: string[];
    angle?: string;
    readingLevel?: string;
    sources?: string[];
    organization?: string;
    position?: string;
    orgLevel?: string;
    coAuthors?: string[];
    authorName?: string;
    allowLicensing?: boolean;
}

function getCardAuthorDisplay(authorName: string, coAuthors?: string[]): { label: string; tooltip?: string } {
    if (!coAuthors || coAuthors.length === 0) {
        return { label: authorName };
    }
    return {
        label: `${authorName} +${coAuthors.length}`,
        tooltip: `Forfattere: ${authorName}, ${coAuthors.join(', ')}`
    };
}

const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

/* ── Category badge — styled as a liquid-glass bubble matching navbar functions ── */
export function CategoryBadge({ category }: { category: string }) {
    const router = useRouter();
    const slug = CATEGORY_SLUG[category] || category;
    const label = CATEGORY_LABEL[category] || category;
    const icon = CATEGORY_ICON[category];

    return (
        <span
            role="link"
            tabIndex={0}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/category/${slug}`);
            }}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`/category/${slug}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 select-none bg-white/80 hover:bg-white text-ink hover:text-fjord border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] hover:scale-[1.03] backdrop-blur-md"
            style={{
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                backdropFilter: 'blur(16px) saturate(180%)',
            }}
            title={`Vis alle innlegg i ${label}`}
        >
            {icon && <span className="text-[13px] leading-none">{icon}</span>}
            <span className="leading-none">{label}</span>
        </span>
    );
}

function excerpt(text: string, max = 120) {
    return text.replace(/^##+ .*/gm, '').replace(/\n/g, ' ').trim().slice(0, max) + (text.length > max ? '…' : '');
}

function readTime(content: string) {
    const words = content.replace(/\n/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function timeAgo(iso: string) {
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (d < 3600) return `${Math.floor(d / 60)} min siden`;
    if (d < 86400) return `${Math.floor(d / 3600)} t siden`;
    return `${Math.floor(d / 86400)} d siden`;
}

const cardVariants = {
    rest: { scale: 1, boxShadow: '0 2px 12px rgba(26,22,18,0.07), 0 1px 3px rgba(26,22,18,0.05)' },
    hover: { scale: 1.015, boxShadow: '0 16px 48px rgba(26,22,18,0.14), 0 4px 12px rgba(26,22,18,0.08)' },
};
const cardTransition = { type: 'spring' as const, stiffness: 350, damping: 28 };

/* ─── Featured Card ─── */
export function FeaturedCard({ post, index }: { post: Post; index: number }) {
    const router = useRouter();
    const authorName = post.profiles?.username || post.authorName || 'Anonym';
    const authorInfo = getCardAuthorDisplay(authorName, post.coAuthors);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={index < 3 ? { opacity: 1, y: 0 } : undefined}
            whileInView={index >= 3 ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: '400px' }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="rounded-3xl"
        >
            <motion.div variants={cardVariants} initial="rest" whileHover="hover" transition={cardTransition} className="rounded-3xl">
                <div
                    className="block group cursor-pointer bg-white rounded-3xl border border-sand-dark/40 overflow-hidden"
                    onClick={() => router.push(`/posts/${post.slug}`)}
                    role="article"
                >
                    {post.image_url && (
                        <div className="relative w-full h-44 sm:h-52">
                            {post.image_url.startsWith('data:') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <Image 
                                    src={post.image_url} 
                                    alt={post.title} 
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover" 
                                    priority={index === 0}
                                    unoptimized={post.image_url.startsWith('http')}
                                />
                            )}
                        </div>
                    )}
                    <div className="p-5 sm:p-7">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <CategoryBadge category={post.category} />
                            {post.view_count > 100 && (
                                <span className="flex items-center gap-1 text-xs text-amber font-medium">
                                    <TrendingUp className="w-3 h-3" /> Trending
                                </span>
                            )}
                        </div>
                        <h2 className="font-display text-xl sm:text-3xl font-bold text-ink leading-snug mb-3 group-hover:text-fjord transition-colors duration-200">
                            {post.title}
                        </h2>
                        <p className="text-ink-400 text-sm leading-relaxed mb-4 line-clamp-3">{excerpt(post.content, 180)}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-sand-dark/40">
                            <div className="flex items-center gap-2.5">
                                <Image
                                    src={post.profiles?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${post.profiles?.username || 'anon'}&backgroundColor=5B89A8`}
                                    alt="" 
                                    width={28}
                                    height={28}
                                    className="rounded-full border border-sand-dark object-cover shrink-0"
                                    unoptimized={!post.profiles?.avatar_url}
                                />
                                <div className="flex items-center gap-1.5 text-xs text-ink-300">
                                    <span className="font-medium text-ink-300 truncate max-w-[120px] sm:max-w-none" title={authorInfo.tooltip}>
                                        {authorInfo.label}
                                    </span>
                                    <span>·</span>
                                    <span>{timeAgo(post.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-ink-300 ml-auto">
                                {post.allowLicensing && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/10 border border-amber/20 text-[10px] font-bold text-amber-700" title="Denne artikkelen kan lisensieres av andre mediehus">
                                        <Check className="w-3 h-3" />
                                        <span>Lisensierbar</span>
                                    </div>
                                )}
                                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.view_count}</span>
                                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.comment_count ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Standard Card ─── */
export function StandardCard({ post, index }: { post: Post; index: number }) {
    const router = useRouter();
    const authorName = post.profiles?.username || post.authorName || 'Anonym';
    const authorInfo = getCardAuthorDisplay(authorName, post.coAuthors);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={index < 3 ? { opacity: 1, y: 0 } : undefined}
            whileInView={index >= 3 ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: '400px' }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-2xl"
        >
            <motion.div variants={cardVariants} initial="rest" whileHover="hover" transition={cardTransition} className="rounded-2xl">
                <div
                    className="block group cursor-pointer bg-white rounded-2xl border border-sand-dark/40 overflow-hidden h-full"
                    onClick={() => router.push(`/posts/${post.slug}`)}
                    role="article"
                >
                    {post.image_url && (
                        <div className="relative w-full h-36 sm:h-40">
                            {post.image_url.startsWith('data:') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <Image 
                                    src={post.image_url} 
                                    alt={post.title} 
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="object-cover" 
                                    unoptimized={post.image_url.startsWith('http')}
                                />
                            )}
                        </div>
                    )}
                    <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <CategoryBadge category={post.category} />
                            <span className="text-[10px] text-ink-300 font-medium">⏱️ {readTime(post.content)} min</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-ink leading-snug mb-2 group-hover:text-fjord transition-colors duration-200 line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-ink-400 text-sm leading-relaxed mb-4 line-clamp-2">{excerpt(post.content, 100)}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-sand-dark/40">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Image
                                    src={post.profiles?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${post.profiles?.username || 'anon'}&backgroundColor=5B89A8`}
                                    alt="" 
                                    width={28}
                                    height={28}
                                    className="rounded-full border border-sand-dark object-cover shrink-0"
                                    unoptimized={!post.profiles?.avatar_url}
                                />
                                {post.allowLicensing && (
                                    <Check className="w-3.5 h-3.5 text-amber-600" />
                                )}
                                <span className="text-xs text-ink-300 truncate" title={authorInfo.tooltip}>
                                    {authorInfo.label}
                                    {` · ${timeAgo(post.created_at)}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-ink-300">
                                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.view_count}</span>
                                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{post.comment_count ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Small Card ─── */
export function SmallCard({ post, index }: { post: Post; index: number }) {
    const router = useRouter();
    const authorName = post.profiles?.username || post.authorName || 'Anonym';
    const authorInfo = getCardAuthorDisplay(authorName, post.coAuthors);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={index < 3 ? { opacity: 1, y: 0 } : undefined}
            whileInView={index >= 3 ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: '400px' }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="rounded-2xl"
        >
            <motion.div variants={cardVariants} initial="rest" whileHover="hover" transition={cardTransition} className="rounded-2xl">
                <div
                    className="block group cursor-pointer bg-white rounded-2xl border border-sand-dark/40 overflow-hidden p-4"
                    onClick={() => router.push(`/posts/${post.slug}`)}
                    role="article"
                >
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 mt-0.5"><CategoryBadge category={post.category} /></div>
                        <div className="min-w-0">
                            <h4 className="font-display text-sm font-bold text-ink leading-snug line-clamp-2 group-hover:text-fjord transition-colors duration-200">
                                {post.title}
                            </h4>
                            <p className="text-xs text-ink-300 mt-1.5 flex flex-wrap gap-x-1">
                                <span className="font-medium text-ink-300" title={authorInfo.tooltip}>{authorInfo.label}</span>
                                <span className="text-ink-300">· {timeAgo(post.created_at)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Ad Slot ─── */
export function AdCard() {
    const router = useRouter();
    return (
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="rounded-2xl">
            <motion.div variants={cardVariants} initial="rest" whileHover="hover" transition={cardTransition} className="rounded-2xl">
                <div
                    className="cursor-pointer bg-white rounded-2xl border-2 border-dashed border-sand-dark/60 p-5 flex flex-col items-center justify-center text-center min-h-[120px]"
                    onClick={() => router.push('/kontakt')}
                    role="link"
                >
                    <span className="text-xs font-semibold text-ink-300 uppercase tracking-widest mb-1">Sponset innhold</span>
                    <p className="text-sm text-ink-400 font-medium">Annonseplass ledig</p>
                    <p className="text-xs text-fjord mt-1 font-medium">kontakt@ytre.no →</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Inline Ad (for article body) ─── */
export function InlineAd() {
    return (
        <div className="my-8 rounded-2xl border-2 border-dashed border-sand-dark/50 p-4 text-center bg-sand/40">
            <span className="text-xs font-semibold text-ink-300 uppercase tracking-widest">Sponset</span>
            <p className="text-sm text-ink-400 mt-1">Annonseplass</p>
        </div>
    );
}
