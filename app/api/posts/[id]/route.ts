import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/local-auth.server';
import { getPostById } from '@/lib/local-store.server';

export const runtime = 'nodejs';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;

    // We allow the author or an admin to fetch the post by ID
    if (!user) return NextResponse.json({ error: 'Ikke logget inn.' }, { status: 401 });

    try {
        const post = getPostById(id);
        if (!post) return NextResponse.json({ error: 'Post ikke funnet.' }, { status: 404 });

        if (!user.isAdmin && post.authorId !== user.id) {
            return NextResponse.json({ error: 'Ikke tilgang.' }, { status: 403 });
        }

        return NextResponse.json(post);
    } catch {
        return NextResponse.json({ error: 'Internt feil.' }, { status: 500 });
    }
}
