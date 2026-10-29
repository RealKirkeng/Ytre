/**
 * SERVER-ONLY local stores for posts and comments.
 * Data is persisted in data/posts.json and data/comments.json.
 */

import fs from 'fs';
import path from 'path';
import { getAllUsers } from './local-auth.server';

const DATA_DIR = path.join(process.cwd(), 'data');

// ── Types ─────────────────────────────────────────────────────────────────────
export type GeoLevel = 'global' | 'national' | 'fylke' | 'kommune';

export interface GeoRegion {
    level: GeoLevel;
    id: string;
    name: string;
}

export interface LocalPost {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    content: string;
    category: string;
    image_url?: string;
    imageCaption?: string;
    photographer?: string;
    status: 'published' | 'draft' | 'pending' | 'rejected';
    view_count: number;
    flag_count: number;
    is_featured: boolean;
    createdAt: string;
    updatedAt?: string;
    authorId: string;
    authorName: string;
    regions?: GeoRegion[];
    audience?: string[];
    angle?: string;
    readingLevel?: string;
    sources?: string[];
    organization?: string;
    position?: string;
    orgLevel?: string;
    coAuthors?: string[];
    allowLicensing?: boolean;
    reactions?: Record<string, string[]>; // { reactionType: [userId1, userId2] }
}

export interface LocalComment {
    id: string;
    postId: string;
    parentId?: string; // For nesting
    content: string;
    createdAt: string;
    authorId: string;
    authorName: string;
    reactions?: Record<string, string[]>;
}

export interface LocalVideo {
    id: string;
    title: string;
    description?: string;
    videoUrl: string; // The link provided by the user (YT, Vimeo, TikTok, direct mp4, etc.)
    status: 'published' | 'pending' | 'rejected';
    view_count: number;
    createdAt: string;
    updatedAt?: string;
    authorId: string;
    authorName: string;
    reactions?: Record<string, string[]>;
}

export interface SiteSettings {
    isVideoFeatureEnabled: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
    isVideoFeatureEnabled: false,
};

// ── File helpers ──────────────────────────────────────────────────────────────
function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
    ensureDir();
    if (!fs.existsSync(file)) return fallback;
    try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
    catch { return fallback; }
}

