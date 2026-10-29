/**
 * Remote storage helper supporting Supabase (PostgreSQL REST API)
 * as well as Vercel KV / Upstash Redis.
 * Zero external runtime dependencies (uses native fetch).
 */

function findEnv(candidates: string[], suffixFallback?: string[]): string | undefined {
    for (const name of candidates) {
        const val = process.env[name];
        if (val && val.trim().length > 0) return val.trim();
    }
    if (suffixFallback) {
        for (const suffix of suffixFallback) {
            for (const [k, v] of Object.entries(process.env)) {
                if (k.endsWith(suffix) && v && v.trim().length > 0) {
                    return v.trim();
                }
            }
        }
    }
    return undefined;
}

function getSupabaseConfig(): { url: string; key: string } | null {
    const url = findEnv(
        [
            'NEXT_PUBLIC_SUPABASE_URL',
            'SUPABASE_URL',
            'NEXT_PUBLIC_STORAGE_SUPABASE_URL',
            'STORAGE_SUPABASE_URL',
        ],
        ['SUPABASE_URL']
    );
    const key = findEnv(
        [
            'SUPABASE_SERVICE_ROLE_KEY',
            'STORAGE_SUPABASE_SERVICE_ROLE_KEY',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'SUPABASE_ANON_KEY',
            'NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY',
            'STORAGE_SUPABASE_ANON_KEY',
            'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
            'STORAGE_SUPABASE_PUBLISHABLE_KEY',
        ],
        ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY', 'SUPABASE_PUBLISHABLE_KEY']
    );

    if (url && url.startsWith('http') && key && key.length > 10) {
        return { url: url.replace(/\/$/, ''), key };
    }
    return null;
}

function getUpstashConfig(): { url: string; token: string } | null {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) return { url, token };
    return null;
}

export function isRemoteKVConfigured(): boolean {
    return Boolean(getSupabaseConfig() || getUpstashConfig());
}

async function syncStructuredPostsTable(
    sb: { url: string; key: string },
    posts: any[]
): Promise<void> {
    try {
        if (posts.length > 0) {
            const rows = posts.map(p => ({
                id: String(p.id),
                slug: String(p.slug),
                title: String(p.title || ''),
                subtitle: p.subtitle ?? null,
                content: String(p.content || ''),
                category: String(p.category || 'society'),
                image_url: p.image_url ?? null,
                image_caption: p.imageCaption ?? null,
                photographer: p.photographer ?? null,
                status: String(p.status || 'pending'),
                view_count: Number(p.view_count ?? 0),
                flag_count: Number(p.flag_count ?? 0),
                is_featured: Boolean(p.is_featured),
                author_id: String(p.authorId || 'anon'),
                author_name: String(p.authorName || 'Anonym'),
                regions: p.regions ?? null,
                audience: p.audience ?? null,
                angle: p.angle ?? null,
                reading_level: p.readingLevel ?? null,
                sources: p.sources ?? null,
                organization: p.organization ?? null,
                position: p.position ?? null,
                org_level: p.orgLevel ?? null,
                co_authors: p.coAuthors ?? null,
                allow_licensing: Boolean(p.allowLicensing),
                reactions: p.reactions ?? {},
                created_at: p.createdAt || new Date().toISOString(),
                updated_at: p.updatedAt || new Date().toISOString(),
            }));

            await fetch(`${sb.url}/rest/v1/posts?on_conflict=id`, {
                method: 'POST',
                headers: {
                    apikey: sb.key,
                    Authorization: `Bearer ${sb.key}`,
                    'Content-Type': 'application/json',
                    Prefer: 'resolution=merge-duplicates,return=minimal',
                },
                body: JSON.stringify(rows),
                cache: 'no-store',
            });
        }
    } catch (err) {
        console.warn('[remoteKV] Failed to mirror posts to public.posts table:', err);
    }
}

export async function remoteKVGet<T>(key: string): Promise<T | null> {
    const sb = getSupabaseConfig();
    if (sb) {
        try {
            const res = await fetch(
                `${sb.url}/rest/v1/app_kv?key=eq.${encodeURIComponent(key)}&select=value`,
                {
                    method: 'GET',
                    headers: {
                        apikey: sb.key,
                        Authorization: `Bearer ${sb.key}`,
                        Accept: 'application/json',
                    },
                    cache: 'no-store',
                }
            );
            if (!res.ok) {
                console.warn(`[remoteKV] Supabase GET "${key}" HTTP ${res.status}`);
                return null;
            }
            const rows = await res.json();
            if (!Array.isArray(rows) || rows.length === 0) return null;
            const val = rows[0]?.value;
            if (val === undefined || val === null) return null;
            if (typeof val === 'string') {
                try {
                    return JSON.parse(val) as T;
                } catch {
                    return val as unknown as T;
                }
            }
            return val as T;
        } catch (err) {
            console.warn(`[remoteKV] Supabase error fetching key "${key}":`, err);
            return null;
        }
    }

    const upstash = getUpstashConfig();
    if (upstash) {
        try {
            const res = await fetch(`${upstash.url}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${upstash.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(['GET', key]),
                cache: 'no-store',
            });
            if (!res.ok) return null;
            const json = await res.json();
            if (json.result === null || json.result === undefined) return null;
            if (typeof json.result === 'string') {
                try {
                    return JSON.parse(json.result);
                } catch {
                    return json.result as unknown as T;
                }
            }
            return json.result as T;
        } catch (err) {
            console.warn(`[remoteKV] Upstash error fetching key "${key}":`, err);
            return null;
        }
    }

    return null;
}

export async function remoteKVSet<T>(key: string, value: T): Promise<boolean> {
    const sb = getSupabaseConfig();
    if (sb) {
        try {
            const res = await fetch(`${sb.url}/rest/v1/app_kv?on_conflict=key`, {
                method: 'POST',
                headers: {
                    apikey: sb.key,
                    Authorization: `Bearer ${sb.key}`,
                    'Content-Type': 'application/json',
                    Prefer: 'resolution=merge-duplicates,return=minimal',
                },
                body: JSON.stringify({
                    key,
                    value,
                    updated_at: new Date().toISOString(),
                }),
                cache: 'no-store',
            });

            if (key === 'posts' && Array.isArray(value)) {
                await syncStructuredPostsTable(sb, value);
            }

            if (!res.ok) {
                console.warn(`[remoteKV] Supabase SET "${key}" HTTP ${res.status}`);
            }
            return res.ok;
        } catch (err) {
            console.warn(`[remoteKV] Supabase error setting key "${key}":`, err);
            return false;
        }
    }

    const upstash = getUpstashConfig();
    if (upstash) {
        try {
            const payload = typeof value === 'string' ? value : JSON.stringify(value);
            const res = await fetch(`${upstash.url}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${upstash.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(['SET', key, payload]),
                cache: 'no-store',
            });
            return res.ok;
        } catch (err) {
            console.warn(`[remoteKV] Upstash error setting key "${key}":`, err);
            return false;
        }
    }

    return false;
}
