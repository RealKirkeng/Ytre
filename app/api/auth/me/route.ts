import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, seedTestUser } from '@/lib/local-auth.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    await seedTestUser(); // Ensure test user always exists
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json(null);
    const session = await verifyToken(token);
    if (!session) return NextResponse.json(null);

    // Fetch latest user data from storage to include avatar, theme etc.
    const { getUserById } = await import('@/lib/local-auth.server');
    const fullUser = getUserById(session.id);
    if (!fullUser) return NextResponse.json(null);

    const { passwordHash: _, ...user } = fullUser;
    return NextResponse.json(user);
}
