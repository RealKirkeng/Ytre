import React from 'react';

export interface InlineImageData {
    src: string;
    align: 'full' | 'left' | 'center' | 'right';
    size: 'small' | 'medium' | 'large';
    alt?: string;
    caption?: string;
}

export function ArticleInlineImage({ src, align = 'center', size = 'medium', alt = '', caption }: InlineImageData) {
    if (!src) return null;

    // Alignment container classes
    let alignContainerClass = 'my-6 mx-auto block clear-both';
    let sizeClass = 'max-w-lg';

    if (align === 'full') {
        alignContainerClass = 'w-full my-6 sm:my-8 clear-both';
        sizeClass = 'w-full';
    } else if (align === 'left') {
        alignContainerClass = 'my-4 sm:float-left sm:mr-6 sm:mb-4 clear-left';
        if (size === 'small') sizeClass = 'sm:max-w-[240px] w-full';
        else if (size === 'medium') sizeClass = 'sm:max-w-[340px] w-full';
        else sizeClass = 'sm:max-w-[440px] w-full';
    } else if (align === 'right') {
        alignContainerClass = 'my-4 sm:float-right sm:ml-6 sm:mb-4 clear-right';
        if (size === 'small') sizeClass = 'sm:max-w-[240px] w-full';
        else if (size === 'medium') sizeClass = 'sm:max-w-[340px] w-full';
        else sizeClass = 'sm:max-w-[440px] w-full';
    } else {
        // center
        alignContainerClass = 'my-6 mx-auto block clear-both';
        if (size === 'small') sizeClass = 'max-w-xs';
        else if (size === 'medium') sizeClass = 'max-w-lg';
        else sizeClass = 'max-w-2xl w-full';
    }

    return (
        <figure className={`${alignContainerClass} ${sizeClass} not-prose select-none group`}>
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-sand-dark/40 bg-sand/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt || caption || 'Artikkelbilde'}
                    loading="lazy"
                    className="w-full h-auto object-cover max-h-[520px] transition-transform duration-300 group-hover:scale-[1.01]"
                />
            </div>
            {caption && (
                <figcaption className="text-xs text-ink-400 mt-2 text-center italic tracking-wide px-2 leading-relaxed">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
