'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Page transition that zooms in from the center of the screen,
 * giving the feel of "opening" a page - like clicking into it.
 */
export function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'center top' }}
        >
            {children}
        </motion.div>
    );
}
