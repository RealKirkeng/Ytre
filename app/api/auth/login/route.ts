import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, signToken } from '@/lib/local-auth.server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password)
            return NextResponse.json({ error: 'E-post og passord er påkrevd.' }, { status: 400 });

        const user = await authenticateUser(email, password);
        if (!user)
            return NextResponse.json({ error: 'Feil e-post eller passord.' }, { status: 401 });

        const token = await signToken(user);
        
        const res = NextResponse.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
        res.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return res;
    } catch (err: any) {
        console.error('[login error]', err);
        return NextResponse.json({ error: err.message || 'Noe gikk galt.' }, { status: 500 });
    }
}
