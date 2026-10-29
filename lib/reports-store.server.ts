/**
 * SERVER-ONLY store for incoming content reports / complaints.
 * Persisted in data/reports.json.
 */

import fs from 'fs';
import path from 'path';
import { getDataDir } from './data-dir.server';

function getReportsFile() {
    return path.join(getDataDir(), 'reports.json');
}

export type ReportStatus = 'pending' | 'investigating' | 'action_taken' | 'dismissed';

export interface ContentReport {
    id: string;
    postId: string;
    postTitle: string;
    postSlug: string;
    postAuthorName?: string;
    category: string;
    categoryLabel: string;
    subCategory: string;
    details: string;
    reporterEmail?: string;
    reporterName?: string;
    reporterUserId?: string;
    status: ReportStatus;
    adminNote?: string;
    createdAt: string;
    updatedAt?: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

let reportsMtime = 0;
let reportsCache: ContentReport[] | null = null;

function ensureDir() {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getFileMtime(filePath: string): number {
    try {
        if (!fs.existsSync(filePath)) return 0;
        return fs.statSync(filePath).mtimeMs;
    } catch {
        return 0;
    }
}

function readReports(): ContentReport[] {
    ensureDir();
    const file = getReportsFile();
    if (!fs.existsSync(file)) return [];
    try {
        const raw = fs.readFileSync(file, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeReports(data: ContentReport[]): void {
    ensureDir();
    const file = getReportsFile();
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
        reportsMtime = getFileMtime(file);
    } catch (err) {
        console.warn(`[reports-store] Could not write to ${file}:`, err);
    }
    reportsCache = data;
}

function getCachedReports(): ContentReport[] {
    const file = getReportsFile();
    const currentMtime = getFileMtime(file);
    if (!reportsCache || currentMtime !== reportsMtime) {
        reportsCache = readReports();
        reportsMtime = currentMtime;
    }
    return reportsCache;
}

export function getAllReports(): ContentReport[] {
    return [...getCachedReports()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getPendingReports(): ContentReport[] {
    return getAllReports().filter(r => r.status === 'pending');
}

export function getReportById(id: string): ContentReport | null {
    return getCachedReports().find(r => r.id === id) || null;
}

export function createReport(
    data: Omit<ContentReport, 'id' | 'createdAt' | 'status' | 'updatedAt' | 'resolvedAt' | 'resolvedBy'>
): ContentReport {
    const list = getCachedReports();
    const newReport: ContentReport = {
        ...data,
        id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        status: 'pending',
        createdAt: new Date().toISOString(),
    };
    list.unshift(newReport);
    writeReports(list);
    return newReport;
}

export function updateReport(
    id: string,
    updates: Partial<Pick<ContentReport, 'status' | 'adminNote' | 'resolvedAt' | 'resolvedBy'>>
): ContentReport | null {
    const list = getCachedReports();
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;

    list[idx] = {
        ...list[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    writeReports(list);
    return list[idx];
}

export function deleteReport(id: string): boolean {
    const list = getCachedReports();
    const filtered = list.filter(r => r.id !== id);
    if (filtered.length === list.length) return false;
    writeReports(filtered);
    return true;
}
