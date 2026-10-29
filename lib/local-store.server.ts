/**
 * SERVER-ONLY local stores for posts and comments.
 * Data is persisted in data/posts.json and data/comments.json.
 */

import fs from 'fs';
import path from 'path';

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

// ── In-Memory Caches ──────────────────────────────────────────────────────────
let postsCache: LocalPost[] | null = null;
let commentsCache: LocalComment[] | null = null;
let settingsCache: SiteSettings | null = null;
let videosCache: LocalVideo[] | null = null;

function getCachedPosts(): LocalPost[] {
    if (postsCache === null) {
        postsCache = readJSON<LocalPost[]>(POSTS_FILE, []);
    }
    return postsCache;
}

function setCachedPosts(posts: LocalPost[]): void {
    postsCache = posts;
    writeJSON(POSTS_FILE, posts);
}

function getCachedComments(): LocalComment[] {
    if (commentsCache === null) {
        commentsCache = readJSON<LocalComment[]>(COMMENTS_FILE, []);
    }
    return commentsCache;
}

function setCachedComments(comments: LocalComment[]): void {
    commentsCache = comments;
    writeJSON(COMMENTS_FILE, comments);
}

function getCachedSettings(): SiteSettings {
    if (settingsCache === null) {
        settingsCache = readJSON<SiteSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
    }
    return settingsCache;
}

function setCachedSettings(settings: SiteSettings): void {
    settingsCache = settings;
    writeJSON(SETTINGS_FILE, settings);
}

function getCachedVideos(): LocalVideo[] {
    if (videosCache === null) {
        videosCache = readJSON<LocalVideo[]>(VIDEOS_FILE, []);
    }
    return videosCache;
}

function setCachedVideos(videos: LocalVideo[]): void {
    videosCache = videos;
    writeJSON(VIDEOS_FILE, videos);
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

export function getPostBySlug(slug: string): LocalPost | null {
    return getCachedPosts().find(p => p.slug === slug && p.status === 'published') ?? null;
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

export function getPendingPosts(): LocalPost[] {
    return getCachedPosts()
        .filter(p => p.status === 'pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPostsByAuthor(authorId: string): LocalPost[] {
    return getCachedPosts()
        .filter(p => p.authorId === authorId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