function writeJSON<T>(file: string, data: T): void {
    ensureDir();
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');

function getFileMtime(filePath: string): number {
    try {
        if (!fs.existsSync(filePath)) return 0;
        return fs.statSync(filePath).mtimeMs;
    } catch {
        return 0;
    }
}

// ── In-Memory Caches with Auto-Mtime Invalidation ─────────────────────────────
let postsMtime = 0;
let postsCache: LocalPost[] | null = null;

let commentsMtime = 0;
let commentsCache: LocalComment[] | null = null;

let settingsMtime = 0;
let settingsCache: SiteSettings | null = null;

let videosMtime = 0;
let videosCache: LocalVideo[] | null = null;

function getCachedPosts(): LocalPost[] {
    const currentMtime = getFileMtime(POSTS_FILE);
    if (postsCache === null || currentMtime !== postsMtime) {
        postsCache = readJSON<LocalPost[]>(POSTS_FILE, []);
        postsMtime = currentMtime;
    }
    return postsCache;
}

function setCachedPosts(posts: LocalPost[]): void {
    writeJSON(POSTS_FILE, posts);
    postsMtime = getFileMtime(POSTS_FILE);
    postsCache = posts;
}

function getCachedComments(): LocalComment[] {
    const currentMtime = getFileMtime(COMMENTS_FILE);
    if (commentsCache === null || currentMtime !== commentsMtime) {
        commentsCache = readJSON<LocalComment[]>(COMMENTS_FILE, []);
        commentsMtime = currentMtime;
    }
    return commentsCache;
}

function setCachedComments(comments: LocalComment[]): void {
    writeJSON(COMMENTS_FILE, comments);
    commentsMtime = getFileMtime(COMMENTS_FILE);
    commentsCache = comments;
}

function getCachedSettings(): SiteSettings {
    const currentMtime = getFileMtime(SETTINGS_FILE);
    if (settingsCache === null || currentMtime !== settingsMtime) {
        settingsCache = readJSON<SiteSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
        settingsMtime = currentMtime;
    }
    return settingsCache;
}

function setCachedSettings(settings: SiteSettings): void {
    writeJSON(SETTINGS_FILE, settings);
    settingsMtime = getFileMtime(SETTINGS_FILE);
    settingsCache = settings;
}

function getCachedVideos(): LocalVideo[] {
    const currentMtime = getFileMtime(VIDEOS_FILE);
    if (videosCache === null || currentMtime !== videosMtime) {
        videosCache = readJSON<LocalVideo[]>(VIDEOS_FILE, []);
        videosMtime = currentMtime;
    }
    return videosCache;
}

function setCachedVideos(videos: LocalVideo[]): void {
    writeJSON(VIDEOS_FILE, videos);
    videosMtime = getFileMtime(VIDEOS_FILE);
    videosCache = videos;
}

// ── Settings operations ───────────────────────────────────────────────────────
export function getSettings(): SiteSettings {
    const data = getCachedSettings();
    return { ...DEFAULT_SETTINGS, ...data };
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = getSettings();
    const next = { ...current, ...updates };
    setCachedSettings(next);
    return next;
}

// ── Post operations ───────────────────────────────────────────────────────────
export function getPosts(category?: string, region?: string): LocalPost[] {
    let all = getCachedPosts().filter(p => p.status === 'published');
    if (category) {
        all = all.filter(p => p.category === category);
    }
    if (region) {
        all = all.filter(p => p.regions?.some(r => r.id === region));
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface EnrichedPost extends Omit<LocalPost, 'createdAt'> {
    created_at: string;
    comment_count: number;
    profiles: {
        username: string;
        avatar_url?: string;
    };
}

export function getEnrichedPosts(filter?: {
    category?: string;
    region?: string;
    authorId?: string;
    includeUnpublished?: boolean;
}): EnrichedPost[] {
    const posts = getCachedPosts();
    const comments = getCachedComments();
    const users = getAllUsers();

    const userMap = new Map<string, { username: string; avatarUrl?: string }>();
    for (let i = 0; i < users.length; i++) {
        const u = users[i];
        userMap.set(u.id, { username: u.name, avatarUrl: u.avatarUrl });
    }

    const commentCountMap = new Map<string, number>();
    for (let i = 0; i < comments.length; i++) {
        const c = comments[i];
        commentCountMap.set(c.postId, (commentCountMap.get(c.postId) || 0) + 1);
    }

    const result: EnrichedPost[] = [];
    for (let i = 0; i < posts.length; i++) {
        const p = posts[i];
        if (!filter?.includeUnpublished && p.status !== 'published') continue;
        if (filter?.authorId && p.authorId !== filter.authorId) continue;
        if (filter?.category && p.category !== filter.category) continue;
        if (filter?.region && !p.regions?.some(r => r.id === filter.region || r.level === filter.region)) continue;

        const author = userMap.get(p.authorId);
        result.push({
            ...p,
            image_url: p.image_url || undefined,
            created_at: p.createdAt,
            profiles: {
                username: author?.username || p.authorName || 'Anonym',
                avatar_url: author?.avatarUrl
            },
            comment_count: commentCountMap.get(p.id) || 0,
        });
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getPostBySlug(slug: string): LocalPost | null {
    return getCachedPosts().find(p => p.slug === slug && p.status === 'published') ?? null;
}

export function getEnrichedPostBySlug(slug: string): EnrichedPost | null {
    const post = getPostBySlug(slug);
    if (!post) return null;
    const comments = getCachedComments();
    const users = getAllUsers();
    const author = users.find(u => u.id === post.authorId);
    let count = 0;
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].postId === post.id) count++;
    }
    return {
        ...post,
        image_url: post.image_url || undefined,
        created_at: post.createdAt,
        profiles: {
            username: author?.name || post.authorName || 'Anonym',
            avatar_url: author?.avatarUrl
        },
        comment_count: count
    };
}

export function getPostById(id: string): LocalPost | null {
    return getCachedPosts().find(p => p.id === id) ?? null;
}

export function createPost(data: Omit<LocalPost, 'id' | 'view_count' | 'flag_count' | 'is_featured' | 'createdAt'>): LocalPost {
    const posts = getCachedPosts();
    const post: LocalPost = {
        id: crypto.randomUUID(),
        view_count: 0, flag_count: 0, is_featured: false,
        createdAt: new Date().toISOString(),
        reactions: {},
        ...data,
    };
    posts.unshift(post);
    setCachedPosts(posts);
    return post;
}

export function incrementViewCount(id: string): void {
    const posts = getCachedPosts();
    const p = posts.find(x => x.id === id);
    if (p) { p.view_count++; setCachedPosts(posts); }
}

export function getAllPostsAdmin(): LocalPost[] {
    return [...getCachedPosts()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPendingPosts(): LocalPost[] {
    return getCachedPosts()
        .filter(p => p.status === 'pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPostsByAuthor(authorId: string): LocalPost[] {
    return getCachedPosts()
        .filter(p => p.authorId === authorId)
        .map(p => ({
            ...p,
            image_url: p.image_url || undefined
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function updateAuthorPostsAvatar(_authorId: string, _avatarUrl: string): void {
    // No-op: author avatar should never overwrite article cover images
}

export function updatePost(id: string, updates: Partial<Pick<LocalPost, 'title' | 'subtitle' | 'content' | 'category' | 'status' | 'regions' | 'image_url' | 'imageCaption' | 'photographer' | 'audience' | 'angle' | 'readingLevel' | 'sources' | 'organization' | 'position' | 'orgLevel' | 'allowLicensing' | 'reactions'>>): LocalPost | null {
    const posts = getCachedPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    posts[idx] = { ...posts[idx], ...updates, updatedAt: new Date().toISOString() };
    setCachedPosts(posts);
    return posts[idx];
}

export function deletePost(id: string): boolean {
    const posts = getCachedPosts();
    const after = posts.filter(p => p.id !== id);
    if (posts.length === after.length) return false;
    setCachedPosts(after);
    return true;
}

export function incrementPostFlagCount(postIdOrSlug: string): void {
    const posts = getCachedPosts();
    const p = posts.find(x => x.id === postIdOrSlug || x.slug === postIdOrSlug);
    if (p) {
        p.flag_count = (p.flag_count || 0) + 1;
        setCachedPosts(posts);
    }
}

// ── Comment operations ────────────────────────────────────────────────────────
export function getComments(postId: string): LocalComment[] {
    return getCachedComments()
        .filter(c => c.postId === postId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getCommentsByAuthor(authorId: string): LocalComment[] {
    return getCachedComments()
        .filter(c => c.authorId === authorId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createComment(data: Omit<LocalComment, 'id' | 'createdAt'>): LocalComment {
    const comments = getCachedComments();
    const comment: LocalComment = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        reactions: {},
        ...data,
    };
    comments.push(comment);
    setCachedComments(comments);
    return comment;
}

// ── Video operations ──────────────────────────────────────────────────────────
export function getAllVideos(): LocalVideo[] {
    return getCachedVideos()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getVideos(): LocalVideo[] {
    return getCachedVideos()
        .filter(v => v.status === 'published')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPendingVideos(): LocalVideo[] {
    return getCachedVideos()
        .filter(v => v.status === 'pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createVideo(data: Omit<LocalVideo, 'id' | 'view_count' | 'createdAt'>): LocalVideo {
    const videos = getCachedVideos();
    const video: LocalVideo = {
        id: crypto.randomUUID(),
        view_count: 0,
        createdAt: new Date().toISOString(),
        reactions: {},
        ...data,
    };
    videos.unshift(video);
    setCachedVideos(videos);
    return video;
}

export function updateVideo(id: string, updates: Partial<LocalVideo>): LocalVideo | null {
    const videos = getCachedVideos();
    const idx = videos.findIndex(v => v.id === id);
    if (idx === -1) return null;
    videos[idx] = { ...videos[idx], ...updates, updatedAt: new Date().toISOString() };
    setCachedVideos(videos);
    return videos[idx];
}

export function incrementVideoViewCount(id: string): void {
    const videos = getCachedVideos();
    const v = videos.find(x => x.id === id);
    if (v) { v.view_count++; setCachedVideos(videos); }
}

export function deleteVideo(id: string): void {
    const videos = getCachedVideos();
    setCachedVideos(videos.filter(v => v.id !== id));
}
