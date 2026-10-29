import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'verifier_applications.json');

function getApplications() {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
    } catch {
        return [];
    }
}

function saveApplications(apps: any[]) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf-8');
    } catch (err) {
        console.error('Failed to save verifier application:', err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, age, motivation } = body;

        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            return NextResponse.json({ error: 'Vennligst fyll inn fullt navn.' }, { status: 400 });
        }
        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Vennligst oppgi en gyldig e-postadresse.' }, { status: 400 });
        }
        if (!motivation || motivation.trim().length < 10) {
            return NextResponse.json({ error: 'Skriv gjerne litt mer om hvorfor du vil bli debattvert/verifiserer.' }, { status: 400 });
        }

        const newApp = {
            id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            name: name.trim(),
            email: email.trim(),
            age: age ? String(age).trim() : 'Ikke oppgitt',
            motivation: motivation.trim(),
            createdAt: new Date().toISOString(),
            status: 'pending',
        };

        const list = getApplications();
        list.push(newApp);
        saveApplications(list);

        return NextResponse.json({ success: true, application: newApp });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Kunne ikke sende søknaden' }, { status: 500 });
    }
}
