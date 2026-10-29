'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenLine, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SendVideoPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Tittel er påkrevd.');
            return;
        }

        if (!file && !videoUrl.trim()) {
            setError('Du må enten laste opp en videofil eller legge inn en videolenke.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (file) formData.append('file', file);
            if (videoUrl) formData.append('videoUrl', videoUrl);

            const res = await fetch('/api/videos', {
                method: 'POST',
                // No Content-Type header so browser sets it with the boundary automatically
                body: formData,
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/videoer'), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Noe gikk galt. Er du logget inn?');
            }
        } catch (err: any) {
            setError('Systemfeil: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-sand text-ink relative">
            <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-12 pt-24">
                <Link href="/videoer" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Tilbake til videostrøm
                </Link>

                <h1 className="font-display text-4xl font-black text-ink mb-2">Send inn Video</h1>
                <p className="text-ink-400 mb-8 font-medium">Del din mening, tale eller et innslag via Youtube, Vimeo eller direkte lenke.</p>

                <AnimatePresence>
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-3xl text-center"
                        >
                            <span className="text-4xl block mb-3">✅</span>
                            <h2 className="text-xl font-bold mb-2">Videoen er sendt inn!</h2>
                            <p className="text-sm opacity-90">Den ligger nå til vurdering hos redaksjonen.<br />Du sendes tilbake strax...</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-dark/40 shadow-sm"
                        >
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100 flex items-center gap-2">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-fjord-dark mb-1.5">Tittel på innslaget *</label>
                                    <input
                                        type="text"
                                        value={title} onChange={e => setTitle(e.target.value)}
                                        className="input-nordic w-full text-base font-semibold"
                                        placeholder="F.eks: Min mening om de nye drosjereglene"
                                        maxLength={80}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-fjord-dark mb-1.5">Last opp videofil (MP4, MOV)</label>
                                    <div className="relative group rounded-2xl border-2 border-dashed border-sand-dark/40 bg-sand/30 hover:bg-sand/70 hover:border-fjord/30 transition-all text-center p-6 cursor-pointer overflow-hidden">
                                        <input
                                            type="file"
                                            accept="video/mp4,video/quicktime,video/webm"
                                            onChange={e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFile(e.target.files[0]);
                                                    setVideoUrl(''); // clear URL if setting file
                                                }
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                                            {file ? (
                                                <>
                                                    <span className="text-3xl">🎬</span>
                                                    <p className="text-sm font-bold text-fjord">{file.name}</p>
                                                    <p className="text-xs text-ink-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-3xl opacity-50">📁</span>
                                                    <p className="text-sm font-bold text-ink">Klikk for å velge fil, eller dra filen hit</p>
                                                    <p className="text-xs text-ink-400">Max 50MB. (Eller bruk lenkefeltet under)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center font-bold text-xs text-ink-300 uppercase tracking-widest">— eller —</div>

                                <div>
                                    <label className="block text-sm font-semibold text-fjord-dark mb-1.5">Videolenke (Youtube / Vimeo / TikTok / Insta Reels)</label>
                                    <input
                                        type="url"
                                        value={videoUrl} onChange={e => {
                                            setVideoUrl(e.target.value);
                                            setFile(null); // clear file if typing URL
                                        }}
                                        className="input-nordic w-full text-sm font-mono"
                                        placeholder="https://www.tiktok.com/..."
                                        disabled={!!file}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-fjord-dark mb-1.5">Kort beskrivelse (valgfri)</label>
                                    <textarea
                                        value={description} onChange={e => setDescription(e.target.value)}
                                        className="input-nordic w-full text-sm resize-none"
                                        placeholder="Legg til litt kontekst om videoen The..."
                                        rows={4}
                                        maxLength={300}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-4 rounded-2xl text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2 shadow-md disabled:opacity-70 disabled:hover:scale-100"
                                    style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenLine className="w-5 h-5" />}
                                    Send til redaksjonen
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
