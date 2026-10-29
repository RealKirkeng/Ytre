/**
 * Remote KV storage helper.
 * Automatically activates if Vercel KV or Upstash Redis is configured
 * via KV_REST_API_URL / KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN.
 * Zero external dependencies (uses native fetch).
 */

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export function isRemoteKVConfigured(): boolean {
    return Boolean(KV_URL && KV_TOKEN);
}

export async function remoteKVGet<T>(key: string): Promise<T | null> {
    if (!isRemoteKVConfigured()) return null;
    try {
        const res = await fetch(`${KV_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
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
        console.warn(`[remoteKV] Error fetching key "${key}":`, err);
        return null;
    }
}

export async function remoteKVSet<T>(key: string, value: T): Promise<boolean> {
    if (!isRemoteKVConfigured()) return false;
    try {
        const payload = typeof value === 'string' ? value : JSON.stringify(value);
        const res = await fetch(`${KV_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(['SET', key, payload]),
            cache: 'no-store',
        });
        return res.ok;
    } catch (err) {
        console.warn(`[remoteKV] Error setting key "${key}":`, err);
        return false;
    }
}
