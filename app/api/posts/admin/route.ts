import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/local-auth.server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const POSTS_FILE = path.join(process.cwd(), 'data', 'posts.json');

// GET — admin only — returns ALL posts (any status)
export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user?.isAdmin) return NextResponse.json({ error: 'Ikke tilgang.' }, { status: 403 });

    try {
        if (!fs.existsSync(POSTS_FILE)) return NextResponse.json([]);
        const all = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
        return NextResponse.json(
            all.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
    } catch {
        return NextResponse.json([]);
    }
}
