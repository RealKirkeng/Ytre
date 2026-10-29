import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getAllUsers } from '@/lib/local-auth.server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;

    if (!user?.isAdmin) {
        return NextResponse.json({ error: 'Ikke tilgang.' }, { status: 403 });
    }

    try {
        const users = getAllUsers();
        return NextResponse.json(users);
    } catch {
        return NextResponse.json({ error: 'Kunne ikke hente brukere.' }, { status: 500 });
    }
}
