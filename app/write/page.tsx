'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ArrowLeft, Eye, PenLine } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
    { id: 'school', label: 'Skole' },
    { id: 'politics', label: 'Politikk' },
    { id: 'mental_health', label: 'Psykisk helse' },
    { id: 'society', label: 'Samfunn' },
];

export default function WritePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [preview, setPreview] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [charCount, setCharCount] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const supabase = createClient();

    // Auth guard
    useEffect(() => {
        supabase.auth.getUser().then(({ data }: any) => {
            if (!data.user) router.push('/auth/login?from=/write');
        });
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
        setCharCount(content.length);
    }, [content]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !category) {
            setError('Fyll inn tittel, kategori og innhold.');
            return;
        }
        if (content.length < 50) {
            setError('Artikkelen er for kort (minimum 50 tegn).');
            return;
        }
        setError('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, category }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Ukjent feil');
            router.push(`/posts/${json.slug}`);
        } catch (e: any) {
            setError(e.message);
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen px-4 sm:px-6">
            {/* Toolbar */}
            <div className="max-w-[75ch] mx-auto py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Avbryt
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPreview(!preview)}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
                    >
                        {preview ? <PenLine className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {preview ? 'Rediger' : 'Forhåndsvis'}
                    </button>
                    <motion.button
                        onClick={handleSubmit}
                        disabled={submitting || !title || !content || !category}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 glass-button px-5 py-2 text-sm rounded-xl disabled:opacity-40"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Publiser
                    </motion.button>
                </div>
            </div>

            {/* Editor */}
            <div className="max-w-[75ch] mx-auto pb-24">
                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="reading-body"
                        >
                            <h1 className="font-display text-4xl font-bold text-white mb-8">{title || 'Tittel…'}</h1>
                            {content.split('\n\n').map((p, i) => (
                                <p key={i} className="text-white/80 leading-[1.9] mb-6">{p}</p>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Category selector */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {CATEGORIES.map((cat) => (
                                    <motion.button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat.id
                                            ? `badge-${cat.id} scale-105`
                                            : 'glass text-white/40 hover:text-white/70'
                                            }`}
                                    >
                                        {cat.label}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Title */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Skriv en tittel som fengsler…"
                                maxLength={120}
                                className="w-full bg-transparent text-4xl sm:text-5xl font-display font-bold text-white placeholder-white/20 border-none outline-none mb-8 leading-tight"
                            />

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                            {/* Content */}
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Fortell din historie. Bruk tomme linjer for å separere avsnitt. Skriv ## for overskrift.

Din stemme er viktig her."
                                className="w-full bg-transparent text-[1.1rem] text-white/80 placeholder-white/20 border-none outline-none resize-none leading-[1.9] min-h-[400px]"
                            />

                            {/* Footer: char count & error */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/6">
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-debate-red text-sm"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                                <span className={`ml-auto text-xs ${charCount < 50 ? 'text-white/25' : 'text-white/40'}`}>
                                    {charCount} tegn{charCount < 50 && ' (min 50)'}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
