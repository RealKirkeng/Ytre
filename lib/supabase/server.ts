import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Fully chainable thenable stub — resolves to { data: null, error: null } */
function makeChain(): any {
    const chain: any = {
        then(resolve: any, reject: any) {
            return Promise.resolve({ data: null, error: null }).then(resolve, reject);
        },
        catch(reject: any) {
            return Promise.resolve({ data: null, error: null }).catch(reject);
        },
    };
    // Route every call back to the same chain so any depth works
    return new Proxy(chain, {
        get(target, prop) {
            if (prop in target) return target[prop];
            return () => makeChain(); // method() → another chain
        },
    });
}

function makeStub() {
    return {
        auth: { getUser: async () => ({ data: { user: null }, error: null }) },
        from: (_table: string) => makeChain(),
    };
}

export async function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

    if (!url.startsWith('http')) return makeStub() as any;

    // Next.js 16: cookies() is async
    const cookieStore = await cookies();

    return createServerClient(url, key, {
        cookies: {
            get(name: string) { return cookieStore.get(name)?.value; },
            set(name: string, value: string, options: CookieOptions) {
                try { cookieStore.set({ name, value, ...options }); } catch { }
            },
            remove(name: string, options: CookieOptions) {
                try { cookieStore.set({ name, value: '', ...options }); } catch { }
            },
        },
    });
}
