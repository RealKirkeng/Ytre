import { NextRequest, NextResponse } from 'next/server';
import { getVideos, createVideo, updateVideo, deleteVideo } from '@/lib/local-store.server';
import { verifyToken } from '@/lib/local-auth.server';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const videos = getVideos();
    return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;
        const user = token ? await verifyToken(token) : null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await req.formData();
        const title = formData.get('title')?.toString();
        const description = formData.get('description')?.toString() || '';
        const file = formData.get('file') as File | null;
        let videoUrl = formData.get('videoUrl')?.toString();

        if (!title) return NextResponse.json({ error: 'Tittel er påkrevd.' }, { status: 400 });
        if (!file && !videoUrl) return NextResponse.json({ error: 'Video fil eller lenke er påkrevd.' }, { status: 400 });
        if (file && file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'Videofilen er for stor. Maks 50MB.' }, { status: 400 });

        let finalVideoUrl = videoUrl || '';

        // If file is provided, save it to disk
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create safe filename
            const ext = path.extname(file.name) || '.mp4';
            const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
            const filename = `${safeTitle}-${Date.now()}${ext}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);
            finalVideoUrl = `/uploads/videos/${filename}`;
        }

        const video = createVideo({
            title,
            description,
            videoUrl: finalVideoUrl,
            status: 'pending',
            authorId: user.id,
            authorName: user.name || 'Anonym',
        });
        return NextResponse.json(video, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;
        const user = token ? await verifyToken(token) : null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { id, status } = await req.json();
        const video = updateVideo(id, { status });
        return NextResponse.json(video);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const token = req.cookies.get('auth-token')?.value;
        const user = token ? await verifyToken(token) : null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { id } = await req.json();
        deleteVideo(id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
