'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const glass: React.CSSProperties = {
    background: 'rgba(255,255,255,0.70)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.80)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
};

const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [settings, setSettings] = useState<{ isVideoFeatureEnabled: boolean } | null>(null);

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
    }, []);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.menu-dropdown-container')) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    // Real-time search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
            } else if (searchOpen) {
                // If search is open but empty, show all posts
                router.push('/');
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, router, searchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Just focus/blur handling if needed, the useEffect handles the push
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.push('/');
    };

    const handleLogout = async () => { await logout(); window.location.href = '/'; };

    const surface: React.CSSProperties = scrolled
        ? { ...glass, background: 'rgba(248,245,240,0.88)', boxShadow: '0 8px 32px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.95)' }
        : glass;

    const MENU_LINKS = [
        { label: 'Hvem er vi?', href: '/om-oss', icon: '👋' },
        { label: 'Kontakt oss', href: '/kontakt', icon: '✉️' },
        { label: 'Retningslinjer', href: '/retningslinjer', icon: '📝' },
        { label: 'Medielisensiering', href: '/medielisensiering', icon: '🛡️' },
        ...(settings?.isVideoFeatureEnabled ? [{ label: 'Videoer (Beta)', href: '/videoer', icon: '🎬' }] : []),
    ];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none">
                <div className="flex items-center gap-2.5 px-3 sm:px-5 pt-3">

                    {/* ── Menu button & Dropdown ── */}
                    <div className="relative menu-dropdown-container shrink-0">
                        <motion.button
                            style={surface}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="pointer-events-auto rounded-full px-4 py-2.5 flex items-center gap-2 text-ink hover:text-fjord transition-colors font-semibold text-sm"
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        >
                            <Menu className="w-4 h-4" />
                            <span className="hidden xs:block">Meny</span>
                        </motion.button>

                        <AnimatePresence>
                            {menuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full mt-2 left-0 w-64 rounded-3xl p-2 pointer-events-auto z-[60] border border-sand-dark/30 shadow-2xl"
                                    style={{ ...glass, background: 'rgba(255,255,255,0.95)' }}
                                >
                                    {MENU_LINKS.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-ink-400 hover:text-fjord hover:bg-fjord/5 transition-all group"
                                        >
                                            <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
                                            {link.label}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Logo bubble ── */}
                    <motion.div style={surface}
                        className="pointer-events-auto rounded-full px-4 py-2.5 flex items-center gap-2 shrink-0 cursor-pointer"
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        onClick={() => { router.push('/'); setMobileOpen(false); }}
                    >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                            style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}>§</div>
                        <span className="font-display font-bold text-ink text-sm tracking-tight whitespace-nowrap">
                            Paragraf<span className="text-fjord">100</span>
                        </span>
                    </motion.div>

                    {/* ── Search Bar ── */}
                    <div className="flex-1 max-w-sm ml-2.5">
                        <AnimatePresence>
                            {searchOpen ? (
                                <motion.form
                                    initial={{ width: 40, opacity: 0 }}
                                    animate={{ width: '100%', opacity: 1 }}
                                    exit={{ width: 40, opacity: 0 }}
                                    onSubmit={handleSearch}
                                    style={surface}
                                    className="pointer-events-auto rounded-full flex items-center px-3 py-1.5 gap-2 relative"
                                >
                                    <SearchIcon className="w-4 h-4 text-fjord shrink-0" />
                                    <input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Søk i artikler..."
                                        className="bg-transparent text-sm text-ink outline-none w-full pr-8"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-10 p-1 hover:bg-sand/50 rounded-full transition-colors"
                                            title="Tøm søk"
                                        >
                                            <X className="w-3.5 h-3.5 text-fjord" />
                                        </button>
                                    )}
                                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                                        <X className="w-3.5 h-3.5 text-ink-300" />
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={surface}
                                    onClick={() => setSearchOpen(true)}
                                    className="pointer-events-auto rounded-full p-2.5 flex items-center justify-center text-ink-400 hover:text-fjord transition-colors"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1 hidden sm:block" />
                    <motion.div style={surface}
                        className="pointer-events-auto rounded-full flex items-center px-2 py-1.5 gap-1"
                        layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {settings?.isVideoFeatureEnabled && (
                            <Link href="/videoer"
                                className="hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors mr-1"
                            >🎬 Videoer <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1 rounded-full uppercase tracking-widest font-bold ml-0.5">Beta</span></Link>
                        )}

                        {loading ? (
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-sand-dark/20 animate-pulse" />
                                <div className="w-16 h-6 rounded-full bg-sand-dark/20 animate-pulse" />
                            </div>
                        ) : user ? (
                            <>
                                <Link href="/skriv"
                                    className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full text-white"
                                    style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))', boxShadow: '0 2px 8px rgba(91,137,168,0.25)' }}
                                ><PenLine className="w-3.5 h-3.5" />Skriv</Link>

                                <Link href="/profil" className="hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-sand/60 border border-sand-dark/40 hover:bg-white/80 transition-colors pr-3">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-fjord flex items-center justify-center text-[10px] text-white font-bold">
                                            {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : 'U'}
                                        </div>
                                    )}
                                    <span className="text-xs font-medium text-ink ml-1">{user.name ? user.name.split(' ')[0] : 'Bruker'}</span>
                                    {user.isAdmin && <span className="text-[10px] bg-amber/20 text-amber-900 px-1.5 py-0.5 rounded-full font-semibold ml-1">Admin</span>}
                                </Link>

                                {user.isAdmin && (
                                    <Link href="/admin"
                                        className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                                        ⚙ Admin
                                    </Link>
                                )}

                                <button onClick={handleLogout}
                                    className="p-2 rounded-full text-ink-400 hover:text-ink hover:bg-white/60 transition-colors"
                                    title="Logg ut"><LogOut className="w-4 h-4" /></button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login"
                                    className="hidden sm:block text-sm px-3.5 py-1.5 rounded-full text-ink-400 hover:text-ink hover:bg-white/60 font-medium transition-colors">Logg inn</Link>
                                <Link href="/auth/signup"
                                    className="text-sm px-4 py-1.5 rounded-full text-white font-semibold whitespace-nowrap"
                                    style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))', boxShadow: '0 2px 8px rgba(91,137,168,0.25)' }}>Registrer</Link>
                            </>
                        )}

                        <button onClick={() => setMobileOpen(!mobileOpen)}
                            className="sm:hidden p-2 rounded-full text-ink-400 hover:text-ink hover:bg-white/60 transition-colors">
                            <motion.div animate={{ rotate: mobileOpen ? 90 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
                                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </motion.div>
                        </button>
                    </motion.div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            className="pointer-events-auto mx-3 mt-2 rounded-3xl p-3 flex flex-col gap-1"
                            style={{ ...glass, background: 'rgba(255,255,255,0.92)' }}
                        >
                            {user && (
                                <div className="flex items-center gap-2 px-4 py-2 mb-1">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                            style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}>
                                            {user.name[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-ink leading-none">{user.name}</p>
                                        <p className="text-xs text-ink-300">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2 border-t border-sand-dark/30 mt-1">
                                {user ? (
                                    <>
                                        <Link href="/skriv" onClick={() => setMobileOpen(false)}
                                            className="flex-1 text-center py-2.5 rounded-2xl text-sm text-white font-semibold shadow-sm"
                                            style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}>✏️ Skriv</Link>
                                        <Link href="/profil" onClick={() => setMobileOpen(false)}
                                            className="px-4 py-2.5 rounded-2xl text-sm text-ink font-semibold bg-sand border border-sand-dark/40">👤 Profil</Link>
                                        {user.isAdmin && (
                                            <Link href="/admin" onClick={() => setMobileOpen(false)}
                                                className="px-4 py-2.5 rounded-2xl text-sm text-red-600 font-semibold bg-red-50 border border-red-200">⚙ Admin</Link>
                                        )}
                                        <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                                            className="px-4 py-2.5 rounded-2xl text-sm text-ink-400 hover:text-ink border border-sand-dark/40 transition-colors">Logg ut</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                                            className="flex-1 text-center py-2.5 rounded-2xl text-sm text-ink-400 hover:text-ink font-medium border border-sand-dark/40 transition-colors">Logg inn</Link>
                                        <Link href="/auth/signup" onClick={() => setMobileOpen(false)}
                                            className="flex-1 text-center py-2.5 rounded-2xl text-sm text-white font-semibold shadow-sm"
                                            style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}>Registrer</Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {pathname !== '/' && <div className="h-[68px]" />}
        </>
    );
}
