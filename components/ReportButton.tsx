'use client';

import { useState } from 'react';
import { ReportModal } from './ReportModal';

interface ReportButtonProps {
    postId: string;
    postTitle: string;
    postSlug: string;
    postAuthorName?: string;
    className?: string;
}

export function ReportButton({
    postId,
    postTitle,
    postSlug,
    postAuthorName,
    className = '',
}: ReportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`group inline-flex items-center gap-1.5 text-xs text-ink-300 hover:text-red-600 transition-colors py-1 cursor-pointer select-none ${className}`}
                title="Varsle om ulovlig eller krenkende innhold (e-handelsloven § 18)"
            >
                <span className="text-sm leading-none transition-transform group-hover:scale-110">🚩</span>
                <span className="group-hover:underline">Varsle om ulovlig innhold</span>
            </button>

            <ReportModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                post={{
                    id: postId,
                    title: postTitle,
                    slug: postSlug,
                    authorName: postAuthorName,
                }}
            />
        </>
    );
}
