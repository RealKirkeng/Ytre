'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Menu, X, LogOut, User, Settings, ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
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

let cachedSettings: { isVideoFeatureEnabled: boolean } | null = null;

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();

    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [settings, setSettings] = useState<{ isVideoFeatureEnabled: boolean } | null>(cachedSettings);

    useEffect(() => {
        if (cachedSettings) return;
        fetch('/api/settings')
            .then(r => r.json())
            .then(data => {
                cachedSettings = data;
                setSettings(data);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        if (!menuOpen && !profileOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (menuOpen && !target.closest('.menu-dropdown-container')) setMenuOpen(false);
            if (profileOpen && !target.closest('.profile-dropdown-container')) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen, profileOpen]);

    // Close menus when route changes
    useEffect(() => {
        setMenuOpen(false);
        setProfileOpen(false);
    }, [pathname]);

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
        { label: 'Bli en verifiserer', href: '/bli-verifiserer', icon: '🛡️' },
        { label: 'Medielisensiering', href: '/medielisensiering', icon: '📰' },
        { label: 'Juridisk info', href: '/juridisk', icon: '⚖️' },
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
                        onClick={() => router.push('/')}
                    >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                            style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}>Y</div>
                        <span className="font-display font-bold text-ink text-sm tracking-tight whitespace-nowrap">
                            Y<span className="text-fjord">tre</span>
                        </span>
                    </motion.div>

                    {/* ── Search Bar ── */}
                    <div className="flex-1 min-w-0 max-w-sm ml-1.5 sm:ml-2.5">
                        <AnimatePresence>
                            {searchOpen ? (
                                <motion.form
                                    initial={{ width: 40, opacity: 0 }}
                                    animate={{ width: '100%', opacity: 1 }}
                                    exit={{ width: 40, opacity: 0 }}
                                    onSubmit={handleSearch}
                                    style={surface}
                                    className="pointer-events-auto rounded-full flex items-center px-2.5 sm:px-3 py-1.5 gap-1.5 sm:gap-2 relative w-full min-w-0"
                                >
                                    <SearchIcon className="w-4 h-4 text-fjord shrink-0" />
                                    <input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Søk i artikler..."
                                        className="bg-transparent text-sm text-ink outline-none w-full min-w-0 pr-12 placeholder:text-ink-300"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-8 sm:right-10 p-1 hover:bg-sand/50 rounded-full transition-colors"
                                            title="Tøm søk"
                                        >
                                            <X className="w-3.5 h-3.5 text-fjord" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                        className="p-1 hover:bg-sand/50 rounded-full transition-colors shrink-0"
                                    >
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
                                    aria-label="Åpne søk"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1" />

                    {/* ── Profile Bubble ── */}
                    <div className="relative profile-dropdown-container shrink-0">
                        <motion.button
                            type="button"
                            onClick={() => setProfileOpen(prev => !prev)}
                            style={surface}
                            className="w-[42px] h-[42px] rounded-full flex items-center justify-center pointer-events-auto border border-sand-dark/30 shadow-sm cursor-pointer focus:outline-none"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Profilmeny"
                        >
                            <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center shadow-sm">
                                {loading ? (
                                    <div className="w-full h-full bg-sand-dark/30 animate-pulse" />
                                ) : user ? (
                                    user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center text-white text-[11px] font-bold"
                                            style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}
                                        >
                                            {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : 'U'}
                                        </div>
                                    )
                                ) : (
                                    <div className="w-full h-full bg-sand/60 flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-ink-400" />
                                    </div>
                                )}
                            </div>
                        </motion.button>

                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full mt-2 right-0 w-64 rounded-3xl p-2 pointer-events-auto z-[60] border border-sand-dark/30 shadow-2xl"
                                    style={{ ...glass, background: 'rgba(255,255,255,0.96)' }}
                                >
                                    {/* User info header */}
                                    <div className="px-3.5 py-2.5 mb-1.5 flex items-center gap-3 rounded-2xl bg-sand/30 border border-sand-dark/20">
                                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                                            {user ? (
                                                user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                                                        style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))' }}
                                                    >
                                                        {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : 'U'}
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-full h-full bg-sand/70 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-ink-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-ink truncate leading-tight">
                                                {user ? (user.name || 'Bruker') : 'Velkommen'}
                                            </p>
                                            <p className="text-[11px] text-ink-300 truncate">
                                                {user ? user.email : 'Logg inn for å delta'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action items */}
                                    <div className="space-y-1">
                                        {/* "Skriv" action button */}
                                        <Link
                                            href="/skriv"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-white font-semibold text-sm shadow-sm transition-all group overflow-hidden mb-1"
                                            style={{
                                                background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))',
                                                boxShadow: '0 2px 8px rgba(91, 137, 168, 0.25)'
                                            }}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <PenLine className="w-4 h-4 text-white shrink-0" />
                                                <span>Skriv</span>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                                        </Link>

                                        {user ? (
                                            <>
                                                <Link
                                                    href="/profil"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-ink-400 hover:text-fjord hover:bg-fjord/5 transition-all group"
                                                >
                                                    <User className="w-4 h-4 text-fjord shrink-0" />
                                                    <span>Profil</span>
                                                </Link>

                                                <Link
                                                    href="/profil?tab=settings"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-ink-400 hover:text-fjord hover:bg-fjord/5 transition-all group"
                                                >
                                                    <Settings className="w-4 h-4 text-fjord shrink-0" />
                                                    <span>Innstillinger</span>
                                                </Link>

                                                {user.isAdmin && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setProfileOpen(false)}
                                                        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50/80 transition-all group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                                                            <span>Admin</span>
                                                        </div>
                                                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                            Admin
                                                        </span>
                                                    </Link>
                                                )}

                                                <div className="border-t border-sand-dark/20 my-1 mx-1" />

                                                <button
                                                    type="button"
                                                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50/80 transition-all group cursor-pointer"
                                                >
                                                    <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                                                    <span>Logg ut</span>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-1 pt-0.5">
                                                <Link
                                                    href="/auth/login"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-ink-400 hover:text-fjord hover:bg-fjord/5 transition-all"
                                                >
                                                    <LogIn className="w-4 h-4 text-fjord shrink-0" />
                                                    <span>Logg inn</span>
                                                </Link>
                                                <Link
                                                    href="/auth/signup"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center justify-center px-4 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-sm transition-all"
                                                    style={{ background: 'var(--gradient-main, linear-gradient(135deg,#5B89A8,#A87B8E))', boxShadow: '0 2px 8px rgba(91,137,168,0.25)' }}
                                                >
                                                    Opprett konto
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            {pathname !== '/' && <div className="h-[68px]" />}
        </>
    );
}
