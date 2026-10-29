import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById } from '@/lib/local-auth.server';
import { getPosts, createPost, getPostsByAuthor, updatePost, deletePost, getPostById, getEnrichedPosts, syncStoreFromKV } from '@/lib/local-store.server';
import { processBase64Image, processContentImages } from '@/lib/image-upload.server';

export const runtime = 'nodejs';

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-').trim().slice(0, 80)
        + '-' + Math.random().toString(36).slice(2, 7);
}

// GET — list posts (published) or author's own posts
export async function GET(req: NextRequest) {
    await syncStoreFromKV();
    const category = req.nextUrl.searchParams.get('category') ?? undefined;
    const region = req.nextUrl.searchParams.get('region') ?? undefined;
    const authorId = req.nextUrl.searchParams.get('authorId') ?? undefined;
    const orgLevel = req.nextUrl.searchParams.get('orgLevel') ?? undefined;

    // Auth for authorId access (seeing non-published posts)
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    const isOwnerOrAdmin = user && (user.id === authorId || user.isAdmin);

    let enriched = getEnrichedPosts({
        category,
        region,
        authorId,
        includeUnpublished: Boolean(isOwnerOrAdmin),
    });

    if (orgLevel) {
        enriched = enriched.filter(p => p.orgLevel === orgLevel);
    }

    return NextResponse.json(enriched);
}

// POST — submit article (saved as 'pending', awaiting admin approval)
export async function POST(req: NextRequest) {
    try {
        await syncStoreFromKV();
        const token = req.cookies.get('auth-token')?.value;
        const user = token ? await verifyToken(token) : null;
        if (!user) return NextResponse.json({ error: 'Du må logge inn for å sende inn innlegg.' }, { status: 401 });

        let body: any;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: 'Ugyldig data sendt til serveren.' }, { status: 400 });
        }

        const { title, subtitle, content, category, image_url, regions, audience, angle, readingLevel, sources, imageCaption, photographer, organization, position, orgLevel, coAuthors, allowLicensing } = body;
        if (!title?.trim()) return NextResponse.json({ error: 'Tittel er påkrevd.' }, { status: 400 });
        if (!content?.trim()) return NextResponse.json({ error: 'Innhold er påkrevd.' }, { status: 400 });
        if (!category) return NextResponse.json({ error: 'Kategori er påkrevd.' }, { status: 400 });
        if (content.length < 50) return NextResponse.json({ error: 'Artikkelen er for kort (min. 50 tegn).' }, { status: 400 });

        let processedImageUrl = image_url;
        try {
            processedImageUrl = await processBase64Image(image_url, 'post');
        } catch (err) {
            console.warn('[POST /api/posts] Could not process cover image file on disk:', err);
        }

        let processedContent = content.trim();
        try {
            processedContent = await processContentImages(content.trim());
        } catch (err) {
            console.warn('[POST /api/posts] Could not process inline images on disk:', err);
        }

        const post = createPost({
            slug: generateSlug(title),
            title: title.trim(),
            subtitle: subtitle?.trim() || undefined,
            content: processedContent,
            category,
            image_url: processedImageUrl || undefined,
            regions: regions || undefined,
            audience: audience || undefined,
            angle: angle || undefined,
            readingLevel: readingLevel || undefined,
            sources: sources || undefined,
            imageCaption: imageCaption || undefined,
            photographer: photographer || undefined,
            organization: organization || undefined,
            position: position || undefined,
            orgLevel: orgLevel || undefined,
            coAuthors: Array.isArray(coAuthors) && coAuthors.length > 0 ? coAuthors : undefined,
            allowLicensing: Boolean(allowLicensing),
            status: 'pending',     // ← awaiting admin approval
            authorId: user.id,
            authorName: user.name,
        });

        return NextResponse.json({ slug: post.slug, id: post.id, status: 'pending' }, { status: 201 });
    } catch (err: any) {
        console.error('[POST /api/posts fatal error]:', err);
        return NextResponse.json(
            { error: err.message || 'En uventet feil oppstod under lagring av artikkelen.' },
            { status: 500 }
        );
    }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
    await syncStoreFromKV();
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user?.isAdmin) return NextResponse.json({ error: 'Ikke tilgang.' }, { status: 403 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    try {
        const deleted = deletePost(id);
        if (!deleted) return NextResponse.json({ error: 'Innlegg ikke funnet.' }, { status: 404 });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Feil ved sletting.' }, { status: 500 });
    }
}

// PATCH — admin can update anything; author can edit their own pending/published post
export async function PATCH(req: NextRequest) {
    await syncStoreFromKV();
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Ikke logget inn.' }, { status: 401 });

    const { id, title, content, category, subtitle, image_url, regions, status, organization, position, orgLevel, coAuthors, allowLicensing } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    try {
        const post = getPostById(id);
        if (!post) return NextResponse.json({ error: 'Innlegg ikke funnet.' }, { status: 404 });

        // Authors can only edit their own posts, and can't change status
        if (!user.isAdmin && post.authorId !== user.id) {
            return NextResponse.json({ error: 'Ikke tilgang.' }, { status: 403 });
        }

        const updates: Record<string, any> = {};
        if (title !== undefined) updates.title = title.trim();
        if (content !== undefined) updates.content = await processContentImages(content.trim());
        if (category !== undefined) updates.category = category;
        if (subtitle !== undefined) updates.subtitle = subtitle.trim();
        
        if (image_url !== undefined) {
            updates.image_url = await processBase64Image(image_url, 'post');
        }
        
        if (regions !== undefined) updates.regions = regions;
        if (organization !== undefined) updates.organization = organization;
        if (position !== undefined) updates.position = position;
        if (orgLevel !== undefined) updates.orgLevel = orgLevel;
        if (coAuthors !== undefined) updates.coAuthors = coAuthors;
        if (allowLicensing !== undefined) updates.allowLicensing = allowLicensing;
        // Only admin can change status (approve/reject)
        if (status !== undefined && user.isAdmin) updates.status = status;

        const updated = updatePost(id, updates);
        if (!updated) return NextResponse.json({ error: 'Kunne ikke oppdatere.' }, { status: 500 });
        
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: 'Feil ved oppdatering.' }, { status: 500 });
    }
}
