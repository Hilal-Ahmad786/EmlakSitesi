'use client';

import { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const slides = images.map(src => ({ src }));

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => {
                    setIndex(0);
                    setOpen(true);
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${images[0]})` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-primary shadow-lg">
                    <ImageIcon size={16} />
                    View All Photos ({images.length})
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.slice(1, 5).map((image, i) => (
                    <div
                        key={i}
                        className="relative h-24 md:h-32 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => {
                            setIndex(i + 1);
                            setOpen(true);
                        }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url(${image})` }}
                        />
                        {i === 3 && images.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-lg">
                                +{images.length - 5}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
            />
        </div>
    );
}
