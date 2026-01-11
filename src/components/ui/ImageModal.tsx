'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    altText: string;
}

export function ImageModal({ isOpen, onClose, imageSrc, altText }: ImageModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
                    aria-label="Close modal"
                >
                    <X size={32} />
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt={altText}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white"
                />
            </div>
        </div>
    );
}
