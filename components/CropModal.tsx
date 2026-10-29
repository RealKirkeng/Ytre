'use client';

import { useState } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

const ZoomInIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
);

const ZoomOutIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
);
import { getCroppedImg } from '@/lib/image-utils';

interface CropModalProps {
    image: string;
    onClose: () => void;
    onCropComplete: (croppedImage: string) => void;
}

export function CropModal({ image, onClose, onCropComplete }: CropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-5 border-b border-sand-dark/30 flex items-center justify-between bg-sand/30">
                    <h3 className="font-display font-bold text-ink">Tilpass profilbilde</h3>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-sand text-ink-300 hover:text-ink transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cropper Container */}
                <div className="relative w-full aspect-square bg-[#1A1612]">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                        onZoomChange={setZoom}
                        classes={{
                            containerClassName: 'bg-[#1A1612]',
                        }}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6 bg-white">
                    <div className="flex items-center gap-4">
                        <ZoomOutIcon className="w-4 h-4 text-ink-300 shrink-0" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-1.5 bg-sand-dark/40 rounded-lg appearance-none cursor-pointer accent-fjord"
                        />
                        <ZoomInIcon className="w-4 h-4 text-ink-300 shrink-0" />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-2xl bg-white border border-sand-dark/60 text-ink font-semibold hover:bg-sand transition-all"
                        >
                            Avbryt
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-2xl text-white font-bold transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg,#5B89A8,#A87B8E)' }}
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Check className="w-5 h-5" />
                            )}
                            Bruk bilde
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
