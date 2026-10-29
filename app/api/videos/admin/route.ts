import { NextRequest, NextResponse } from 'next/server';
import { getAllVideos } from '@/lib/local-store.server';
import { verifyToken } from '@/lib/local-auth.server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;
        const user = token ? await verifyToken(token) : null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const allVideos = getAllVideos();
        return NextResponse.json(allVideos);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
