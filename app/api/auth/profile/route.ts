import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, updateUser, signToken } from '@/lib/local-auth.server';
import { cookies } from 'next/headers';
import { processBase64Image } from '@/lib/image-upload.server';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Ikke logget inn.' }, { status: 401 });

    const session = await verifyToken(token);
    if (!session) return NextResponse.json({ error: 'Ugyldig sesjon.' }, { status: 401 });

    try {
        const data = await request.json();
        const updatePayload: any = {};
        if (data.avatarUrl !== undefined) {
            updatePayload.avatarUrl = await processBase64Image(data.avatarUrl, 'avatar');
        }
        if (data.theme !== undefined) updatePayload.theme = data.theme;
        if (data.font !== undefined) updatePayload.font = data.font;

        // Update user in storage
        const updatedUser = await updateUser(session.id, updatePayload);

        // Generate new token with updated avatar
        const newToken = await signToken(updatedUser);

        // Set updated cookie
        const response = NextResponse.json({ success: true, user: updatedUser });
        (await cookies()).set('auth-token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return response;
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
