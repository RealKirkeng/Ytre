'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MessageSquare, User } from 'lucide-react';

type ToastType = 'success' | 'error';

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-card-lg text-sm font-medium ${type === 'success' ? 'bg-moss text-white' : 'bg-red-500 text-white'
                }`}
        >
            <span>{type === 'success' ? '✅' : '❌'} {message}</span>
            <button onClick={onClose}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
        </motion.div>
    );
}

export default function KontaktPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (msg: string, type: ToastType) => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { showToast('Legg til ditt navn', 'error'); return; }
        if (!email.includes('@')) { showToast('Ugyldig e-postadresse', 'error'); return; }
        if (message.length < 10) { showToast('Meldingen er for kort', 'error'); return; }

        setLoading(true);
        // Simulate API call (replace with real endpoint)
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setName(''); setEmail(''); setMessage('');
        showToast('Meldingen er sendt! Vi svarer innen 24 timer. 📬', 'success');
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 py-16 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-5"
                    style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', boxShadow: '0 8px 24px rgba(91,137,168,0.25)' }}
                >
                    <MessageSquare className="w-6 h-6" />
                </div>
                <h1 className="font-display text-4xl font-bold text-ink mb-2">Kontakt oss</h1>
                <p className="text-ink-400 text-base leading-relaxed">
                    Spørsmål, samarbeid eller tekniske problemer? Vi svarer på e-post innen 24 timer.
                </p>
            </div>

            {/* Contact card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-sand-dark/40 p-8 shadow-card"
                style={{ boxShadow: '0 4px 24px rgba(26,22,18,0.07)' }}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-ink-400 mb-1.5">
                            <User className="w-3.5 h-3.5" />Ditt navn
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ola Nordmann"
                            required
                            className="input-nordic w-full text-sm"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-ink-400 mb-1.5">
                            E-postadresse
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ola@eksempel.no"
                            required
                            className="input-nordic w-full text-sm"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-ink-400 mb-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />Melding
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Hva vil du si til oss?"
                            required
                            rows={5}
                            className="input-nordic w-full text-sm resize-none"
                        />
                        <p className="text-xs text-ink-300 mt-1 text-right">{message.length} / 1000</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)', boxShadow: '0 4px 16px rgba(91,137,168,0.3)' }}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Sender…' : 'Send melding'}
                    </button>
                </form>
            </motion.div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                {[
                    { icon: '📬', label: 'E-post', value: 'kontakt@paragraf100.no' },
                    { icon: '⏱️', label: 'Responstid', value: 'Innen 24 timer' },
                ].map((item) => (
                    <div key={item.label} className="bg-white rounded-2xl border border-sand-dark/40 p-4 text-center shadow-card">
                        <div className="text-2xl mb-1.5">{item.icon}</div>
                        <p className="text-xs text-ink-300 mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-ink">{item.value}</p>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
        </div>
    );
}
