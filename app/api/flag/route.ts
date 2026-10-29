import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { target_type, target_id, reason } = await req.json();
    if (!target_type || !target_id) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check if already reported by this user
    const { data: existing } = await supabase
        .from('reports')
        .select('id')
        .eq('reporter_id', user.id)
        .eq('target_id', target_id)
        .single();

    if (existing) {
        return NextResponse.json({ error: 'Already reported' }, { status: 409 });
    }

    // Insert report
    const { error: reportError } = await supabase.from('reports').insert({
        reporter_id: user.id,
        target_type,
        target_id,
        reason: reason || 'user_flag',
    });

    if (reportError) {
        return NextResponse.json({ error: reportError.message }, { status: 500 });
    }

    // Increment flag_count on the target
    const table = target_type === 'post' ? 'posts' : 'comments';
    const { data: target } = await supabase
        .from(table)
        .select('flag_count')
        .eq('id', target_id)
        .single();

    if (target) {
        const newCount = (target.flag_count || 0) + 1;
        const updatePayload: Record<string, any> = { flag_count: newCount };

        // Threshold: auto-set to under_review at 5 flags
        if (target_type === 'post' && newCount >= 5) {
            updatePayload.status = 'under_review';
        }

        await supabase.from(table).update(updatePayload).eq('id', target_id);
    }

    return NextResponse.json({ success: true });
}
