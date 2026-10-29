import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/local-auth.server';
import { getAllPostsAdmin, syncStoreFromKV } from '@/lib/local-store.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET — admin only — returns ALL posts (any status)
export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user?.isAdmin) return NextResponse.json({ error: 'Ikke tilgang.' }, { status: 403 });

    try {
        await syncStoreFromKV();
        const posts = getAllPostsAdmin();
        return NextResponse.json(posts, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        });
    } catch {
        return NextResponse.json([]);
    }
}
