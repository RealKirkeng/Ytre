import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/local-auth.server';
import {
    getAllReports,
    createReport,
    updateReport,
    deleteReport,
    ReportStatus,
} from '@/lib/reports-store.server';
import { incrementPostFlagCount, updatePost } from '@/lib/local-store.server';

export const runtime = 'nodejs';

// ── GET: Admin only — Fetch all reports ─────────────────────────────────────────
export async function GET(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user?.isAdmin) {
        return NextResponse.json({ error: 'Kun administratorer har tilgang.' }, { status: 403 });
    }

    try {
        const reports = getAllReports();
        return NextResponse.json(reports);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Kunne ikke hente varsler' }, { status: 500 });
    }
}

// ── POST: Public / Auth — Submit a new illegal content report ──────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            postId,
            postTitle,
            postSlug,
            postAuthorName,
            category,
            categoryLabel,
            subCategory,
            details,
            reporterEmail,
        } = body;

        if (!postId || !postTitle || !postSlug) {
            return NextResponse.json(
                { error: 'Mangler informasjon om artikkelen som varsles.' },
                { status: 400 }
            );
        }

        if (!category || !subCategory) {
            return NextResponse.json(
                { error: 'Vennligst velg både hovedkategori og en spesifikk begrunnelse.' },
                { status: 400 }
            );
        }

        if (!details || details.trim().length < 8) {
            return NextResponse.json(
                { error: 'Vennligst forklar kort hva i innholdet som du mener er ulovlig eller i strid med retningslinjene (minst 8 tegn).' },
                { status: 400 }
            );
        }

        if (reporterEmail && !reporterEmail.includes('@')) {
            return NextResponse.json(
                { error: 'Vennligst oppgi en gyldig e-postadresse dersom du ønsker tilbakemelding.' },
                { status: 400 }
            );
        }

        // Check if reporter is logged in
        const token = req.cookies.get('auth-token')?.value;
        const currentUser = token ? await verifyToken(token) : null;

        const newReport = createReport({
            postId: String(postId),
            postTitle: String(postTitle),
            postSlug: String(postSlug),
            postAuthorName: postAuthorName ? String(postAuthorName) : undefined,
            category: String(category),
            categoryLabel: String(categoryLabel || category),
            subCategory: String(subCategory),
            details: details.trim(),
            reporterEmail: reporterEmail ? reporterEmail.trim() : currentUser?.email,
            reporterName: currentUser?.name,
            reporterUserId: currentUser?.id,
        });

        // Increment flag count on the post
        try {
            incrementPostFlagCount(String(postId));
        } catch (err) {
            console.error('Failed to increment post flag count:', err);
        }

        return NextResponse.json({
            success: true,
            reportId: newReport.id,
            message: 'Takk for ditt varsel. Saken er registrert i Ytres moderasjonssystem og vil bli behandlet fortløpende.',
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Kunne ikke registrere varselet.' },
            { status: 500 }
        );
    }
}

// ── PATCH: Admin only — Update report status or take down post ─────────────────
export async function PATCH(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user?.isAdmin) {
        return NextResponse.json({ error: 'Kun administratorer har tilgang.' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { id, status, adminNote, takeDownPost, postId } = body;

        if (!id) {
            return NextResponse.json({ error: 'Mangler saks-ID (id).' }, { status: 400 });
        }

        const validStatuses: ReportStatus[] = ['pending', 'investigating', 'action_taken', 'dismissed'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Ugyldig status.' }, { status: 400 });
        }

        // If takedown action requested, set the post to 'rejected'
        if (takeDownPost && postId) {
            updatePost(String(postId), { status: 'rejected' });
        }

        const updated = updateReport(id, {
            status: status || undefined,
            adminNote: typeof adminNote === 'string' ? adminNote.trim() : undefined,
            resolvedAt: ['action_taken', 'dismissed'].includes(status) ? new Date().toISOString() : undefined,
            resolvedBy: ['action_taken', 'dismissed'].includes(status) ? user.name : undefined,
        });

        if (!updated) {
            return NextResponse.json({ error: 'Fant ikke saken.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, report: updated });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Kunne ikke oppdatere saken.' }, { status: 500 });
    }
}

// ── DELETE: Admin only — Delete or archive report ──────────────────────────────
export async function DELETE(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    const user = token ? await verifyToken(token) : null;
    if (!user?.isAdmin) {
        return NextResponse.json({ error: 'Kun administratorer har tilgang.' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Mangler saks-ID (id).' }, { status: 400 });
        }

        const ok = deleteReport(id);
        if (!ok) {
            return NextResponse.json({ error: 'Fant ikke saken eller kunne ikke slette.' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Kunne ikke slette saken.' }, { status: 500 });
    }
}
