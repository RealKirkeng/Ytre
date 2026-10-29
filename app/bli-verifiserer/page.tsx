import type { Metadata } from 'next';
import { VerifierClient } from './VerifierClient';

export const metadata: Metadata = {
    title: 'Bli en verifiserer (Debattvert) | Ytre',
    description: 'Bli en del av Ytres førstelinje. Sørg for at debattrommet forblir fritt for reklame, hets og lovbrudd, samtidig som takhøyden for fri meningsbrytning holdes høy.',
};

export default function BliVerifisererPage() {
    return <VerifierClient />;
}
