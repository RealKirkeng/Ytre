/**
 * SERVER-ONLY local auth module.
 * Stores users in data/users.json (no external database required).
 * Passwords are hashed with bcryptjs. Sessions use HS256 JWT in httpOnly cookies.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getDataDir } from './data-dir.server';

function getUsersFile() {
    return path.join(getDataDir(), 'users.json');
}

// JWT secret — override via JWT_SECRET env var in production
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? 'paragraf100-dev-secret-change-in-production'
);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LocalUser {
    id: string;
    email: string;
    name: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    avatarUrl?: string;
    theme?: string; // e.g., 'original', 'dark', 'blue', 'purple', 'rose'
    font?: 'default' | 'serif' | 'opensans' | 'hyperlegible' | 'comic';
    passwordHash: string;
    createdAt: string;
    isAdmin: boolean;
}

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    theme?: string;
    font?: 'default' | 'serif' | 'opensans' | 'hyperlegible' | 'comic';
    isAdmin: boolean;
}

// ── File helpers ──────────────────────────────────────────────────────────────
function ensureDataDir() {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let usersMtime = 0;
let usersCache: LocalUser[] | null = null;

function readUsers(): LocalUser[] {
    ensureDataDir();
    const file = getUsersFile();
    try {
        if (!fs.existsSync(file)) return usersCache || [];
        const currentMtime = fs.statSync(file).mtimeMs;
        if (usersCache !== null && currentMtime === usersMtime) return usersCache;
        usersCache = JSON.parse(fs.readFileSync(file, 'utf-8'));
        usersMtime = currentMtime;
        return usersCache || [];
    } catch {
        return usersCache || [];
    }
}

function writeUsers(users: LocalUser[]): void {
    ensureDataDir();
    const file = getUsersFile();
    usersCache = users;
    try {
        fs.writeFileSync(file, JSON.stringify(users, null, 2), 'utf-8');
        usersMtime = fs.statSync(file).mtimeMs;
    } catch (err) {
        console.warn(`[local-auth] Warning: Could not write users to ${file}:`, err);
    }
}

// ── Seed test account ─────────────────────────────────────────────────────────
export async function seedTestUser(): Promise<void> {
    const users = readUsers();
    if (users.some(u => u.email === 'test@test.no')) return;
    const passwordHash = await bcrypt.hash('test', 10);
    users.push({
        id: crypto.randomUUID(),
        email: 'test@test.no',
        name: 'Test Bruker',
        firstName: 'Test',
        lastName: 'Bruker',
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Test%20Bruker&backgroundColor=5B89A8`,
        passwordHash,
        createdAt: new Date().toISOString(),
        isAdmin: true,
    });
    writeUsers(users);
    console.log('[auth] Seeded test@test.no (admin)');
}

// ── User operations ───────────────────────────────────────────────────────────
export async function createUser(
    firstName: string, middleName: string | undefined, lastName: string, email: string, password: string
): Promise<LocalUser> {
    await seedTestUser();
    const users = readUsers();
    const normalized = email.trim().toLowerCase();
    if (users.some(u => u.email === normalized)) {
        throw new Error('E-postadressen er allerede i bruk.');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    const user: LocalUser = {
        id: crypto.randomUUID(),
        email: normalized,
        name: fullName,
        firstName: firstName.trim(),
        middleName: middleName?.trim() || undefined,
        lastName: lastName.trim(),
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=5B89A8`,
        passwordHash,
        createdAt: new Date().toISOString(),
        isAdmin: false,
    };
    users.push(user);
    writeUsers(users);
    return user;
}

export async function updateUser(userId: string, data: Partial<LocalUser>): Promise<LocalUser> {
    const users = readUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('Fant ikke bruker.');

    // Don't allow updating sensitive fields via this helper
    const { passwordHash: _, email: __, id: ___, ...updateData } = data;

    users[idx] = { ...users[idx], ...updateData };
    writeUsers(users);
    return users[idx];
}

export async function authenticateUser(
    email: string, password: string
): Promise<LocalUser | null> {
    await seedTestUser(); // ensure test account always exists
    const users = readUsers();
    const user = users.find(u => u.email === email.trim().toLowerCase());
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
}

export function getAllUsers(): Omit<LocalUser, 'passwordHash'>[] {
    return readUsers().map(({ passwordHash: _, ...u }) => u);
}

export function getUserById(id: string): LocalUser | null {
    return readUsers().find(u => u.id === id) || null;
}

// ── JWT helpers ───────────────────────────────────────────────────────────────
export async function signToken(user: LocalUser): Promise<string> {
    return new SignJWT({
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        theme: user.theme,
        font: user.font,
        isAdmin: user.isAdmin
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as SessionUser;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return verifyToken(token);
}
