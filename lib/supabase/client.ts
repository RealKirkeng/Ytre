import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

    // Return safe stub when not yet configured
    if (!url.startsWith('http')) {
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signInWithPassword: async () => ({ data: {}, error: null }),
                signUp: async () => ({ data: { user: null }, error: null }),
                signOut: async () => ({}),
                onAuthStateChange: (_e: any, _cb: any) => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
            from: () => ({
                select: () => ({ eq: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }), single: () => Promise.resolve({ data: null, error: null }), limit: () => Promise.resolve({ data: [], error: null }) }), order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }), single: () => Promise.resolve({ data: null, error: null }) }),
                insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }), then: () => Promise.resolve({ error: null }) }),
                update: () => ({ eq: () => Promise.resolve({ error: null }) }),
            }),
        } as any;
    }

    return createBrowserClient(url, key);
}
