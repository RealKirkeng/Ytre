import { NextRequest, NextResponse } from 'next/server';
import { incrementViewCount } from '@/lib/local-store.server';

export const runtime = 'nodejs';

// POST /api/posts/view  { id: "post-id" }
export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        incrementViewCount(id);
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
