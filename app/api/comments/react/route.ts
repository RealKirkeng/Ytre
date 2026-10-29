import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '@/lib/local-auth.server';
import { LocalComment } from '@/lib/local-store.server';

export const runtime = 'nodejs';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

export async function POST(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });

    try {
        const { commentId, type } = await req.json();
        if (!commentId || !type) return NextResponse.json({ error: 'Mangler data' }, { status: 400 });

        if (!fs.existsSync(COMMENTS_FILE)) return NextResponse.json({ error: 'Fant ikke kommentar' }, { status: 404 });

        const comments: LocalComment[] = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
        const idx = comments.findIndex(c => c.id === commentId);

        if (idx === -1) return NextResponse.json({ error: 'Fant ikke kommentar' }, { status: 404 });

        const comment = comments[idx];
        const reactions = comment.reactions || {};
        const typeUsers = reactions[type] || [];

        const hasReacted = typeUsers.includes(user.id);

        let newTypeUsers;
        if (hasReacted) {
            newTypeUsers = typeUsers.filter(id => id !== user.id);
        } else {
            newTypeUsers = [...typeUsers, user.id];
        }

        const newReactions = { ...reactions, [type]: newTypeUsers };
        comments[idx].reactions = newReactions;

        fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');

        return NextResponse.json({ success: true, reactions: newReactions });
    } catch {
        return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
    }
}
