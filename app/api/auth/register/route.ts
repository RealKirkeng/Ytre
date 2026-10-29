import { NextRequest, NextResponse } from 'next/server';
import { createUser, signToken, seedTestUser } from '@/lib/local-auth.server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    await seedTestUser();
    try {
        const { firstName, middleName, lastName, email, password } = await request.json();

        if (!firstName?.trim() || firstName.trim().length < 2)
            return NextResponse.json({ error: 'Fornavn må ha minst 2 tegn.' }, { status: 400 });
        if (!lastName?.trim() || lastName.trim().length < 2)
            return NextResponse.json({ error: 'Etternavn må ha minst 2 tegn.' }, { status: 400 });
        if (!email?.includes('@'))
            return NextResponse.json({ error: 'Ugyldig e-postadresse.' }, { status: 400 });
        if (!password || password.length < 4)
            return NextResponse.json({ error: 'Passordet må ha minst 4 tegn.' }, { status: 400 });

        const user = await createUser(firstName, middleName, lastName, email, password);
        const token = await signToken(user);

        const res = NextResponse.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin });
        res.cookies.set('auth-token', token, {
            httpOnly: true, secure: false, sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, path: '/',
        });
        return res;
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Noe gikk galt.' }, { status: 400 });
    }
}
