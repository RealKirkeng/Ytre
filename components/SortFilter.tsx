'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, Eye, MessageCircle, ChevronDown, ArrowDownWideNarrow } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SortFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'latest';

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const options = [
        { id: 'latest', label: 'Nyligst', icon: Clock },
        { id: 'views', label: 'Mest lest', icon: Eye },
        { id: 'comments', label: 'Mest diskutert', icon: MessageCircle },
    ];

    const handleSort = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id === 'latest') {
            params.delete('sort');
        } else {
            params.set('sort', id);
        }
        router.push(`/?${params.toString()}`);
        setOpen(false);
    };

    const activeOption = options.find(o => o.id === currentSort) || options[0];

    return (
        <div ref={ref} className="relative ml-auto sm:ml-2">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${open || currentSort !== 'latest'
                    ? 'border-fjord/50 bg-fjord/8 text-fjord-dark'
                    : 'border-sand-dark/50 bg-white text-ink-400 hover:text-ink hover:border-fjord/30'
                    }`}
            >
                <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                <span>{activeOption.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.12 }}
                        className="absolute top-full right-0 mt-2 z-50 min-w-[180px] p-2 flex flex-col gap-0.5 rounded-2xl border border-sand-dark/30 shadow-2xl overflow-hidden"
                        style={{ background: 'rgba(255,253,250,0.98)', backdropFilter: 'blur(20px)' }}
                    >
                        {options.map((opt) => {
                            const active = currentSort === opt.id;
                            const Icon = opt.icon;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSort(opt.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all ${active
                                        ? 'bg-fjord/10 text-fjord-dark font-semibold'
                                        : 'text-ink-500 hover:bg-sand'
                                        }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-fjord' : 'text-ink-300'}`} />
                                    {opt.label}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
