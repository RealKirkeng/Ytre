'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
    return (
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-500 text-white text-sm font-medium shadow-lg">
            ❌ {message}
            <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-1">✕</button>
        </motion.div>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        const res = await fetch('/api/auth/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const json = await res.json();
        setLoading(false);
        if (!res.ok) { setError(json.error || 'Noe gikk galt'); return; }
        // Full reload so httpOnly cookie is read fresh by useAuth
        window.location.href = '/';
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', boxShadow: '0 8px 24px rgba(91,137,168,0.25)' }}>§</div>
                    <h1 className="font-display text-3xl font-bold text-ink mb-1">Logg inn</h1>
                    <p className="text-ink-400 text-sm">Velkommen tilbake til Paragraf100</p>
                </div>

                {/* Test account hint */}
                <div className="bg-fjord/5 border border-fjord/20 rounded-2xl p-3 mb-5 text-xs text-fjord-dark text-center">
                    🔑 Testkonto: <strong>test@test.no</strong> / passord: <strong>test</strong>
                </div>

                <div className="bg-white rounded-3xl border border-sand-dark/40 p-8"
                    style={{ boxShadow: '0 4px 24px rgba(26,22,18,0.07)' }}>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-ink-400 mb-1.5">E-post</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                placeholder="din@epost.no" className="input-nordic w-full text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-ink-400 mb-1.5">Passord</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                placeholder="••••••••" className="input-nordic w-full text-sm" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold text-sm mt-2 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', boxShadow: '0 4px 16px rgba(91,137,168,0.3)' }}>
                            {loading ? '⏳ Logger inn…' : '→ Logg inn'}
                        </button>
                    </form>
                    <div className="mt-5 pt-5 border-t border-sand-dark/40 text-center">
                        <p className="text-sm text-ink-300">
                            Ny bruker?{' '}
                            <Link href="/auth/signup" className="text-fjord font-medium hover:text-fjord-dark transition-colors">Opprett konto</Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {error && <Toast message={error} onClose={() => setError('')} />}
            </AnimatePresence>
        </div>
    );
}
