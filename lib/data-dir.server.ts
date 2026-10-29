import fs from 'fs';
import path from 'path';

let cachedDataDir: string | null = null;

export function getDataDir(): string {
    if (cachedDataDir) return cachedDataDir;

    // In Vercel serverless / AWS Lambda, process.cwd() is read-only.
    // The only writable path is /tmp. We seed /tmp/ytre_data from process.cwd()/data on startup.
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        const tmpDir = path.join('/tmp', 'ytre_data');
        if (!fs.existsSync(tmpDir)) {
            try {
                fs.mkdirSync(tmpDir, { recursive: true });
                const seedDir = path.join(process.cwd(), 'data');
                if (fs.existsSync(seedDir)) {
                    for (const file of fs.readdirSync(seedDir)) {
                        const src = path.join(seedDir, file);
                        const dest = path.join(tmpDir, file);
                        if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
                            fs.copyFileSync(src, dest);
                        }
                    }
                }
            } catch (err) {
                console.warn('[data-dir] Error setting up /tmp directory:', err);
            }
        }
        cachedDataDir = tmpDir;
        return tmpDir;
    }

    const localDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
        try {
            fs.mkdirSync(localDir, { recursive: true });
        } catch {}
    }
    cachedDataDir = localDir;
    return localDir;
}
