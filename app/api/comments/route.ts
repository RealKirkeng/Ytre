import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getAllUsers } from '@/lib/local-auth.server';
import { getComments, createComment, getCommentsByAuthor, syncStoreFromKV, flushStoreToKV } from '@/lib/local-store.server';

export const runtime = 'nodejs';

// GET /api/comments?postId=xxx&authorId=yyy
export async function GET(req: NextRequest) {
    await syncStoreFromKV();
    const postId = req.nextUrl.searchParams.get('postId');
    const authorId = req.nextUrl.searchParams.get('authorId');

    if (authorId) {
        return NextResponse.json(getCommentsByAuthor(authorId));
    }

    if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });
    const comments = getComments(postId);

    // Join with cached user data
    const users = getAllUsers();
    const userMap = new Map<string, string | undefined>(users.map(u => [u.id, u.avatarUrl]));

    const enriched = comments.map(c => ({
        ...c,
        authorAvatar: userMap.get(c.authorId)
    }));

    return NextResponse.json(enriched);
}

// POST /api/comments
export async function POST(req: NextRequest) {
    await syncStoreFromKV();
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Logg inn for å kommentere.' }, { status: 401 });

    const { postId, content, parentId } = await req.json();
    if (!postId || !content?.trim()) {
        return NextResponse.json({ error: 'postId og innhold er påkrevd.' }, { status: 400 });
    }
    if (content.length > 500) {
        return NextResponse.json({ error: 'Kommentar er for lang (maks 500 tegn).' }, { status: 400 });
    }

    const comment = createComment({
        postId, content: content.trim(), parentId,
        authorId: user.id, authorName: user.name,
    });

    await flushStoreToKV();

    return NextResponse.json(comment, { status: 201 });
}
