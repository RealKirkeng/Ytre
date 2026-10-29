import { NextRequest, NextResponse } from 'next/server';
import { updatePost, getPostBySlug } from '@/lib/local-store.server';
import { verifyToken } from '@/lib/local-auth.server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });

    try {
        const { slug, type } = await req.json();
        if (!slug || !type) return NextResponse.json({ error: 'Mangler data' }, { status: 400 });

        const post = getPostBySlug(slug);
        if (!post) return NextResponse.json({ error: 'Fant ikke innlegg' }, { status: 404 });

        const reactions = post.reactions || {};
        const typeUsers = reactions[type] || [];

        const hasReacted = typeUsers.includes(user.id);

        let newTypeUsers;
        if (hasReacted) {
            newTypeUsers = typeUsers.filter(id => id !== user.id);
        } else {
            newTypeUsers = [...typeUsers, user.id];
        }

        const newReactions = { ...reactions, [type]: newTypeUsers };

        const updated = updatePost(post.id, { reactions: newReactions });

        if (!updated) return NextResponse.json({ error: 'Kunne ikke oppdatere' }, { status: 500 });

        return NextResponse.json({ success: true, reactions: newReactions });
    } catch {
        return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
    }
}
