'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function Toast({ message, isError, onClose }: { message: string; isError: boolean; onClose: () => void }) {
    return (
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-lg ${isError ? 'bg-red-500' : 'bg-green-600'}`}>
            {isError ? '❌' : '✅'} {message}
            <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-1">✕</button>
        </motion.div>
    );
}

export default function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; err: boolean } | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (firstName.trim().length < 2) { setToast({ msg: 'Fornavn må ha minst 2 tegn.', err: true }); return; }
        if (lastName.trim().length < 2) { setToast({ msg: 'Etternavn må ha minst 2 tegn.', err: true }); return; }
        if (password.length < 4) { setToast({ msg: 'Passordet må ha minst 4 tegn.', err: true }); return; }

        setLoading(true);
        const res = await fetch('/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName.trim(),
                middleName: middleName.trim() || undefined,
                lastName: lastName.trim(),
                email,
                password
            }),
        });
        const json = await res.json();
        setLoading(false);

        if (!res.ok) { setToast({ msg: json.error || 'Noe gikk galt', err: true }); return; }

        setToast({ msg: `Velkommen, ${json.name}! 🎉`, err: false });
        // Full reload after 1.2s so useAuth picks up the new httpOnly cookie
        setTimeout(() => { window.location.href = '/'; }, 1200);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 pt-24 sm:pt-28 pb-16">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-display font-bold mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', boxShadow: '0 8px 24px rgba(91,137,168,0.25)' }}>Y</div>
                    <h1 className="font-display text-3xl font-bold text-ink mb-1.5">Bli en stemme</h1>
                    <p className="text-ink-400 text-sm">Opprett en konto på Ytre — alltid gratis</p>
                </div>

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-sand-dark/40 p-6 sm:p-8"
                    style={{ boxShadow: '0 4px 24px rgba(26,22,18,0.07)' }}>
                    <p className="text-center text-xs text-ink-300 mb-6 px-4">
                        Vennligst oppgi ditt virkelige navn. Vi krever at alle stemmer på Ytre publiserer under fullt navn for å fremme seriøs debatt.
                    </p>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-ink-400 mb-1.5">Fornavn</label>
                                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                                    placeholder="Ola" className="input-nordic w-full text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-ink-400 mb-1.5">Etternavn</label>
                                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                                    placeholder="Nordmann" className="input-nordic w-full text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-ink-400 mb-1.5">Mellomnavn (valgfritt)</label>
                            <input type="text" value={middleName} onChange={e => setMiddleName(e.target.value)}
                                placeholder="Ett eller flere navn" className="input-nordic w-full text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-ink-400 mb-1.5">E-post</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                placeholder="ola@eksempel.no" className="input-nordic w-full text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-ink-400 mb-1.5">Passord</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                placeholder="••••••••" className="input-nordic w-full text-sm" minLength={4} />
                            <p className="text-xs text-ink-300 mt-1">Minst 4 tegn.</p>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-95 mt-2 disabled:opacity-60"
                            style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', boxShadow: '0 4px 16px rgba(91,137,168,0.3)' }}>
                            {loading ? '⏳ Oppretter konto…' : '→ Opprett konto'}
                        </button>
                    </form>
                    <div className="mt-5 pt-5 border-t border-sand-dark/40 text-center">
                        <p className="text-sm text-ink-300">
                            Har du allerede konto?{' '}
                            <Link href="/auth/login" className="text-fjord font-medium hover:text-fjord-dark transition-colors">Logg inn</Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {toast && <Toast message={toast.msg} isError={toast.err} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
