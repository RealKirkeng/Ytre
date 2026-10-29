import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/local-store.server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const settings = getSettings();
    return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const settings = updateSettings(body);
        return NextResponse.json(settings);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
